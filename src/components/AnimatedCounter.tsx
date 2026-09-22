import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  isActive: boolean;
  suffix?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, isActive, suffix = '', duration = 1200 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDisplay(0);
      return;
    }
    let start: number | null = null;
    let frame: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // smoothDecel [0.16,1,0.3,1] approx cubic bezier via easing
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isActive, value, duration]);

  return <>{display}{suffix}</>;
};
