import axios from 'axios';

const apiHost = import.meta.env.VITE_API_HOST || 'localhost';
const apiPort = import.meta.env.VITE_API_PORT || '3000';

const instance = axios.create({
    baseURL: `http://${apiHost}:${apiPort}`,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;