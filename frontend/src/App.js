import './App.css';
//import "slick-carousel/slick/slick.css"; 
//import "slick-carousel/slick/slick-theme.css";
//import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/Posts/PostList';
import CreatePost from './components/Posts/CreatePost';



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/posts' element={<PostList/>}/>
        <Route path='/posts/create' element={<CreatePost/>}/>
      </Routes>
    </Router>
    
  );
}

export default App;
