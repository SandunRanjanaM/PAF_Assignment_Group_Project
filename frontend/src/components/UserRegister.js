import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// MUI
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    Avatar,
    CircularProgress,
    Paper,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip
} from '@mui/material';

const SKILL_OPTIONS = [
    'Painting',
    'Knitting',
    'Sculpting',
    'Origami',
    'Woodworking',
    'Pottery',
    'Calligraphy',
    'Crocheting',
    'Embroidery',
    'Jewelry Making'
];

const UserRegister = ({ embed }) => {
    const [user, setUser] = useState({
        userID: uuidv4(),
        username: '',
        email: '',
        password: '',
        bio: '',
        profilePicture: '',
        preferredSkills: []
    });

    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'unsigned_profile_upload');
        formData.append('cloud_name', 'dz2kgputl');

        try {
            const res = await axios.post(
                'https://api.cloudinary.com/v1_1/dz2kgputl/image/upload',
                formData
            );
            setUser(prev => ({ ...prev, profilePicture: res.data.secure_url }));
            setPreview(res.data.secure_url);
        } catch (err) {
            console.error("Image upload failed:", err);
            alert("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("user", JSON.stringify(user));

        try {
            const response = await AuthService.register(formData);
            console.log("User registered:", response.data);
            alert("User registered successfully!");

            localStorage.setItem("user", JSON.stringify(response.data));

            navigate(`/Dashboard`);
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Error registering user.");
        }
    };

    return (
        <Box
            sx={{
                ...(embed ? {} : {
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                })
            }}
        >
            <Container maxWidth="md">
                <Paper elevation={embed ? 0 : 6} sx={{ p: 6, borderRadius: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
                        User Registration
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    value={user.bio}
                                    onChange={handleChange}
                                    multiline
                                    rows={2}
                                />
                            </Grid>

                            {/* Preferred Skills Dropdown */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="skills-label">Preferred Skills</InputLabel>
                                    <Select
                                        labelId="skills-label"
                                        multiple
                                        value={user.preferredSkills}
                                        onChange={(e) =>
                                            setUser((prev) => ({ ...prev, preferredSkills: e.target.value }))
                                        }
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {SKILL_OPTIONS.map((skill) => (
                                            <MenuItem key={skill} value={skill}>
                                                {skill}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Profile Picture Upload */}
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                >
                                    Upload Profile Picture
                                    <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                                </Button>
                                {uploading && (
                                    <Box mt={2} textAlign="center">
                                        <CircularProgress size={24} />
                                    </Box>
                                )}
                                {preview && (
                                    <Box mt={2} display="flex" justifyContent="center">
                                        <Avatar src={preview} sx={{ width: 100, height: 100 }} />
                                    </Box>
                                )}
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Register
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default UserRegister;
