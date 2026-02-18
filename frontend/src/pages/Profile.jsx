import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Avatar, Container, Card } from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';
import { API_URL } from '../config';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Profile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.user);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
      </Container>
    );
  }

  if (!profile) return null;

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 8 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(0, 217, 181, 0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 4,
              p: 4,
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '24px',
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#00d9b5',
                color: '#0a0a0a',
                fontSize: '2.5rem',
                fontWeight: 800,
                boxShadow: '0 0 40px rgba(0, 217, 181, 0.3)',
              }}
            >
              {profile.name?.[0]?.toUpperCase()}
            </Avatar>

            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  mb: 0.5,
                }}
              >
                {profile.name}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '1rem',
                  mb: 1.5,
                }}
              >
                {profile.email}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  bgcolor: 'rgba(0, 217, 181, 0.1)',
                  border: '1px solid rgba(0, 217, 181, 0.2)',
                  borderRadius: '20px',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: '#00d9b5',
                    borderRadius: '50%',
                  }}
                />
                <Typography
                  sx={{
                    color: '#00d9b5',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {profile.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Grid container spacing={3} justifyContent="center">
          {/* Stats Cards */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.02)',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'rgba(0, 217, 181, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SchoolIcon sx={{ fontSize: 28, color: '#00d9b5' }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#00d9b5',
                }}
              >
                {profile.completedLessons?.length || 0}
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                Lessons Completed
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.02)',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QuizIcon sx={{ fontSize: 28, color: '#6366f1' }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#6366f1',
                }}
              >
                {profile.quizResults?.length || 0}
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                Quizzes Taken
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.02)',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 28, color: '#f59e0b' }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#f59e0b',
                }}
              >
                {profile.quizResults?.length > 0 
                  ? Math.round(profile.quizResults.reduce((acc, r) => acc + r.score, 0) / profile.quizResults.length)
                  : 0}%
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                Avg Quiz Score
              </Typography>
            </Card>
          </Grid>

          {/* Quiz History */}
          <Grid item xs={12}>
            <Card
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Quiz History
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: '#00d9b5',
                    borderRadius: '50%',
                  }}
                />
              </Typography>

              {profile.quizResults?.length > 0 ? (
                <Box
                  sx={{
                    maxHeight: 350,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                    },
                  }}
                >
                  {profile.quizResults.map((result, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.04)',
                        },
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {result.quiz?.title || 'Quiz'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                          {new Date(result.completedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: '8px',
                          bgcolor: result.score >= 70 
                            ? 'rgba(16, 185, 129, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)',
                          border: `1px solid ${result.score >= 70 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: result.score >= 70 ? '#10b981' : '#ef4444',
                          }}
                        >
                          {result.score}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <QuizIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                  <Typography>No quizzes taken yet</Typography>
                  <Typography sx={{ fontSize: '0.9rem', mt: 1 }}>
                    Complete course quizzes to track your progress
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;