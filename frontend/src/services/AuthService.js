import axios from 'axios';

const API_BASE_URL = "http://localhost:5021/api/v1/users";

class AuthService {
    register(formData) {
        return axios.post(API_BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
    }

    login(credentials) {
        return axios.post(`${API_BASE_URL}/login`, credentials, {
            withCredentials: true,
        });
    }
}

export default new AuthService();
