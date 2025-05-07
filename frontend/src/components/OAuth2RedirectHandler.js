import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const username = params.get('username');

        if (token && userId && username) {
            // Save user and token to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ id: userId, username }));

            // Navigate to dashboard
            navigate("/Dashboard");
        } else {
            alert("Login failed: Missing user info");
            navigate("/login");
        }
    }, [location, navigate]);

    return null;
};

export default OAuth2RedirectHandler;
