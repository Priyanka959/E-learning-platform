import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Container, Alert, Chip } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../config';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LessonView = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      setLoading(true);
      try {
        const resLesson = await axios.get(`${API_URL}/api/lessons/${id}`);
        setLesson(resLesson.data);

        const courseId = resLesson.data.course?._id || resLesson.data.course;
        if (courseId) {
          const resQuizzes = await axios.get(`${API_URL}/api/quizzes/course/${courseId}`);
          setQuizzes(resQuizzes.data || []);
        }

        if (user?.role === 'student') {
          const resUser = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (resUser.data.user.completedLessons.includes(id)) {
            setCompleted(true);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, token]);

  const handleMarkComplete = async () => {
    try {
      await axios.post(`${API_URL}/api/progress/complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompleted(true);
    } catch (err) {
      setError('Failed to mark lesson as complete');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg">
        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 4,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            {error}
          </Alert>
        )}

        {lesson ? (
          <Box sx={{ py: { xs: 4, md: 6 } }}>
            {/* Lesson Header */}
            <Box
              sx={{
                mb: 4,
                p: 4,
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(0, 217, 181, 0.3), transparent)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {completed && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Completed"
                    sx={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      '& .MuiChip-icon': {
                        color: '#10b981',
                      },
                    }}
                  />
                )}
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                {lesson.title}
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {lesson.content}
              </Typography>
            </Box>

            {/* Video Section */}
            {lesson.videoUrl && (
              <Card
                sx={{
                  mb: 4,
                  background: 'rgba(255, 255, 255, 0.02)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlayCircleIcon sx={{ fontSize: 28, color: '#ef4444' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                      Video Lesson
                    </Typography>
                  </Box>
                  <Button
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      '&:hover': {
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      },
                    }}
                  >
                    Watch on YouTube
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Mark Complete Button */}
            {user?.role === 'student' && (
              <Box sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleMarkComplete}
                  disabled={completed}
                  startIcon={completed ? <CheckCircleIcon /> : null}
                  sx={{
                    py: 1.5,
                    px: 4,
                    background: completed 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : undefined,
                    '&.Mui-disabled': {
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      opacity: 1,
                    },
                  }}
                >
                  {completed ? 'Lesson Completed' : 'Mark as Complete'}
                </Button>
              </Box>
            )}

            {/* Quizzes Section */}
            <Box sx={{ mt: 6 }}>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Course Quizzes
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: '#00d9b5',
                    borderRadius: '50%',
                  }}
                />
              </Typography>

              {quizzes.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <QuizIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                  <Typography>No quizzes available for this course.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {quizzes.map(q => (
                    <Card
                      key={q._id}
                      component={RouterLink}
                      to={`/quizzes/${q._id}`}
                      sx={{
                        textDecoration: 'none',
                        background: 'rgba(255, 255, 255, 0.02)',
                        '&:hover': {
                          transform: 'translateX(8px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <QuizIcon sx={{ fontSize: 24, color: '#6366f1' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                            {q.title}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem' }}>
                            {q.questions?.length || 0} questions
                          </Typography>
                        </Box>
                        <ArrowForwardIcon sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography>Lesson not found.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default LessonView;