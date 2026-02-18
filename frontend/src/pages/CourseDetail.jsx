import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Chip,
  Collapse,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import QuizIcon from '@mui/icons-material/Quiz';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../config';

const getCategoryGradient = (category) => {
  const gradients = {
    'Web Development': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'Data Science': 'linear-gradient(135deg, #00d9b5 0%, #0ea5e9 100%)',
    'Mobile Development': 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    'DevOps': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    'Machine Learning': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    'Design': 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
  };
  return gradients[category] || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
};

const CourseDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      setLoading(true);
      try {
        const resCourse = await axios.get(`${API_URL}/api/courses/${id}`);
        setCourse(resCourse.data);

        const resLessons = await axios.get(`${API_URL}/api/lessons/course/${id}`);
        setLessons(resLessons.data);

        try {
          const resQuizzes = await axios.get(`${API_URL}/api/quizzes/course/${id}`);
          setQuizzes(resQuizzes.data || []);
        } catch (e) {
          setQuizzes([]);
        }

        if (user && user.role === 'student') {
          const resUser = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(resUser.data.user);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, token]);

  const isInstructorOfCourse = () => {
    if (!token || !user || !course) return false;
    const instructorId = course.instructor?._id || course.instructor;
    return user.role === 'instructor' && String(instructorId) === String(user.id || user._id);
  };

  const isCourseCompleted = () => {
    if (!currentUser || !lessons.length) return false;
    const completedIds = currentUser.completedLessons || [];
    return lessons.every(l => completedIds.includes(l._id));
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${course.title}-certificate.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Failed to download certificate. Make sure you have completed all lessons.');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/lessons/${lessonId}`);
      setLessons(prev => prev.filter(l => String(l._id) !== String(lessonId)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Delete this course and all its lessons? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/courses/${id}`);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value, optIndex) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== index) return q;
      if (field === 'question') return { ...q, question: value };
      if (field === 'option') {
        const opts = [...q.options];
        opts[optIndex] = value;
        return { ...q, options: opts };
      }
      if (field === 'answer') return { ...q, answer: value };
      return q;
    }));
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setError('');
    if (!quizTitle) { setError('Quiz title is required'); return; }
    for (const q of questions) {
      if (!q.question) { setError('Each question needs text'); return; }
      if (q.options.some(opt => !opt)) { setError('All option fields are required'); return; }
      if (!q.answer) { setError('Select an answer for each question'); return; }
    }
    setCreatingQuiz(true);
    try {
      const res = await axios.post(`${API_URL}/api/quizzes/create`, {
        title: quizTitle,
        courseId: id,
        questions,
      });
      setQuizzes(prev => [...prev, res.data.quiz]);
      setQuizTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
      setShowQuizForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    setCreating(true);
    try {
      const res = await axios.post(`${API_URL}/api/lessons/create`, {
        courseId: id,
        title,
        content,
        videoUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessons(prev => [...prev, res.data.lesson]);
      setTitle('');
      setContent('');
      setVideoUrl('');
      setShowLessonForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lesson');
    } finally {
      setCreating(false);
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
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {course ? (
          <Box sx={{ py: { xs: 4, md: 6 } }}>
            {/* Course Header */}
            <Box
              sx={{
                mb: 4,
                p: { xs: 3, md: 5 },
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: getCategoryGradient(course.category),
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    background: getCategoryGradient(course.category),
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 36, color: '#ffffff' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {course.category && (
                      <Chip
                        label={course.category}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          color: '#a78bfa',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {course.level && (
                      <Chip
                        label={course.level}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0, 217, 181, 0.1)',
                          color: '#00d9b5',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      fontWeight: 800,
                      mb: 2,
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '1.1rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {course.description}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlayLessonIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {lessons.length} lessons
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuizIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {quizzes.length} quizzes
                  </Typography>
                </Box>
              </Box>

              {/* Certificate Download for completed students */}
              {user?.role === 'student' && isCourseCompleted() && (
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadCertificate}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      },
                    }}
                  >
                    Download Certificate
                  </Button>
                </Box>
              )}
            </Box>

            {/* Instructor Controls */}
            {isInstructorOfCourse() && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={showLessonForm ? <ExpandLessIcon /> : <AddIcon />}
                    onClick={() => setShowLessonForm(!showLessonForm)}
                    sx={{
                      borderColor: 'rgba(0, 217, 181, 0.3)',
                      color: '#00d9b5',
                      '&:hover': {
                        borderColor: '#00d9b5',
                        backgroundColor: 'rgba(0, 217, 181, 0.1)',
                      },
                    }}
                  >
                    {showLessonForm ? 'Hide Lesson Form' : 'Add Lesson'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={showQuizForm ? <ExpandLessIcon /> : <AddIcon />}
                    onClick={() => setShowQuizForm(!showQuizForm)}
                    sx={{
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      color: '#6366f1',
                      '&:hover': {
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      },
                    }}
                  >
                    {showQuizForm ? 'Hide Quiz Form' : 'Add Quiz'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteCourse}
                    sx={{
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      '&:hover': {
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      },
                    }}
                  >
                    Delete Course
                  </Button>
                </Box>

                {/* Lesson Creation Form */}
                <Collapse in={showLessonForm}>
                  <Card
                    component="form"
                    onSubmit={handleCreateLesson}
                    sx={{
                      mb: 3,
                      background: 'rgba(255, 255, 255, 0.02)',
                      p: 3,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PlayLessonIcon sx={{ color: '#00d9b5' }} />
                      Create New Lesson
                    </Typography>
                    <TextField
                      fullWidth
                      label="Lesson Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TitleIcon sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Lesson Content"
                      value={content}
                      multiline
                      rows={4}
                      onChange={(e) => setContent(e.target.value)}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="YouTube Video URL (optional)"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button type="submit" variant="contained" disabled={creating}>
                      {creating ? 'Creating...' : 'Create Lesson'}
                    </Button>
                  </Card>
                </Collapse>

                {/* Quiz Creation Form */}
                <Collapse in={showQuizForm}>
                  <Card
                    component="form"
                    onSubmit={handleCreateQuiz}
                    sx={{
                      mb: 3,
                      background: 'rgba(255, 255, 255, 0.02)',
                      p: 3,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <QuizIcon sx={{ color: '#6366f1' }} />
                      Create New Quiz
                    </Typography>
                    <TextField
                      fullWidth
                      label="Quiz Title"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TitleIcon sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {questions.map((q, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          mb: 3,
                          p: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '12px',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={`Question ${idx + 1}`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              color: '#6366f1',
                              fontWeight: 600,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveQuestion(idx)}
                            sx={{ color: '#ef4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <TextField
                          fullWidth
                          label="Question Text"
                          value={q.question}
                          onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        {q.options.map((opt, oi) => (
                          <TextField
                            key={oi}
                            fullWidth
                            label={`Option ${oi + 1}`}
                            value={opt}
                            onChange={(e) => handleQuestionChange(idx, 'option', e.target.value, oi)}
                            sx={{ mb: 1 }}
                            size="small"
                          />
                        ))}
                        <Box sx={{ mt: 2 }}>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1, fontSize: '0.875rem' }}>
                            Correct Answer
                          </Typography>
                          <Select
                            fullWidth
                            value={q.answer}
                            onChange={(e) => handleQuestionChange(idx, 'answer', e.target.value)}
                            displayEmpty
                            size="small"
                          >
                            <MenuItem value="">Select correct answer</MenuItem>
                            {q.options.map((opt, oi) => (
                              <MenuItem key={oi} value={opt}>{opt || `Option ${oi + 1}`}</MenuItem>
                            ))}
                          </Select>
                        </Box>
                      </Box>
                    ))}

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddQuestion}
                      >
                        Add Question
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={creatingQuiz}
                        sx={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                          },
                        }}
                      >
                        {creatingQuiz ? 'Creating...' : 'Create Quiz'}
                      </Button>
                    </Box>
                  </Card>
                </Collapse>
              </Box>
            )}

            {/* Lessons Section */}
            <Box sx={{ mb: 6 }}>
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
                Lessons
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: '#00d9b5',
                    borderRadius: '50%',
                  }}
                />
              </Typography>

              {lessons.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    color: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <PlayLessonIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                  <Typography>No lessons yet.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {lessons.map((l, index) => (
                    <Card
                      key={l._id}
                      sx={{
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
                            bgcolor: 'rgba(0, 217, 181, 0.1)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontWeight: 700, color: '#00d9b5' }}>
                            {index + 1}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            component={RouterLink}
                            to={`/lessons/${l._id}`}
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              display: 'block',
                              textDecoration: 'none',
                              color: '#ffffff',
                              '&:hover': {
                                color: '#00d9b5',
                              },
                            }}
                          >
                            {l.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'rgba(255, 255, 255, 0.4)',
                              fontSize: '0.9rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {String(l.content).slice(0, 100)}...
                          </Typography>
                        </Box>
                        {l.videoUrl && (
                          <Chip
                            icon={<VideoLibraryIcon sx={{ fontSize: 16 }} />}
                            label="Video"
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              '& .MuiChip-icon': {
                                color: '#ef4444',
                              },
                            }}
                          />
                        )}
                        {currentUser?.completedLessons?.includes(l._id) && (
                          <CheckCircleIcon sx={{ color: '#10b981' }} />
                        )}
                        {isInstructorOfCourse() && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteLesson(l._id)}
                            sx={{ color: '#ef4444' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        <ArrowForwardIcon sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>

            {/* Quizzes Section */}
            <Box>
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
                Quizzes
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: '#6366f1',
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
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <QuizIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                  <Typography>No quizzes for this course yet.</Typography>
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
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                            color: '#6366f1',
                            '&:hover': {
                              borderColor: '#6366f1',
                              backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            },
                          }}
                        >
                          Take Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <SchoolIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
            <Typography>Course not found.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CourseDetail;