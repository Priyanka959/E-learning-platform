import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../config';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import DownloadIcon from '@mui/icons-material/Download';

const QuizView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuiz(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchQuiz();
    }
  }, [id, token]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: Number.parseInt(value, 10),
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Please log in to submit the quiz');
      return;
    }

    const answersArray = quiz.questions.map((_, index) => answers[index] ?? -1);
    
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/quizzes/${id}/submit`,
        { answers: answersArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScore(res.data.score);
      setPassed(res.data.passed);
      setCertificateUrl(res.data.certificateUrl);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!certificateUrl) return;
    try {
      const response = await axios.get(`${API_URL}${certificateUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${quiz?.course?.title || 'course'}-certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download certificate');
    }
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
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
      <Container maxWidth="md">
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

        {quiz ? (
          <Box sx={{ py: { xs: 4, md: 6 } }}>
            {/* Quiz Header */}
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
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <QuizIcon sx={{ fontSize: 32, color: '#6366f1' }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 800,
                    }}
                  >
                    {quiz.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {quiz.questions?.length || 0} questions
                  </Typography>
                </Box>
              </Box>

              {!submitted && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                      Progress
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                      {Object.keys(answers).length} / {quiz.questions?.length || 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(Object.keys(answers).length / (quiz.questions?.length || 1)) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                      },
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Score Results */}
            {submitted && score !== null && (
              <Card
                sx={{
                  mb: 4,
                  background: passed 
                    ? 'rgba(16, 185, 129, 0.05)' 
                    : 'rgba(239, 68, 68, 0.05)',
                  border: passed
                    ? '1px solid rgba(16, 185, 129, 0.2)'
                    : '1px solid rgba(239, 68, 68, 0.2)',
                  textAlign: 'center',
                  p: 4,
                }}
              >
                <EmojiEventsIcon
                  sx={{
                    fontSize: 64,
                    color: getScoreColor(score, quiz.questions?.length || 1),
                    mb: 2,
                  }}
                />
                <Typography sx={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                  {passed ? '🎉 Congratulations! You Passed!' : 'Your Score'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '3rem',
                    fontWeight: 800,
                    color: getScoreColor(score, quiz.questions?.length || 1),
                    mb: 2,
                  }}
                >
                  {score} / {quiz.questions?.length || 0}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3 }}>
                  {((score / (quiz.questions?.length || 1)) * 100).toFixed(0)}% correct
                  {!passed && ' • You need 70% to pass'}
                </Typography>
                
                {passed && certificateUrl && (
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadCertificate}
                    sx={{
                      background: 'linear-gradient(135deg, #00d9b5 0%, #00b89c 100%)',
                      color: '#0a0a0a',
                      fontWeight: 700,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #33e3c7 0%, #00d9b5 100%)',
                      },
                    }}
                  >
                    Download Certificate
                  </Button>
                )}
              </Card>
            )}

            {/* Questions */}
            {quiz.questions?.map((question, qIndex) => (
              <Card
                key={qIndex}
                sx={{
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.02)',
                  position: 'relative',
                  overflow: 'hidden',
                  ...(submitted && {
                    borderColor: answers[qIndex] === question.correctAnswer
                      ? 'rgba(16, 185, 129, 0.3)'
                      : 'rgba(239, 68, 68, 0.3)',
                  }),
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                    <Chip
                      label={`Q${qIndex + 1}`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        fontWeight: 700,
                      }}
                    />
                    <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', flex: 1, color: 'rgba(255, 255, 255, 0.95)' }}>
                      {question.questionText}
                    </Typography>
                    {submitted && (
                      answers[qIndex] === question.correctAnswer ? (
                        <CheckCircleIcon sx={{ color: '#10b981' }} />
                      ) : (
                        <CancelIcon sx={{ color: '#ef4444' }} />
                      )
                    )}
                  </Box>

                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                      value={answers[qIndex]?.toString() ?? ''}
                      onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                    >
                      {question.options?.map((option, oIndex) => (
                        <FormControlLabel
                          key={oIndex}
                          value={oIndex.toString()}
                          disabled={submitted}
                          control={
                            <Radio
                              sx={{
                                color: 'rgba(255, 255, 255, 0.3)',
                                '&.Mui-checked': {
                                  color: '#00d9b5',
                                },
                              }}
                            />
                          }
                          label={option}
                          sx={{
                            mx: 0,
                            mb: 1,
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: submitted
                              ? oIndex === question.correctAnswer
                                ? 'rgba(16, 185, 129, 0.3)'
                                : answers[qIndex] === oIndex
                                  ? 'rgba(239, 68, 68, 0.3)'
                                  : 'rgba(255, 255, 255, 0.06)'
                              : answers[qIndex] === oIndex
                                ? 'rgba(0, 217, 181, 0.3)'
                                : 'rgba(255, 255, 255, 0.06)',
                            backgroundColor: submitted
                              ? oIndex === question.correctAnswer
                                ? 'rgba(16, 185, 129, 0.05)'
                                : answers[qIndex] === oIndex
                                  ? 'rgba(239, 68, 68, 0.05)'
                                  : 'transparent'
                              : answers[qIndex] === oIndex
                                ? 'rgba(0, 217, 181, 0.05)'
                                : 'transparent',
                            transition: 'all 0.2s ease',
                            '&:hover': !submitted && {
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            },
                            '& .MuiFormControlLabel-label': {
                              color: submitted && oIndex === question.correctAnswer
                                ? '#10b981'
                                : 'rgba(255, 255, 255, 0.8)',
                            },
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            ))}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  },
                }}
              >
                Back
              </Button>
              {!submitted && (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || Object.keys(answers).length === 0}
                  sx={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                    },
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <QuizIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
            <Typography>Quiz not found.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default QuizView;