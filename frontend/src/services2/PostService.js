import axios from '../api/axiosConfig';

const BASE_URL = '/api/posts';

// 1. Create a new post (with media)
const createPost = (formData) => {
  return axios.post(BASE_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 2. Get all posts
const getAllPosts = () => {
  return axios.get(BASE_URL);
};

// 3. Get a post by ID
const getPostById = (id) => {
  return axios.get(`${BASE_URL}/${id}`);
};

// 4. Delete a post by ID
const deletePost = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 5. Update post description
const updatePostDescription = (id, newDescription) => {
  return axios.put(`${BASE_URL}/${id}`, { description: newDescription });
};


// Export the service
const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePostDescription,
};

export default PostService;
