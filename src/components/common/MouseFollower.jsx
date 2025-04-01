import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

const MouseFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [scale, setScale] = useState(1);
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const computedStyle = element ? window.getComputedStyle(element).cursor : "default";
      setIsPointer(computedStyle === "pointer");
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    let animationFrame;
    const updatePosition = () => {
      setPosition((prev) => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.2,
        y: prev.y + (targetPos.current.y - prev.y) * 0.2,
      }));
      animationFrame = requestAnimationFrame(updatePosition);
    };
    updatePosition();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setScale((prev) => {
        const target = isPointer ? 1.8 : 1;
        return prev + (target - prev) * 0.1;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPointer]);

  if (!isHovered) return null;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          width: "12px",
          height: "12px",
          background: "radial-gradient(circle, #ff007f, #ff6b00)",
          borderRadius: "50%",
          transform: `translate(${position.x - 6}px, ${position.y - 6}px) scale(${scale})`,
          transition: "transform 0.15s ease-out, background 0.3s ease",
          mixBlendMode: "difference",
          boxShadow: "0 0 10px rgba(255, 105, 180, 0.5)",
        }}
      />
    </>
  );
};

export default MouseFollower;
