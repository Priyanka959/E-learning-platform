import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Container, Chip } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../config';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MyCourses = () => {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCourses = async () => {
      setError('');
      if (!token) return;
      if (user?.role !== 'instructor') {
        setError('Only instructors have created courses.');
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/courses/my-courses`);
        setCourses(res.data.courses || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [token, user]);

  const getCategoryGradient = (category) => {
    const gradients = {
      Programming: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      Design: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
      Business: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      Marketing: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      General: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    };
    return gradients[category] || gradients.General;
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 4, md: 6 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0, 217, 181, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                My{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #00d9b5 0%, #33e3c7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Courses
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '1.1rem',
                }}
              >
                Manage and track your created courses
              </Typography>
            </Box>

            {user?.role === 'instructor' && (
              <Button
                variant="contained"
                component={RouterLink}
                to="/create-course"
                startIcon={<AddIcon />}
                sx={{ mt: { xs: 2, md: 0 } }}
              >
                Create Course
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 10,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                border: '3px solid rgba(0, 217, 181, 0.2)',
                borderTopColor: '#00d9b5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              px: 4,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <SchoolIcon sx={{ fontSize: 36, color: 'rgba(255, 255, 255, 0.3)' }} />
            </Box>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', maxWidth: '400px', mx: 'auto' }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              px: 4,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                borderRadius: '20px',
                background: 'rgba(0, 217, 181, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 217, 181, 0.2)',
              }}
            >
              <AddIcon sx={{ fontSize: 36, color: '#00d9b5' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              No courses yet
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', maxWidth: '400px', mx: 'auto', mb: 3 }}>
              Start sharing your knowledge by creating your first course
            </Typography>
            {user?.role === 'instructor' && (
              <Button
                variant="contained"
                component={RouterLink}
                to="/create-course"
                startIcon={<AddIcon />}
              >
                Create Your First Course
              </Button>
            )}
          </Box>
        )}

        {/* Course Grid */}
        {!loading && !error && courses.length > 0 && (
          <Grid container spacing={3} justifyContent="center">
            {courses.map(course => (
              <Grid item xs={12} sm={6} lg={4} key={course._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.02)',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      '& .course-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  {/* Course Header */}
                  <Box
                    className="course-image"
                    sx={{
                      height: 140,
                      background: getCategoryGradient(course.category),
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.4s ease',
                    }}
                  >
                    <SchoolIcon
                      sx={{
                        fontSize: 40,
                        color: 'rgba(255, 255, 255, 0.15)',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Chip
                      label={course.category || 'General'}
                      size="small"
                      sx={{
                        alignSelf: 'flex-start',
                        mb: 2,
                        backgroundColor: 'rgba(0, 217, 181, 0.1)',
                        color: '#00d9b5',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        border: '1px solid rgba(0, 217, 181, 0.2)',
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        mb: 1.5,
                        lineHeight: 1.3,
                      }}
                    >
                      {course.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.9rem',
                        mb: 2,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Button
                      component={RouterLink}
                      to={`/courses/${course._id}`}
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        alignSelf: 'flex-start',
                        color: '#00d9b5',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 217, 181, 0.1)',
                        },
                      }}
                    >
                      Manage Course
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyCourses;