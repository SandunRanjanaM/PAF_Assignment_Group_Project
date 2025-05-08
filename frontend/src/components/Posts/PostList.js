import React, { useEffect, useState } from "react";
import PostService from "../../services2/PostService";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FolderIcon from "@mui/icons-material/Folder"
import { green } from "@mui/material/colors";
//import IconButton from '@mui/material/IconButton';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [mediaIndexMap, setMediaIndexMap] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    PostService.getAllPosts()
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handlePrevMedia = (postId) => {
    setMediaIndexMap((prev) => ({
      ...prev,
      [postId]: Math.max((prev[postId] || 0) - 1, 0),
    }));
  };

  const handleNextMedia = (postId, mediaLength) => {
    setMediaIndexMap((prev) => ({
      ...prev,
      [postId]: Math.min((prev[postId] || 0) + 1, mediaLength - 1),
    }));
  };

  const handleDelete = (postId) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    PostService.deletePost(postToDelete)
      .then(() => {
        setSnackbar({ open: true, message: 'Post deleted successfully.', severity: 'success' });
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postToDelete)
        );
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        setSnackbar({ open: true, message: 'An error occurred while deleting the post.', severity: 'error' });
      });
    setDeleteDialogOpen(false);
  };

  const openEditDialog = (postId, currentDescription) => {
    setCurrentPostId(postId);
    setEditedDescription(currentDescription);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    PostService.updatePostDescription(currentPostId, editedDescription)
      .then(() => {
        setSnackbar({ open: true, message: 'Description updated successfully.', severity: 'success' });
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === currentPostId
              ? { ...post, description: editedDescription }
              : post
          )
        );
        setEditDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        setSnackbar({ open: true, message: 'An error occurred while updating the description.', severity: 'error' });
      });
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      PostService.getAllPosts()
        .then((response) => setPosts(response.data))
        .catch((error) => console.error("Error fetching posts:", error));
    } else {
      PostService.searchPostsByHashtag(searchTerm.trim())
        .then((response) => setPosts(response.data))
        .catch((error) => console.error("Error searching posts:", error));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 1, mb: 3, p: 2, borderRadius: 2, background: 'linear-gradient(to right, #f8f9fa, #ffffff)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by hashtag or keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ef5350",
              color: "white",
              "&:hover": { backgroundColor: "#c62828" },
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
        <Card
          variant="outlined"
          onClick={() => navigate("/posts/create")}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: 2,
            borderRadius: 3,
            backgroundColor: "#fafafa",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            mb: 3,
          }}
        >
          <Avatar sx={{ mr: 2, bgcolor: green[500] }} >
            <FolderIcon/>
          </Avatar>
          <Typography color="text.secondary">Create a new post</Typography>
        </Card>
        <Stack spacing={4}>
          {posts.map((post) => (
            <Card key={post.id} elevation={3} sx={{ borderRadius: 3, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' } }}>
              <Stack spacing={1}>
                <Stack spacing={1} sx={{ position: "relative" }}>
                  {(() => {
                    const index = mediaIndexMap[post.id] || 0;
                    const url = post.mediaUrls[index];
                    const type = post.mediaTypes[index];
                    const isImage = type.startsWith("image");
                    const isVideo = type.startsWith("video");
                    return (
                      <CardMedia
                        component={isImage ? "img" : "video"}
                        src={url}
                        controls={isVideo}
                        sx={{
                          height: 300,
                          width: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                        alt={`Media ${index + 1}`}
                      />
                    );
                  })()}

                  {post.mediaUrls.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        px: 1,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handlePrevMedia(post.id)}
                        disabled={(mediaIndexMap[post.id] || 0) === 0}
                        sx={{ borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
                      >
                        ‹
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          handleNextMedia(post.id, post.mediaUrls.length)
                        }
                        disabled={
                          (mediaIndexMap[post.id] || 0) ===
                          post.mediaUrls.length - 1
                        }
                        sx={{ borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
                      >
                        ›
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Stack>
              <CardContent>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {post.description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <IconButton
                    onClick={() =>
                      setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p.id === post.id ? { ...p, liked: !p.liked } : p
                        )
                      )
                    }
                    color={post.liked ? "error" : "default"}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <IconButton
                    onClick={() => openEditDialog(post.id, post.description)}
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(post.id)}
                    aria-label="delete"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="comment" size="small">
                    <CommentIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Divider />

                <Typography variant="caption" color="text.secondary">
                  Created At: {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(to right, #f8f9fa, #ffffff)', color: '#424242', fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }}>
          Edit Description
        </DialogTitle>
        <DialogContent sx={{ p: 3, background: '#ffffff' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleDialogClose} sx={{ color: '#424242', '&:hover': { backgroundColor: '#e0e0e0' } }}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" sx={{ background: 'linear-gradient(45deg, #2563eb, #3b82f6)', color: 'white', '&:hover': { background: 'linear-gradient(45deg, #1d4ed8, #2563eb)' } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(to right, #f8f9fa, #ffffff)', color: '#424242', fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ p: 3, background: '#ffffff' }}>
          <Typography variant="body1">
            Are you sure you want to permanently delete this post?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#424242', '&:hover': { backgroundColor: '#e0e0e0' } }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ background: 'linear-gradient(45deg, #ef5350, #c62828)', color: 'white', '&:hover': { background: 'linear-gradient(45deg, #c62828, #b71c1c)' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostList;
