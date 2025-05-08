import axios from 'axios';

const API_BASE_URL = 'http://localhost:5021/api/comments';
const NOTIFICATION_API_BASE_URL = 'http://localhost:5021/api/notifications';

const CommentService = {
  createComment: (commentData) => {
    return axios.post(API_BASE_URL, commentData);
  },

  getCommentsByPostId: (postId) => {
    return axios.get(`${API_BASE_URL}/post/${postId}`);
  },

  updateComment: (id, updatedComment) => {
    return axios.put(`${API_BASE_URL}/${id}`, updatedComment);
  },

  deleteComment: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  },

  getNotificationsByUserId: (userId) => {
    return axios.get(`${NOTIFICATION_API_BASE_URL}/user/${userId}`);
  }
};

export default CommentService;
