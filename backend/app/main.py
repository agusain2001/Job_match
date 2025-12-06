from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
import uuid
import shutil
import os
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.docx_extractor import extract_text_from_docx
from app.services.ai_matcher import analyze_candidate
from app.core.config import settings
from app.core.auth import create_access_token, verify_password
from datetime import timedelta
from jose import JWTError, jwt

app = FastAPI(title="Job Match API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

# In-memory storage
jobs = {}

def process_resumes(job_id: str, jd_text: str, resume_files: List[bytes], resume_names: List[str]):
    results = []
    
    for content, name in zip(resume_files, resume_names):
        try:
            # Extract text
            if name.lower().endswith('.pdf'):
                text = extract_text_from_pdf(content)
            elif name.lower().endswith('.docx'):
                text = extract_text_from_docx(content)
            else:
                text = "" # Unsupported or text file?
            
            if text:
                # Analyze
                analysis = analyze_candidate(text, jd_text)
                analysis['filename'] = name
                # If candidate name is unknown/error, try to use filename
                if analysis.get('candidate_name') in ["Unknown", "Error"]:
                    analysis['candidate_name'] = name
                results.append(analysis)
        except Exception as e:
            print(f"Error processing {name}: {e}")
            
    # Sort by score descending
    results.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
    
    jobs[job_id]['status'] = 'completed'
    jobs[job_id]['results'] = results

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Static check against env
    if form_data.username != settings.ADMIN_USERNAME or form_data.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/upload")
async def upload_job(
    background_tasks: BackgroundTasks,
    jd_text: Optional[str] = Form(None),
    jd_file: Optional[UploadFile] = File(None),
    resumes: List[UploadFile] = File(...),
    current_user: str = Depends(get_current_user)
):
    job_id = str(uuid.uuid4())
    
    # Get JD Text
    final_jd_text = ""
    if jd_text:
        final_jd_text = jd_text
    elif jd_file:
        content = await jd_file.read()
        if jd_file.filename.lower().endswith('.pdf'):
            final_jd_text = extract_text_from_pdf(content)
        elif jd_file.filename.lower().endswith('.docx'):
            final_jd_text = extract_text_from_docx(content)
        else:
            final_jd_text = content.decode('utf-8', errors='ignore')
    
    if not final_jd_text:
         raise HTTPException(status_code=400, detail="Job Description is required (text or file)")

    # Read resumes into memory to pass to background task
    # Note: For very large batches, this might consume memory. 
    # But for 10-500 files, it's usually okay if they aren't huge.
    resume_contents = []
    resume_names = []
    for resume in resumes:
        content = await resume.read()
        resume_contents.append(content)
        resume_names.append(resume.filename)
        
    jobs[job_id] = {
        "status": "processing",
        "total_files": len(resumes),
        "results": []
    }
    
    background_tasks.add_task(process_resumes, job_id, final_jd_text, resume_contents, resume_names)
    
    return {"job_id": job_id, "message": "Processing started"}

@app.get("/jobs/{job_id}")
def get_job_status(job_id: str, current_user: str = Depends(get_current_user)):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]
