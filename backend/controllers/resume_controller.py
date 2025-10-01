from fastapi import File, UploadFile, HTTPException
from services.ocr_service import OCRService
from services.ai_service import AIService
from typing import Dict, Any

class ResumeController:
    def __init__(self):
        self.ocr_service = OCRService()
        self.ai_service = AIService()

    async def parse_resume(self, file: UploadFile = File(...)):
        print("Received file:", file.filename)
        print("File content type:", file.content_type)
        print("File headers:", file.headers)
        print("File:", file)
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        file_content = await file.read()
        file_extension = file.filename.lower().split('.')[-1]
        
        # Extract text based on file type
        if file_extension == 'pdf':
            resume_text = self.ocr_service.extract_text_from_pdf(file_content)
        elif file_extension in ['png', 'jpg', 'jpeg']:
            resume_text = self.ocr_service.extract_text_from_image(file_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")
        
        print("=== EXTRACTED TEXT BEFORE LLM ===")
        print(resume_text)
        print("=== END EXTRACTED TEXT ===")
        
        # Parse with AI
        parsed_data = self.ai_service.parse_resume_text(resume_text)
        
        return {
            "success": True,
            "data": parsed_data,
            "raw_text": resume_text
        }
    
    async def chat_about_resume(self, question: str, resume_data: Dict[str, Any]) -> Dict[str, str]:
        response = self.ai_service.chat_about_resume(question, resume_data)
        return {"response": response}