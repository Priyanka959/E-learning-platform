import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import CreateCourse from './pages/CreateCourse';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import Profile from './pages/Profile';
import { useAuth } from '../context/AuthContext.jsx';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box className="App" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ flex: 1 }}>
        <Routes>
          {/* Full-width pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Contained pages */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}><CourseDetail /></Container>} />
          <Route path="/my-courses" element={<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>{isAuthenticated ? <MyCourses /> : <Login />}</Container>} />
          <Route path="/create-course" element={<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>{isAuthenticated && user?.role === 'instructor' ? <CreateCourse /> : <Home />}</Container>} />
          <Route path="/lessons/:id" element={<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>{isAuthenticated ? <LessonView /> : <Login />}</Container>} />
          <Route path="/quizzes/:id" element={<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>{isAuthenticated ? <QuizView /> : <Login />}</Container>} />
          <Route path="/profile" element={<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>{isAuthenticated ? <Profile /> : <Login />}</Container>} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
