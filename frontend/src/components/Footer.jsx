import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Courses', path: '/courses' },
      { label: 'Professions', path: '/courses' },
      { label: 'Pricing', path: '/courses' },
    ],
    company: [
      { label: 'About Us', path: '/' },
      { label: 'Careers', path: '/' },
      { label: 'Contact', path: '/' },
    ],
    support: [
      { label: 'Help Center', path: '/' },
      { label: 'Terms of Service', path: '/' },
      { label: 'Privacy Policy', path: '/' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgba(0, 0, 0, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        pt: 6,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 32, color: '#00d9b5' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #00d9b5 0%, #33e3c7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Nexus
              </Typography>
            </Box>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                maxWidth: 280,
                mb: 3,
              }}
            >
              Empowering learners worldwide with cutting-edge courses designed for the future of work.
            </Typography>
            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <GitHubIcon />, label: 'GitHub' },
                { icon: <LinkedInIcon />, label: 'LinkedIn' },
                { icon: <TwitterIcon />, label: 'Twitter' },
              ].map((social) => (
                <IconButton
                  key={social.label}
                  size="small"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      color: '#00d9b5',
                      borderColor: 'rgba(0, 217, 181, 0.3)',
                      bgcolor: 'rgba(0, 217, 181, 0.1)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links Sections */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.platform.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#00d9b5',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#00d9b5',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#00d9b5',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Newsletter Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Stay Updated
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
              }}
            >
              Subscribe to our newsletter for the latest courses and updates.
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 5,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.8rem',
            }}
          >
            © {currentYear} Nexus Learning. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <Link
                key={item}
                component={RouterLink}
                to="/"
                sx={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
