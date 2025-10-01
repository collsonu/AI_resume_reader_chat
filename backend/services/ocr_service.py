import pdfplumber
import pytesseract
from PIL import Image
import io
from fastapi import HTTPException

class OCRService:
    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> str:
        try:
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() or ""
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")

    @staticmethod
    def extract_text_from_image(file_content: bytes) -> str:
        try:
            image = Image.open(io.BytesIO(file_content))
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")