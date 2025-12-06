import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            onLogin(data.access_token);
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '400px', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginTop: 0, color: 'var(--primary)' }}>Admin Login</h2>
                {error && <div style={{ color: 'white', background: '#ef4444', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username</label>
                        <input
                            type="text"
                            className="glass"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                        <input
                            type="password"
                            className="glass"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
