import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const navButtonStyle = (path) => ({
    color: isActive(path) ? '#00d9b5' : 'rgba(255, 255, 255, 0.7)',
    fontWeight: isActive(path) ? 600 : 500,
    fontSize: '0.9rem',
    padding: '8px 16px',
    borderRadius: '8px',
    position: 'relative',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
    },
    '&::after': isActive(path) ? {
      content: '""',
      position: 'absolute',
      bottom: '4px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '20px',
      height: '2px',
      backgroundColor: '#00d9b5',
      borderRadius: '1px',
    } : {},
  });

  const logoStyle = {
    fontWeight: 800,
    fontSize: '1.25rem',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #00d9b5 0%, #33e3c7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const navItems = [
    { label: 'Courses', path: '/courses', show: true },
    { label: 'My Courses', path: '/my-courses', show: isAuthenticated && user?.role === 'instructor' },
    { label: 'Create Course', path: '/create-course', show: isAuthenticated && user?.role === 'instructor' },
    { label: 'Profile', path: '/profile', show: isAuthenticated },
  ];

  const authItems = isAuthenticated
    ? [{ label: 'Logout', action: handleLogout }]
    : [
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register', isPrimary: true },
      ];

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        backgroundColor: 'rgba(10, 10, 10, 0.98)',
        backdropFilter: 'blur(20px)',
        padding: '24px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography component={Link} to="/" sx={logoStyle} onClick={() => setMobileOpen(false)}>
          ⚡ Nexus
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {isAuthenticated && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4, 
          p: 2, 
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#00d9b5', color: '#0a0a0a', fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.name || 'User'}</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'capitalize' }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      )}

      <List sx={{ mb: 2 }}>
        {navItems.filter(item => item.show).map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                color: isActive(item.path) ? '#00d9b5' : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: isActive(item.path) ? 'rgba(0, 217, 181, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 400 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {authItems.map((item, index) => (
          <Button
            key={index}
            fullWidth
            variant={item.isPrimary ? 'contained' : 'text'}
            component={item.path ? Link : 'button'}
            to={item.path}
            onClick={item.action || (() => setMobileOpen(false))}
            sx={{
              mb: 1,
              justifyContent: 'flex-start',
              color: item.isPrimary ? '#0a0a0a' : 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
          <Typography 
            component={Link} 
            to="/" 
            sx={{ ...logoStyle, flexGrow: { xs: 1, md: 0 }, mr: { md: 6 } }}
          >
            ⚡ Nexus
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
                {navItems.filter(item => item.show).map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={navButtonStyle(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {isAuthenticated && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: '#00d9b5', 
                        color: '#0a0a0a',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </Box>
                )}

                {authItems.map((item, index) => (
                  <Button
                    key={index}
                    variant={item.isPrimary ? 'contained' : 'text'}
                    component={item.path ? Link : 'button'}
                    to={item.path}
                    onClick={item.action}
                    size="small"
                    sx={{
                      fontSize: '0.85rem',
                      px: 2,
                      ...(item.isPrimary ? {} : {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                      })
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;