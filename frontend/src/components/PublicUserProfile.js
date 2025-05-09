import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';

const PublicUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debugging - log the ID
  

  useEffect(() => {
    // First check if ID is valid
    if (!id) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(storedUser);

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5021/api/v1/users/${id}`);
        setUser(res.data);
        
        if (storedUser) {
          setIsFollowing(res.data.followers?.includes(storedUser._id || storedUser.id));
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setError(err.response?.data?.message || "User not found");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]); // Removed navigate from dependencies



  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      await axios.put(`http://localhost:5021/api/v1/users/${currentUser._id || currentUser.id}/follow/${id}`);
      setIsFollowing(true);
      // Refresh user data
      const res = await axios.get(`http://localhost:5021/api/v1/users/${id}`);
      setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to follow user");
    }
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );

  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
        <Box display="flex" alignItems="center" gap={4} mb={3}>
          <Avatar
            alt={user.username}
            src={user.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"}
            sx={{ width: 112, height: 112 }}
          />
          <Box>
            <Typography variant="h4">{user.username}</Typography>
            <Typography mt={1}>{user.bio || 'No bio available.'}</Typography>

            {currentUser && currentUser._id !== id && (
              <Box mt={2}>
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  color="primary"
                  onClick={handleFollow}
                  disabled={isFollowing}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" gap={4} mb={2}>
          <Typography><strong>Followers:</strong> {user.followers?.length || 0}</Typography>
          <Typography><strong>Following:</strong> {user.following?.length || 0}</Typography>
        </Box>

        <Typography variant="h6">Posts:</Typography>
        <Typography color="text.secondary">User posts will be displayed here.</Typography>
      </Paper>
    </Container>
  );
};

export default PublicUserProfile;