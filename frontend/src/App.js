import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
                {/* Route the root path to our new landing page */}
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
