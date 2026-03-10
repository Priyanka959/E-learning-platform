import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, InputAdornment, IconButton, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../config';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const { user, token } = useAuth();

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/courses/${courseId}`);
      setCourses(prev => prev.filter(c => String(c._id) !== String(courseId)));
    } catch (err) {
      console.error('Failed to delete course', err);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await axios.get(`${API_URL}/api/courses?${params}`);
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please check your connection and try again.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

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

  const getCategoryImage = (category) => {
    const images = {
      Programming: '/programming.jpg',
      Design: '/design.jpg',
      Business: '/business.jpg',
      Marketing: '/marketing.jpg',
      General: '/hero-illustration.png',
    };
    return images[category] || images.General;
  };

  const getLevelColor = (level) => {
    const colors = {
      Beginner: '#10b981',
      Intermediate: '#f59e0b',
      Advanced: '#ef4444',
    };
    return colors[level] || '#00d9b5';
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
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
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Explore{' '}
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
                maxWidth: '600px',
              }}
            >
              Master the skills of tomorrow with our expertly crafted courses
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Search and Filter Bar */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search courses..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              size="small"
              sx={{
                flex: 1,
                minWidth: '200px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                p: 1,
                color: showFilters ? '#00d9b5' : 'rgba(255, 255, 255, 0.6)',
                '&:hover': {
                  borderColor: 'rgba(0, 217, 181, 0.3)',
                  backgroundColor: 'rgba(0, 217, 181, 0.05)',
                },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>

          {/* Expanded Filters */}
          {showFilters && (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 3,
                pt: 3,
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                flexWrap: 'wrap',
              }}
            >
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Programming">Programming</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                  label="Level"
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  label="Sort By"
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        {/* Error State */}
        {error && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '16px',
              mb: 4,
            }}
          >
            <Typography sx={{ color: '#ef4444', fontWeight: 600, mb: 1 }}>
              Could not load courses
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 2 }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={fetchCourses}
              sx={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444', '&:hover': { borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)' } }}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* Loading / Grid - only shown when no error */}
        {!error && loading ? (
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
            <Typography sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.5)' }}>
              Loading courses...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Course Grid */}
            <Grid container spacing={3} justifyContent="center">
              {courses.map((course) => (
                <Grid item xs={12} sm={6} lg={4} key={course._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.02)',
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        '& .course-image': {
                          transform: 'scale(1.05)',
                        },
                        '& .view-btn': {
                          opacity: 1,
                          transform: 'translateX(0)',
                        },
                      },
                    }}
                  >
                    {/* Course Image/Header */}
                    <Box
                      sx={{
                        height: 160,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)',
                          zIndex: 1,
                        },
                      }}
                    >
                      <Box
                        className="course-image"
                        component="img"
                        src={getCategoryImage(course.category)}
                        alt={course.category}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                      />

                      {/* Level Badge */}
                      <Chip
                        label={course.level}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          backdropFilter: 'blur(10px)',
                          color: getLevelColor(course.level),
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          border: `1px solid ${getLevelColor(course.level)}40`,
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                      {/* Category Tag */}
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

                      {/* Title */}
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.15rem',
                          mb: 1.5,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {course.title}
                      </Typography>

                      {/* Description */}
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
                          lineHeight: 1.6,
                        }}
                      >
                        {course.description}
                      </Typography>

                      {/* Instructor */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: 'rgba(255, 255, 255, 0.4)',
                          fontSize: '0.85rem',
                          mb: 2,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 16 }} />
                        <span>{course.instructor?.name || 'Unknown Instructor'}</span>
                      </Box>

                      {/* Footer with Actions */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 2,
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <Button
                          component={Link}
                          to={`/courses/${course._id}`}
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          className="view-btn"
                          sx={{
                            color: '#00d9b5',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            opacity: 0.8,
                            transform: 'translateX(-8px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 217, 181, 0.1)',
                            },
                          }}
                        >
                          View Details
                        </Button>

                        {token && user?.role === 'instructor' && 
                          String(course.instructor?._id || course.instructor) === String(user.id || user._id) && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCourse(course._id)}
                            sx={{
                              color: 'rgba(239, 68, 68, 0.7)',
                              '&:hover': {
                                color: '#ef4444',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Empty State */}
            {!loading && courses.length === 0 && (
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
                  <SearchIcon sx={{ fontSize: 36, color: 'rgba(255, 255, 255, 0.3)' }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  No courses found
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    maxWidth: '400px',
                    mx: 'auto',
                  }}
                >
                  Try adjusting your search or filter criteria to find what you're looking for.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Courses;