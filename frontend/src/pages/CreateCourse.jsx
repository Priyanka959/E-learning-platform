import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, MenuItem, Select, FormControl, Container, InputAdornment } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({ title: '', description: '', category: '', level: 'Beginner', price: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.description) {
      setError('Title and description are required');
      return;
    }

    if (!token) {
      setError('You must be logged in as an instructor to create a course');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/courses/create`, form);
      setSuccess('Course created successfully');
      navigate('/my-courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        py: { xs: 4, md: 8 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 217, 181, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                mb: 1,
              }}
            >
              Create{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #00d9b5 0%, #33e3c7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Course
              </Box>
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', maxWidth: '500px', mx: 'auto' }}>
              Share your expertise with learners around the world
            </Typography>
          </Box>

          {/* Form Card */}
          <Box
            sx={{
              p: { xs: 3, md: 5 },
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
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                placeholder="Course title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                placeholder="Course description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <DescriptionIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Category (e.g., Programming)"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth>
                  <Select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <SignalCellularAltIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                      </InputAdornment>
                    }
                    sx={{
                      '& .MuiSelect-select': {
                        pl: 0,
                      },
                    }}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                placeholder="Price (USD)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={!loading && <ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                {loading ? 'Creating...' : 'Create Course'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateCourse;