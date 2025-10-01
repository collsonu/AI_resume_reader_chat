from fastapi import APIRouter, File, UploadFile
from controllers.resume_controller import ResumeController
from pydantic import BaseModel
from typing import Dict, Any

class ChatRequest(BaseModel):
    question: str
    resume_data: Dict[str, Any]

router = APIRouter()
resume_controller = ResumeController()

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    return await resume_controller.parse_resume(file)

@router.post("/chat")
async def chat_about_resume(request: ChatRequest):
    return await resume_controller.chat_about_resume(request.question, request.resume_data)

@router.get("/")
async def root():
    return {"message": "AI Resume Parser API"}