import requests
import json
import os
from fastapi import HTTPException
from typing import Dict, Any

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"

    def parse_resume_text(self, resume_text: str) -> Dict[str, Any]:
        prompt = f"""You are an AI Resume Parser integrated into a Full Stack application.

Your task:
- Read raw OCR text from resumes.
- Extract and normalize key resume details.
- Output ONLY valid JSON that follows the schema below.
- Do NOT include any text, comments, explanations, or markdown formatting.
- Return ONLY the JSON object, nothing else.

Schema:
{{
  "name": "string",
  "email": "string",
  "phone": "string",
  "skills": ["string"],
  "years_experience": number,
  "education": [
    {{
      "degree": "string",
      "major": "string",
      "institution": "string",
      "year": "string"
    }}
  ],
  "current_last_job": {{
    "title": "string",
    "company": "string",
    "start_date": "YYYY-MM",
    "end_date": "YYYY-MM or null"
  }},
  "companies_worked_at": ["string"],
  "linkedin": "string (optional)",
  "certifications": ["string (optional)"],
  "location": "string (optional)"
}}

Instructions:
1. Always output strictly valid JSON.
2. If a field is missing in the resume, return it as an empty string, null, or empty array [] depending on the type.
3. Normalize dates to "YYYY-MM".
4. Extract skills as a clean array of strings.
5. Do not invent details that are not in the resume.

<RESUME_TEXT>
{resume_text}
</RESUME_TEXT>"""

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1000,
                "temperature": 0
            }
            
            response = requests.post(self.base_url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()["choices"][0]["message"]["content"].strip()
            
            # Extract JSON from response if it contains extra text
            if result.startswith('```json'):
                result = result.replace('```json', '').replace('```', '').strip()
            elif result.startswith('```'):
                result = result.replace('```', '').strip()
            
            # Find JSON object in the response
            start = result.find('{')
            end = result.rfind('}') + 1
            if start != -1 and end != 0:
                result = result[start:end]
            
            return json.loads(result)
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Raw response: {result}")
            raise HTTPException(status_code=500, detail=f"Failed to parse AI response as JSON: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")

    def chat_about_resume(self, question: str, resume_data: Dict[str, Any]) -> str:
        prompt = f"""You are an AI assistant that answers questions about a specific resume. 
Only answer questions based on the resume data provided. If the information is not in the resume, say "This information is not available in the resume."

Resume Data:
{json.dumps(resume_data, indent=2)}

User Question: {question}

Provide a helpful and accurate answer based only on the resume data above."""

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
                "temperature": 0.3
            }
            
            response = requests.post(self.base_url, headers=headers, json=data)
            response.raise_for_status()
            
            return response.json()["choices"][0]["message"]["content"].strip()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")