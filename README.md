# Job Match AI

Job Match AI is an intelligent recruitment tool designed to automate the initial screening process. It uses Generative AI (Google Gemini 2.5 Flash) to analyze resumes against a specific Job Description (JD), providing a detailed relevance score, skill gap analysis, and fit verdict.

---

## 📚 Table of Contents
1. [Architecture & Approach](#1-architecture--approach)
2. [Features](#2-features)
3. [Project Structure](#3-project-structure)
4. [Setup Instructions](#4-setup-instructions)
5. [API Documentation](#5-api-documentation)

---

## 1. Architecture & Approach

### **High-Level Design**
The application utilizes a decoupled client-server architecture:

* **Frontend (Client):** Built with **React** and **Vite**, providing a responsive interface for administrators to log in, upload job descriptions and resumes, and view analysis results in real-time.
* **Backend (Server):** Built with **FastAPI** (Python). It handles authentication, file processing, and orchestration of AI services.
* **AI Engine:** Integrates with **Google Gemini 2.5 Flash** to perform natural language understanding and comparison between resumes and JDs.

### **Data Flow**
1.  **Authentication:** The user logs in via the frontend. The backend validates credentials and issues a JWT (JSON Web Token).
2.  **Upload:** User uploads a Job Description (text or file) and a batch of resumes (PDF/DOCX).
3.  **Processing (Async):** The backend immediately returns a `job_id` and spawns a background task.
    * **Text Extraction:** `pypdf` and `python-docx` extract raw text from uploaded files.
    * **AI Analysis:** Each resume is sent to the Gemini model with a prompt to compare it against the JD.
4.  **Polling:** The frontend polls the `/jobs/{job_id}` endpoint every 2 seconds to check progress.
5.  **Results:** Once processing is complete, the JSON data (scores, skills, summaries) is displayed and can be exported to CSV.

**Note:** Currently, the application uses **in-memory storage** (Python dictionaries) for job results. For production, this should be replaced with a persistent database (e.g., PostgreSQL or MongoDB).

---

## 2. Features

* **Secure Admin Access:** JWT-based authentication to protect the system.
* **Dual Input for JDs:** Supports pasting Job Description text directly or uploading a file (PDF/DOCX).
* **Bulk Resume Parsing:** Handle multiple resumes simultaneously.
* **AI-Powered Analysis:**
    * **Relevance Score:** 0-100% match rating.
    * **Fit Verdict:** "Good Fit", "Moderate Fit", or "Low Fit".
    * **Skill Gap Analysis:** Identifies both matched and missing skills.
    * **Executive Summary:** Generates a brief summary of the candidate's relevant experience.
    * **Strengths & Weaknesses:** Detailed breakdown of candidate pros and cons.
* **CSV Export:** One-click download of all analysis results for spreadsheet integration.

---

## 3. Project Structure

### **Backend (`/backend`)**
* **`app/main.py`**: The application entry point. Defines API routes and background tasks.
* **`app/core/config.py`**: Configuration management (loads environment variables).
* **`app/core/auth.py`**: Handles password hashing (bcrypt) and JWT token creation/validation.
* **`app/services/`**: Business logic modules.
    * `ai_matcher.py`: Interacts with Google Gemini API.
    * `pdf_extractor.py`: Extracts text from PDF files.
    * `docx_extractor.py`: Extracts text from DOCX files.
* **`requirements.txt`**: Python dependencies.

### **Frontend (`/frontend`)**
* **`src/api.js`**: Centralized API service for handling HTTP requests.
* **`src/components/`**: React components.
    * `Login.jsx`: Admin login form.
    * `UploadView.jsx`: Drag-and-drop interface for uploading files.
    * `ResultsView.jsx`: Displays the analysis grid and polling logic.
    * `CandidateModal.jsx`: Detailed popup view for a single candidate.
* **`src/App.jsx`**: Main routing and state management (Token handling).

---

## 4. Setup Instructions

### **Prerequisites**
* **Python 3.9+**
* **Node.js 16+**
* **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### **Backend Setup**

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Environment Variables:
    Create a `.env` file in the `backend` folder (or use the one provided) and update the following:
    ```env
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=password123
    SECRET_KEY=your_super_secret_key_here
    GOOGLE_API_KEY=your_google_gemini_api_key
    ```
5.  Start the server:
    ```bash
    uvicorn app.main:app --reload
    ```
    *The backend will run at `http://localhost:8000`*

### **Frontend Setup**

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The frontend will run at `http://localhost:5173` (or similar)*

---

## 5. API Documentation

### **Authentication**

#### `POST /token`
Obtain an access token for future requests.
* **Content-Type:** `application/x-www-form-urlencoded`
* **Body:**
    * `username`: (string)
    * `password`: (string)
* **Response:**
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1Ni...",
      "token_type": "bearer"
    }
    ```

### **Jobs**

#### `POST /upload`
Upload JD and Resumes to start processing.
* **Headers:** `Authorization: Bearer <token>`
* **Body (Multipart/Form-Data):**
    * `jd_text`: (string, optional) Text content of JD.
    * `jd_file`: (file, optional) JD file (PDF/DOCX).
    * `resumes`: (list of files) Resume files.
* **Response:**
    ```json
    {
      "job_id": "uuid-string",
      "message": "Processing started"
    }
    ```

#### `GET /jobs/{job_id}`
Check the status and get results for a specific job.
* **Headers:** `Authorization: Bearer <token>`
* **Response (Processing):**
    ```json
    {
      "status": "processing",
      "total_files": 5,
      "results": []
    }
    ```
* **Response (Completed):**
    ```json
    {
      "status": "completed",
      "results": [
        {
          "candidate_name": "John Doe",
          "relevance_score": 85,
          "fit_verdict": "Good Fit",
          "matched_skills": ["Python", "React"],
          "missing_skills": ["Docker"],
          "experience_summary": "...",
          "strengths": ["..."],
          "weaknesses": ["..."]
        }
      ]
    }
    ```
