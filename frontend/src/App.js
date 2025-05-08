import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import PostList from './components/Posts/PostList';
import CreatePost from './components/Posts/CreatePost';
import React from 'react';
import NavigationBar from './components/NavigationBar';
import CreateLearningProgress from './components/CreateLearningProgress';
import ViewAllLearningProgress from './components/ViewAllLearningProgress';
import CreateLearningPlan from './components/CreateLearningPlan';
import ViewAllPlan from './components/ViewAllPlan';
import UpdateLearningProgress from './components/UpdateLearningProgress';
import UpdateLearningPlan from './components/UpdateLearningPlan';

function App() {
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


        <Route path="/" element={<CreateLearningProgress />} /> 
        <Route path="/progresses" element={<ViewAllLearningProgress />} />
        <Route path="/create-plan" element={<CreateLearningPlan />} />
        <Route path="/view-all-plans" element={<ViewAllPlan />} />
        <Route path="/update-plan/:id" element={<UpdateLearningPlan />} />
        <Route path="/update-progress/:progressId" element={<UpdateLearningProgress />} /> 
        <Route path="/update-plan-by-user/:userId/:progressName" element={<UpdateLearningPlan />} /> 

        
      </Routes>
      </div>
      </div>
    </Router> 
    
    </ThemeProvider>

  );
}

export default App;
