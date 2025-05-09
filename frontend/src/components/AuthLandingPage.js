import React, { useState } from 'react';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import { Box, Button, Paper, Container } from '@mui/material';

const AuthLandingPage = () => {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
                p: 2
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        backgroundColor: '#111',
                        color: '#fff'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Button
                            variant={showLogin ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => setShowLogin(true)}
                            sx={{ mx: 1 }}
                        >
                            Login
                        </Button>
                        <Button
                            variant={!showLogin ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => setShowLogin(false)}
                            sx={{ mx: 1 }}
                        >
                            Register
                        </Button>
                    </Box>

                    {/* Form renders */}
                    <Box sx={{ width: '100%', mt: 2 }}>
                        {showLogin ? <UserLogin embed /> : <UserRegister embed />}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthLandingPage;
