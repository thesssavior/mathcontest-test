import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../../styles/whiteboard.css'; // Add your own CSS file for styling

const Whiteboard: React.FC = () => {
  // useRef: reference html elem
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // useCallback: use consistent function between rerenders
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const { offsetX, offsetY } = e;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !isDrawing) return;

    const { offsetX, offsetY } = e;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  }, [isDrawing]);

  const handleMouseUp = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (context) {
        context.closePath();
        setIsDrawing(false);
      }
    }
  }, [isDrawing]);
  // to be aware when you're not drawing, then not run at all, needs update. 

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas?.width||0, canvas?.height||0);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave]);

  return (
    <div className="whiteboard-container">
      <div>
        <button 
            className="inline-flex items-center rounded-md bg-blue-50 px-6 py-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100" 
            onClick={handleClear}>지우기</button>
      </div>
      <canvas ref={canvasRef} className="whiteboard"></canvas>
    </div>
  );
};

export default Whiteboard;
