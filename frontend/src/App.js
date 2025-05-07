import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
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
        <Routes>
          <Route path="/" element={<CreateLearningProgress />} />
          <Route path="/progresses" element={<ViewAllLearningProgress />} />
          <Route path="/create-plan" element={<CreateLearningPlan />} />
          <Route path="/view-all-plans" element={<ViewAllPlan />} />
          <Route path="/update-progress/:progressId" element={<UpdateLearningProgress />} />
          <Route path="/update-plan/:id" element={<UpdateLearningPlan />} />
          <Route path="/update-plan-by-user/:userId/:progressName" element={<UpdateLearningPlan />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
