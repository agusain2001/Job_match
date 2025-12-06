import google.generativeai as genai
import json
import os
from app.core.config import settings

# Configure API key
if settings.GOOGLE_API_KEY:
    genai.configure(api_key=settings.GOOGLE_API_KEY)

def analyze_candidate(resume_text: str, jd_text: str) -> dict:
    if not settings.GOOGLE_API_KEY:
        return _error_response("Missing API Key")

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        You are an expert technical recruiter AA. Analyze the candidate's resume against the Job Description.
        
        Job Description:
        {jd_text}
        
        Resume:
        {resume_text}
        
        Return a valid JSON object with the following fields:
        - candidate_name: str (extract from resume, or "Unknown")
        - relevance_score: int (0-100)
        - matched_skills: list[str]
        - missing_skills: list[str]
        - experience_summary: str (brief summary of relevant experience, max 2 sentences)
        - strengths: list[str]
        - weaknesses: list[str]
        - fit_verdict: str ("Good Fit", "Moderate Fit", "Low Fit")
        
        Output only valid JSON. No markdown formatting.
        """
        
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Error in AI matching: {e}")
        return _error_response("Analysis Failed")

def _error_response(msg: str) -> dict:
    return {
        "candidate_name": "Error",
        "relevance_score": 0,
        "matched_skills": [],
        "missing_skills": [],
        "experience_summary": msg,
        "strengths": [],
        "weaknesses": [],
        "fit_verdict": "Error"
    }
