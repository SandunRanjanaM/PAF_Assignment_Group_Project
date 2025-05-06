// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

import CreateComment from './components/CreateComment';
import NotificationViewer from './components/NotificationViewer';
import ViewCommentsByPost from './components/ViewCommentsByPost';

const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Comment & Notification System
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Add Comment
          </Button>
          <Button color="inherit" component={Link} to="/notifications">
            View Notifications
          </Button>
          <Button color="inherit" component={Link} to="/comments-by-post">
            Comments by Post
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<CreateComment />} />
          <Route path="/notifications" element={<NotificationViewer />} />
          <Route path="/comments-by-post" element={<ViewCommentsByPost />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
