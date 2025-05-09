import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import React from 'react';

import PostList from './components/Posts/PostList';
import CreatePost from './components/Posts/CreatePost';
import NavigationBar from './components/NavigationBar';

import CreateLearningProgress from './components/CreateLearningProgress';
import ViewAllLearningProgress from './components/ViewAllLearningProgress';
import CreateLearningPlan from './components/CreateLearningPlan';
import ViewAllPlan from './components/ViewAllPlan';
import UpdateLearningProgress from './components/UpdateLearningProgress';
import UpdateLearningPlan from './components/UpdateLearningPlan';
 
import AuthLandingPage from './components/AuthLandingPage'; // NEW
import UserProfile from './components/Dashboard';
import PublicUserProfile from './components/PublicUserProfile'; 
import UpdateProfile from './components/UpdateProfile'; 
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

import CreateComment from './components/CreateComment';
import NotificationViewer from './components/NotificationViewer';
import ViewCommentsByPost from './components/ViewCommentsByPost';
import CommentSection from './components/CommentSection';

const AppContent = () => {
  const location = useLocation();
  const showNavBar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div style={{ display: 'flex' }}>
      {showNavBar && <NavigationBar />}
      <div style={{ marginLeft: showNavBar ? 260 : 0, flex: 1, width: '100%' }}>
        <Routes>
          <Route path='/posts' element={<PostList/>}/>
          <Route path='/posts/create' element={<CreatePost/>}/>

          <Route path="/create-progress" element={<CreateLearningProgress />} /> 
          <Route path="/progresses" element={<ViewAllLearningProgress />} />
          <Route path="/create-plan" element={<CreateLearningPlan />} />
          <Route path="/view-all-plans" element={<ViewAllPlan />} />
          <Route path="/update-plan/:id" element={<UpdateLearningPlan />} />
          <Route path="/update-progress/:progressId" element={<UpdateLearningProgress />} /> 
          <Route path="/update-plan-by-user/:userId/:progressName" element={<UpdateLearningPlan />} />
          
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} /> 
          <Route path="/Dashboard" element={<UserProfile />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user/:id" element={<PublicUserProfile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          
          <Route path="/comments/:postId" element={<CommentSection />} />
          <Route path="/NotificationViewer" element={<NotificationViewer />} />
          <Route path="/notifications/:userId" element={<NotificationViewer />} />




      </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router> 
    </ThemeProvider>
  );
};

export default App;