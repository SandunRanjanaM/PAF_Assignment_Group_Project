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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
//import IconButton from '@mui/material/IconButton';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [mediaIndexMap, setMediaIndexMap] = useState({});

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this post?"
    );
    if (confirmDelete) {
      PostService.deletePost(postId)
        .then(() => {
          alert("Post deleted successfully.");
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== postId)
          );
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
          alert("An error occurred while deleting the post.");
        });
    }
  };

  const openEditDialog = (postId, currentDescription) => {
    setCurrentPostId(postId);
    setEditedDescription(currentDescription);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    PostService.updatePostDescription(currentPostId, editedDescription)
      .then(() => {
        alert("Description updated successfully.");
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
        alert("An error occurred while updating the description.");
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

  return (
    <>
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
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
            sx={{ backgroundColor: '#ef5350', color: 'white', '&:hover': { backgroundColor: '#c62828' } }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
        <Stack spacing={4}>
          {posts.map((post) => (
            <Card key={post.id} elevation={3} sx={{ borderRadius: 3 }}>
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
      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Description</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostList;
