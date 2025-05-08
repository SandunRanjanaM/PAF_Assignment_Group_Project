import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CreateLearningProgress from './components/CreateLearningProgress';
import ViewAllLearningProgress from './components/ViewAllLearningProgress';
import CreateLearningPlan from './components/CreateLearningPlan';
import ViewAllPlan from './components/ViewAllPlan';
import UpdateLearningPlan from './components/UpdateLearningPlan';
import UpdateLearningProgress from './components/UpdateLearningProgress'; 
import AuthLandingPage from './components/AuthLandingPage'; // NEW
import UserProfile from './components/Dashboard';
import PublicUserProfile from './components/PublicUserProfile'; 
import UpdateProfile from './components/UpdateProfile'; 
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateLearningProgress />} />
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

      </Routes>
    </Router>
  );
}

export default App;
