// UpdateProfile.js
import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Stack,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    OutlinedInput,
    Chip
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const allSkills = [
    "Painting", "Sculpting", "Knitting", "Woodworking",
    "Photography", "Embroidery", "Pottery", "Drawing"
];

const UpdateProfile = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        bio: '',
        profilePicture: ''
    });

    const [preferredSkills, setPreferredSkills] = useState([]);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setForm({
                username: storedUser.username || '',
                email: storedUser.email || '',
                bio: storedUser.bio || '',
                profilePicture: storedUser.profilePicture || ''
            });
            setPreferredSkills(storedUser.preferredSkills || []);
            setImagePreview(storedUser.profilePicture || '');
        }
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSkillChange = (e) => {
        setPreferredSkills(e.target.value);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "unsigned_profile_upload");

        try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dz2kgputl/image/upload",
                formData
            );
            setForm(prev => ({
                ...prev,
                profilePicture: res.data.secure_url
            }));
            setImagePreview(res.data.secure_url);
        } catch (err) {
            console.error("Image upload failed:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id || storedUser?.id;

        if (!userId) {
            console.error("User ID not found in localStorage!");
            return;
        }

        try {
            // Update basic profile info
            const res = await axios.put(`http://localhost:5021/api/v1/users/${userId}`, form);

            // Update preferred skills
            await axios.put(`http://localhost:5021/api/v1/users/${userId}/skills`, preferredSkills);

            const updatedUser = { ...res.data, preferredSkills };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            navigate("/dashboard");
        } catch (err) {
            console.error("Profile update failed:", err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Update Profile
                </Typography>

                <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar
                        src={imagePreview || "https://www.w3schools.com/howto/img_avatar.png"}
                        sx={{ width: 100, height: 100 }}
                    />
                </Box>

                <Stack spacing={2} component="form" onSubmit={handleSubmit}>
                    <Button variant="outlined" component="label">
                        Upload Profile Picture
                        <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                    </Button>

                    <TextField
                        label="Username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        required
                    />

                    <TextField
                        label="Bio"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        multiline
                        rows={3}
                    />

                    {/* Skills Multi-select */}
                    <FormControl fullWidth>
                        <InputLabel id="skills-label">Preferred Skills</InputLabel>
                        <Select
                            labelId="skills-label"
                            multiple
                            value={preferredSkills}
                            onChange={handleSkillChange}
                            input={<OutlinedInput label="Preferred Skills" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {allSkills.map((skill) => (
                                <MenuItem key={skill} value={skill}>
                                    {skill}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Save Changes
                    </Button>

                    <Button variant="outlined" color="secondary" onClick={() => navigate("/dashboard")}>
                        Cancel
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
};

export default UpdateProfile;
