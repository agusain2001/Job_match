import React, { useEffect, useState } from 'react';
import { getJobStatus } from '../api';
import CandidateModal from './CandidateModal';

const ResultsView = ({ jobId }) => {
    const [job, setJob] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        let interval;
        const fetchStatus = async () => {
            try {
                const data = await getJobStatus(jobId);
                setJob(data);
                if (data.status === 'completed') {
                    clearInterval(interval);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchStatus();
        interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, [jobId]);

    const handleExport = () => {
        if (!job || !job.results) return;
        const headers = ["Name", "Score", "Verdict", "Matched Skills", "Missing Skills", "Experience Summary"];
        const csvContent = [
            headers.join(","),
            ...job.results.map(c => [
                `"${c.candidate_name}"`,
                c.relevance_score,
                `"${c.fit_verdict}"`,
                `"${(c.matched_skills || []).join('; ')}"`,
                `"${(c.missing_skills || []).join('; ')}"`,
                `"${(c.experience_summary || '').replace(/"/g, '""')}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `job_match_results_${jobId}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!job) return <div className="container" style={{ textAlign: 'center' }}>Loading...</div>;

    if (job.status === 'processing') {
        return (
            <div className="container fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>Analyzing Resumes...</h2>
                <p className="text-muted">Processing {job.total_files} resumes. Please wait.</p>
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Analysis Results</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: '#0f172a', color: 'white' }} onClick={handleExport}>Export CSV</button>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>New Session</button>
                </div>
            </div>

            <div className="grid">
                {job.results.map((c, i) => (
                    <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{c.candidate_name}</h3>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{
                                    backgroundColor: c.relevance_score > 80 ? '#dcfce7' : c.relevance_score > 50 ? '#fef9c3' : '#fee2e2',
                                    color: c.relevance_score > 80 ? '#166534' : c.relevance_score > 50 ? '#854d0e' : '#991b1b',
                                    padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600
                                }}>
                                    {c.relevance_score}% Match
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>{c.fit_verdict}</span>
                            </div>
                        </div>
                        <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => setSelectedCandidate(c)}>
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {selectedCandidate && (
                <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
            )}
        </div>
    );
};

export default ResultsView;
