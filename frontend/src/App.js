import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
     <Router>
      <div style={{ display: 'flex' }}>
         <NavigationBar/>
      <div style={{ marginLeft: 260, flex: 1, width: '100%' }}>
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


        <Route path="/CreateComment" element={<CreateComment />} />
        <Route path="/NotificationViewer" element={<NotificationViewer />} />
        <Route path="/ViewCommentsByPost/:postId" element={<ViewCommentsByPost />} />




      </Routes>
      </div>
      </div>
    </Router> 
    
    </ThemeProvider>

  );
};

export default App;
