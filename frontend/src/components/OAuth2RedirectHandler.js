import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuth2Redirect = async () => {
            try {
                // Get the user info from the backend
                const response = await axios.get('http://localhost:5021/oauth2/user', {
                    withCredentials: true
                });

                if (response.data.authenticated) {
                    // Store user data in localStorage
                    localStorage.setItem("user", JSON.stringify({
                        name: response.data.name,
                        email: response.data.email,
                        picture: response.data.picture
                    }));
                    
                    // Redirect to dashboard
                    navigate('/Dashboard');
                } else {
                    // Handle authentication failure
                    navigate('/login');
                }
            } catch (error) {
                console.error('OAuth2 redirect error:', error);
                navigate('/login');
            }
        };

        handleOAuth2Redirect();
    }, [navigate]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            background: 'linear-gradient(135deg, #1e3c72, #2a5298)'
        }}>
            <div style={{ 
                color: 'white', 
                fontSize: '1.2rem',
                textAlign: 'center'
            }}>
                Processing login...
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
