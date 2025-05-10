import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

// MUI
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const UserLogin = ({ embed }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.login(credentials);
            console.log("Login success:", response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            alert("Logged in successfully!");
            navigate('/Dashboard');
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert("Invalid credentials.");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5021/oauth2/authorization/google';
    };

    return (
        <Box
            sx={{
                ...(embed ? {} : {
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                })
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={embed ? 0 : 6} sx={{ p: 6, borderRadius: 4 }}>
                    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                        User Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Login
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        OR
                                    </Typography>
                                </Divider>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<GoogleIcon />}
                                    onClick={handleGoogleLogin}
                                    sx={{
                                        color: '#757575',
                                        borderColor: '#757575',
                                        '&:hover': {
                                            borderColor: '#424242',
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    Sign in with Google
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default UserLogin;
