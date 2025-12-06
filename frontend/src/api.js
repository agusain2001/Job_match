const API_URL = "http://localhost:8000";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
};

export const uploadJob = async (formData) => {
    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { ...getHeaders() },
        body: formData,
    });
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
    }
    if (!response.ok) throw new Error("Upload failed");
    return response.json();
};

export const getJobStatus = async (jobId) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        headers: { ...getHeaders() }
    });
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
    }
    if (!response.ok) throw new Error("Fetch failed");
    return response.json();
};
