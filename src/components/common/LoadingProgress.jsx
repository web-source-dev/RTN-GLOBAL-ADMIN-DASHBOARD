import React, { useState, useEffect } from 'react';
import { LinearProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';

const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let timer;
    setIsLoading(true);
    setProgress(0);

    const simulateProgress = () => {
      setProgress((oldProgress) => {
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 90);
      });
    };

    timer = setInterval(simulateProgress, 100);

    const cleanup = setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(hideTimer);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(cleanup);
    };
  }, [location]);

  if (!isLoading) return null;

  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 5,
        '& .MuiLinearProgress-bar': {
          backgroundColor: (theme) => theme.palette.primary.main,
        },
      }}
    />
  );
};

export default LoadingProgress;