import React, { useState, useEffect } from 'react';
import '../../styles/overlay.css';

interface OverlayProps {
  onOverlayClick: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ onOverlayClick }) => {
  const [countdown, setCountdown] = useState(3);
  const [startInterval, setStartInterval] = useState(false) 

  useEffect(() => {
    if (!startInterval) return 
    let countdownInterval: NodeJS.Timeout|undefined;

    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else {
      // If the countdown reaches 0, trigger onOverlayClick
      clearInterval(countdownInterval);
      onOverlayClick();
    }

    // Cleanup on unmount
    return () => {
      clearInterval(countdownInterval);
      // If the component unmounts before the countdown reaches 0, you might want to handle this case
    };
  }, [startInterval, countdown, onOverlayClick]);

  const handleClick = () => {
    setStartInterval(true)
  };

  return (
    <div className="overlay" onClick={handleClick}>
        {!startInterval && <p>시작</p>}
        {startInterval && countdown > 0 && <div className="countdown">{countdown}</div>}
    </div>
  );
};

export default Overlay;
