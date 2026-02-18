import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Link, FormControl, Select, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password, formData.role);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(0, 217, 181, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(0, 217, 181, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Card */}
        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(30px)',
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
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              sx={{
                fontSize: '2rem',
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
                Account
              </Box>
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Join thousands of learners building their future
            </Typography>
          </Box>

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

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              placeholder="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <SchoolIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  </InputAdornment>
                }
                sx={{
                  '& .MuiSelect-select': {
                    pl: 0,
                  },
                }}
              >
                <MenuItem value="student">I want to learn (Student)</MenuItem>
                <MenuItem value="instructor">I want to teach (Instructor)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              placeholder="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              placeholder="Confirm password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
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
                mb: 3,
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <Typography align="center" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#00d9b5',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#33e3c7',
                  },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;