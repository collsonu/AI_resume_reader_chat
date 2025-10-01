# AI Resume Parser

Extract resume data from PDF/image files using OCR and AI.

## Quick Start with Docker

1. Add your Groq API key to `.env` file:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

2. Run with Docker:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Features

- Upload PDF, PNG, JPG, JPEG files
- OCR text extraction
- AI-powered data parsing
- Structured JSON output

## Tech Stack

- **Backend**: FastAPI + Tesseract OCR + Groq API
- **Frontend**: React components
- **AI**: Llama 3.1 8B Instant

## Manual Setup

1. Add Groq API key to `.env`
2. Install Tesseract OCR
3. Backend: `cd backend && pip install -r requirements.txt && python app.py`
4. Frontend: `cd frontend && npm install && npm start`