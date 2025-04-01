import { Box, Typography, keyframes, IconButton, useTheme, Slider, Tooltip } from "@mui/material";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SpeedIcon from '@mui/icons-material/Speed';
import { useState, useEffect } from 'react';

// Modified scroll animation for truly continuous movement
const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50%)); }
`;

// Pulse animation for visual interest
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Glow animation for enhanced visual effect
const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255,255,255,0.3); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,0.6); }
  100% { box-shadow: 0 0 5px rgba(255,255,255,0.3); }
`;

// Float animation for a more dynamic feel
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const Marquee = ({ initialSpeed = 20 }) => {
  const theme = useTheme();
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [showControls, setShowControls] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Enhanced services with more details for potential tooltips
  const services = [
    { text: "RTN Global Agency", icon: "✨", color: theme.palette.primary.light },
    { text: "Web Development", icon: "🌐", color: theme.palette.secondary.light },
    { text: "App Development", icon: "📱", color: theme.palette.primary.light },
    { text: "SEO Optimization", icon: "🔍", color: theme.palette.success.light },
    { text: "Digital Marketing", icon: "📱", color: theme.palette.info.light },
    { text: "Brand Strategy", icon: "🎯", color: theme.palette.warning.light },
    { text: "UI/UX Design", icon: "🎨", color: theme.palette.error.light },
    { text: "E-Commerce Solutions", icon: "🛒", color: theme.palette.secondary.dark }
  ];

  // Reset active index when mouse leaves the component
  useEffect(() => {
    if (!showControls) {
      setActiveIndex(-1);
    }
  }, [showControls]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSpeedChange = (_, newValue) => {
    setSpeed(newValue);
  };

  const handleServiceClick = (index) => {
    // Toggle active state
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        background: (theme) => `linear-gradient(135deg, 
          ${theme.palette.primary.dark} 0%, 
          ${theme.palette.primary.main} 25%, 
          ${theme.palette.secondary.main} 50%, 
          ${theme.palette.primary.main} 75%, 
          ${theme.palette.primary.dark} 100%)`,
        py: { xs: 2.5, md: 3.5 },
        position: 'relative',
        boxShadow: '0 4px 30px rgba(0,0,0,0.25)',
        borderTop: `2px solid ${theme.palette.primary.light}`,
        borderBottom: `2px solid ${theme.palette.primary.light}`,
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 40,
          left: 30,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/assets/circles.svg")',
          backgroundSize: '200px',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          zIndex: 0,
        },
        '&:after': {  // Fixing the incorrect `content` value
          content: '""',
          position: 'absolute',
          top: -100,
          left: 1000,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/assets/ball.svg")',
          backgroundSize: '200px',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          zIndex: 0,
        },
        '&:hover': {
          '& .controls': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        },
        cursor: 'default',
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Control panel */}
      <Box
        className="controls"
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(20px)',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '5px 15px',
          zIndex: 10,
          transition: 'all 0.3s ease',
          opacity: 0,
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        }}
      >
        <SpeedIcon sx={{ color: 'white', mr: 1, fontSize: '1.2rem' }} />
        <Slider
          value={speed}
          onChange={handleSpeedChange}
          min={5}
          max={40}
          step={1}
          sx={{
            width: 80,
            color: theme.palette.secondary.main,
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: `0 0 0 8px ${theme.palette.secondary.main}40`,
              }
            }
          }}
        />
        <IconButton
          onClick={togglePause}
          sx={{
            ml: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)',
              animation: `${pulse} 1s ease infinite`,
            },
          }}
          size="small"
        >
          {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
      </Box>

      {/* Main marquee content with continuous motion */}
      <Box
        className="marquee-container"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          className="marquee-content"
          sx={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: isPaused
              ? 'none'
              : `${scroll} ${speed}s linear infinite`,
            position: 'relative',
            zIndex: 1,
            // This ensures we have enough content for continuous scrolling
            width: 'fit-content',
          }}
        >
          {/* We render the services twice to ensure continuous scrolling */}
          {[...Array(2)].map((_, groupIndex) => (
            <Box
              key={`group-${groupIndex}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {services.map((service, index) => (
                <Tooltip
                  key={`${groupIndex}-${index}`}
                  title={`Learn more about our ${service.text} services`}
                  arrow
                  placement="top"
                >
                  <Box
                    onClick={() => handleServiceClick(index)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mx: { xs: 2, md: 4 },
                      position: 'relative',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '40px',
                      background: activeIndex === index
                        ? `linear-gradient(135deg, ${service.color}80, ${service.color}50)`
                        : 'rgba(255, 255, 255, 0.13)',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: activeIndex === index ? 'scale(1.1) translateY(-8px)' : 'scale(1)',
                      boxShadow: activeIndex === index
                        ? `0 15px 30px ${service.color}40`
                        : '0 5px 15px rgba(0,0,0,0.1)',
                      border: `1px solid ${activeIndex === index ? service.color : 'rgba(255,255,255,0.2)'}`,
                      cursor: 'pointer',
                      animation: activeIndex === index
                        ? `${float} 3s ease infinite`
                        : 'none',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${service.color}70, ${service.color}40)`,
                        transform: 'translateY(-5px) scale(1.05)',
                        animation: `${glow} 1.5s ease infinite`,
                        boxShadow: `0 10px 25px ${service.color}40`,
                        border: `1px solid ${service.color}`,
                      },
                    }}
                  >
                    <Typography
                      variant="span"
                      sx={{
                        fontSize: { xs: '1.7rem', md: '2.2rem' },
                        mr: 1.5,
                        animation: `${pulse} 2s ease infinite`,
                        animationDelay: `${index * 0.2}s`,
                        filter: activeIndex === index ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none',
                        transform: activeIndex === index ? 'scale(1.2)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {service.icon}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        color: activeIndex === index ? 'white' : 'rgba(255,255,255,0.85)',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        textShadow: activeIndex === index
                          ? `0 0 15px ${service.color}, 0 0 10px rgba(255,255,255,0.5)`
                          : '2px 2px 4px rgba(0, 0, 0, 0.3)',
                        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem' },
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          width: '0%',
                          height: '2px',
                          bottom: '-4px',
                          left: '0',
                          backgroundColor: service.color,
                          transition: 'width 0.3s ease',
                        },
                        '&:hover': {
                          color: 'white',
                          '&:after': {
                            width: '100%',
                          }
                        },
                      }}
                    >
                      {service.text}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Marquee;
