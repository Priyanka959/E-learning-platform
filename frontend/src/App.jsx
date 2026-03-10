import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from '../context/AuthContext.jsx';

const Home         = lazy(() => import('./pages/Home'));
const Login        = lazy(() => import('./pages/Login'));
const Register     = lazy(() => import('./pages/Register'));
const Courses      = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const MyCourses    = lazy(() => import('./pages/MyCourses'));
const CreateCourse = lazy(() => import('./pages/CreateCourse'));
const LessonView   = lazy(() => import('./pages/LessonView'));
const QuizView     = lazy(() => import('./pages/QuizView'));
const Profile      = lazy(() => import('./pages/Profile'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress sx={{ color: '#00d9b5' }} />
  </Box>
);

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box className="App" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
