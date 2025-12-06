import React, { useState } from 'react';
import { uploadJob } from '../api';

const UploadView = ({ onUploadSuccess }) => {
    const [jdText, setJdText] = useState('');
    const [jdFile, setJdFile] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleResumeChange = (e) => {
        setResumes([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jdText && !jdFile) return alert("Please provide a generic JD");
        if (resumes.length === 0) return alert("Please upload at least one resume");

        setLoading(true);
        try {
            const formData = new FormData();
            if (jdText) formData.append('jd_text', jdText);
            if (jdFile) formData.append('jd_file', jdFile);

            resumes.forEach((resume) => {
                formData.append('resumes', resume);
            });

            const data = await uploadJob(formData);
            onUploadSuccess(data.job_id);
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '800px' }}>
            <div className="card">
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Start New Job Match</h2>
                <form onSubmit={handleSubmit} className="grid">

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Job Description</label>
                        <textarea
                            className="glass"
                            style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid #ccc', resize: 'vertical' }}
                            placeholder="Paste Job Description here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                        <div style={{ textAlign: 'center', margin: '0.5rem 0', color: 'var(--text-muted)' }}>- OR -</div>
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={(e) => setJdFile(e.target.files[0])}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Upload Resumes (Max 500)</label>
                        <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', background: '#f1f5f9' }}>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.docx"
                                onChange={handleResumeChange}
                                style={{ display: 'none' }}
                                id="resume-upload"
                            />
                            <label htmlFor="resume-upload" style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}>
                                Click to browse
                            </label>
                            <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                                {resumes.length > 0 ? `${resumes.length} files selected` : "Drag PDF/DOCX files here"}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? "Uploading..." : "Start Analysis"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadView;
