import React from 'react';

const CandidateModal = ({ candidate, onClose }) => {
    if (!candidate) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
            <div className="card fade-in" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>

                <h2 style={{ marginTop: 0 }}>{candidate.candidate_name}</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{
                        backgroundColor: candidate.relevance_score > 80 ? '#dcfce7' : candidate.relevance_score > 50 ? '#fef9c3' : '#fee2e2',
                        color: candidate.relevance_score > 80 ? '#166534' : candidate.relevance_score > 50 ? '#854d0e' : '#991b1b',
                        padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600
                    }}>
                        {candidate.relevance_score}% Match
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{candidate.fit_verdict}</span>
                </div>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Summary</h4>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>{candidate.experience_summary}</p>
                </section>

                <div className="grid grid-cols-2">
                    <section>
                        <h4 style={{ marginBottom: '0.5rem', color: '#166534' }}>Matched Skills</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {candidate.matched_skills.map((s, i) => (
                                <span key={i} style={{ background: '#f0fdf4', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>{s}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 style={{ marginBottom: '0.5rem', color: '#991b1b' }}>Missing Skills</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {candidate.missing_skills.map((s, i) => (
                                <span key={i} style={{ background: '#fef2f2', color: '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>{s}</span>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="grid grid-cols-2" style={{ marginTop: '1.5rem' }}>
                    <section>
                        <h4 style={{ marginBottom: '0.5rem' }}>Strengths</h4>
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)' }}>
                            {candidate.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </section>
                    <section>
                        <h4 style={{ marginBottom: '0.5rem' }}>Weaknesses</h4>
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)' }}>
                            {candidate.weaknesses?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </section>
                </div>

            </div>
        </div>
    );
};

export default CandidateModal;
