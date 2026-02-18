import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 28 }} />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience in cutting-edge technologies.',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 28 }} />,
      title: 'Interactive Learning',
      description: 'Engage with hands-on projects, quizzes, and real-time feedback to accelerate your growth.',
    },
    {
      icon: <WorkspacePremiumIcon sx={{ fontSize: 28 }} />,
      title: 'Earn Certificates',
      description: 'Get recognized for your achievements with professional certificates upon completion.',
    },
  ];

  const professions = [
    {
      title: 'Machine Learning Engineer',
      duration: '12 months',
      lessons: '150 lessons',
      icon: <PsychologyIcon />,
      image: '/ml-engineer.jpg',
      gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    },
    {
      title: 'Full Stack Developer',
      duration: '8 months',
      lessons: '120 lessons',
      icon: <CodeIcon />,
      image: '/fullstack.jpg',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
      title: 'Cloud Architect',
      duration: '10 months',
      lessons: '100 lessons',
      icon: <TrendingUpIcon />,
      image: '/cloud.jpg',
      gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
    },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: { xs: '70vh', md: '75vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 4, md: 0 },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-15px)' },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0, 217, 181, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* Left Content */}
            <Box
              sx={{
                width: { xs: '100%', md: '50%' },
                textAlign: { xs: 'center', md: 'left' },
                py: { xs: 8, md: 0 },
                px: { xs: 2, md: 4 },
              }}
            >
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 3,
                  px: 2,
                  py: 0.75,
                  borderRadius: '100px',
                  background: 'rgba(0, 217, 181, 0.1)',
                  border: '1px solid rgba(0, 217, 181, 0.2)',
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#00d9b5',
                    boxShadow: '0 0 10px #00d9b5',
                  }}
                />
                <Typography sx={{ fontSize: '0.8rem', color: '#00d9b5', fontWeight: 600, letterSpacing: '0.05em' }}>
                  FUTURE OF LEARNING
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 3,
                  letterSpacing: '-0.03em',
                }}
              >
                Discover
                <br />
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #00d9b5 0%, #33e3c7 50%, #6366f1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  the professions
                </Box>
                <br />
                of the future
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  color: 'rgba(255, 255, 255, 0.6)',
                  maxWidth: '480px',
                  lineHeight: 1.8,
                  mb: 4,
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                Unlock the doors to the future job market and explore the most in-demand skills with our cutting-edge courses.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/register"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #00d9b5 0%, #00b89c 100%)',
                        boxShadow: '0 10px 40px rgba(0, 217, 181, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #33e3c7 0%, #00d9b5 100%)',
                          boxShadow: '0 15px 50px rgba(0, 217, 181, 0.4)',
                        },
                      }}
                    >
                      Start Learning Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/courses"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          borderColor: '#00d9b5',
                          backgroundColor: 'rgba(0, 217, 181, 0.05)',
                        },
                      }}
                    >
                      Explore Courses
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography
                      sx={{
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2,
                        width: '100%',
                      }}
                    >
                      Welcome back, <span style={{ color: '#00d9b5', fontWeight: 600 }}>{user?.name}</span>!
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/courses"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #00d9b5 0%, #00b89c 100%)',
                        boxShadow: '0 10px 40px rgba(0, 217, 181, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #33e3c7 0%, #00d9b5 100%)',
                        },
                      }}
                    >
                      Browse Courses
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/my-courses"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          borderColor: '#00d9b5',
                          backgroundColor: 'rgba(0, 217, 181, 0.05)',
                        },
                      }}
                    >
                      My Learning
                    </Button>
                  </>
                )}
              </Box>

              {/* Stats row */}
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 3, md: 5 },
                  mt: 6,
                  pt: 4,
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#00d9b5' }}>50+</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>Courses</Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#00d9b5' }}>10k+</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>Students</Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#00d9b5' }}>95%</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>Success Rate</Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Side - Hero Image */}
            <Box
              sx={{
                width: { xs: '100%', md: '45%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '650px',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '80%',
                    background: 'radial-gradient(circle, rgba(0, 217, 181, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    zIndex: 0,
                  },
                }}
              >
                <Box
                  component="img"
                  src="/hero-learning.jpg"
                  alt="E-Learning"
                  sx={{
                    width: '100%',
                    height: { xs: '400px', md: '600px' },
                    objectFit: 'cover',
                    borderRadius: '24px',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
                    animation: 'float 5s ease-in-out infinite',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Professions/Specialties Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 5,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Professions
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: '#00d9b5',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #00d9b5',
                  }}
                />
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/courses"
              endIcon={<ArrowForwardIcon />}
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                '&:hover': { color: '#00d9b5' },
              }}
            >
              Choose a Specialty
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {professions.map((profession, index) => (
              <Card
                key={index}
                component={Link}
                to="/courses"
                sx={{
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    borderColor: 'rgba(0, 217, 181, 0.4)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 217, 181, 0.2)',
                    '& .profession-overlay': {
                      opacity: 1,
                    },
                    '& .profession-image': {
                      transform: 'scale(1.1)',
                    },
                    '& .profession-arrow': {
                      transform: 'translateX(5px)',
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Image Section */}
                <Box
                  sx={{
                    height: '180px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Background Image */}
                  <Box
                    component="img"
                    src={profession.image}
                    alt={profession.title}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="profession-image"
                  />
                  {/* Gradient Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)',
                      zIndex: 1,
                    }}
                  />
                  {/* Hover Overlay */}
                  <Box
                    className="profession-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(0, 217, 181, 0.2) 0%, transparent 100%)',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      zIndex: 2,
                    }}
                  />
                </Box>
                {/* Content Section */}
                <CardContent
                  sx={{
                    p: 3,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      mb: 1.5,
                      color: '#ffffff',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {profession.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: 'rgba(0, 217, 181, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 217, 181, 0.2)',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', color: '#00d9b5', fontWeight: 600 }}>
                        {profession.duration}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                        {profession.lessons}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Arrow indicator */}
                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Explore courses
                    </Typography>
                    <ArrowForwardIcon
                      className="profession-arrow"
                      sx={{
                        fontSize: '1rem',
                        color: '#00d9b5',
                        opacity: 0.5,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              textAlign: 'center',
              mb: 2,
            }}
          >
            Why Choose{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #00d9b5 0%, #33e3c7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Nexus
            </Box>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              maxWidth: '600px',
              mx: 'auto',
              mb: 6,
            }}
          >
            Transform your career with our cutting-edge learning platform designed for the future.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover .feature-icon-box': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 0 40px rgba(0, 217, 181, 0.4)',
                  },
                }}
              >
                <Box
                  className="feature-icon-box"
                  sx={{
                    width: 64,
                    height: 64,
                    mb: 3,
                    background: 'linear-gradient(135deg, #00d9b5 0%, #00b89c 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0a0a0a',
                    boxShadow: '0 0 30px rgba(0, 217, 181, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    lineHeight: 1.7,
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, rgba(0, 217, 181, 0.05) 0%, transparent 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { value: '10K+', label: 'Active Learners' },
              { value: '500+', label: 'Expert Courses' },
              { value: '95%', label: 'Success Rate' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontWeight: 800,
                      color: '#00d9b5',
                      lineHeight: 1,
                      mb: 1,
                      textShadow: '0 0 30px rgba(0, 217, 181, 0.3)',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 4, md: 6 },
              background: 'linear-gradient(135deg, rgba(0, 217, 181, 0.1) 0%, rgba(0, 217, 181, 0.05) 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(0, 217, 181, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0, 217, 181, 0.5), transparent)',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
              }}
            >
              Ready to Start?
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 4,
                maxWidth: '500px',
                mx: 'auto',
              }}
            >
              Join thousands of learners who are already building the future. Start your journey today.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to={isAuthenticated ? "/courses" : "/register"}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              {isAuthenticated ? "Explore Courses" : "Get Started Free"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;