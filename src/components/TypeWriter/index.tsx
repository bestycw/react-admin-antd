import { useEffect, useState } from 'react';
import './index.scss';

interface TypeWriterProps {
  text: string;
  className?: string;
  speed?: number;
  showCursor?: boolean;
  loop?: boolean;
  loopDelay?: number;
}

const TypeWriter = ({ 
  text, 
  className = '', 
  speed = 150,
  showCursor = false,
  loop = false,
  loopDelay = 2000
}: TypeWriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isWaiting) {
      timer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, loopDelay);
      return () => clearTimeout(timer);
    }

    if (!loop && currentIndex === text.length) {
      return;
    }

    if (isDeleting) {
      if (displayText.length === 1) {
        setIsDeleting(false);
        setCurrentIndex(1);
        return;
      }

      timer = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, speed / 2);
    } else {
      if (currentIndex < text.length) {
        timer = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
      } else if (loop) {
        setIsWaiting(true);
      }
    }

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, loop, loopDelay, displayText, isDeleting, isWaiting]);

  useEffect(() => {
    setDisplayText(text[0] || '');
    setCurrentIndex(1);
    setIsDeleting(false);
    setIsWaiting(false);
  }, [text]);

  return (
    <div 
      className={`typewriter-text ${className} ${showCursor ? 'with-cursor' : ''}`}
      style={{ display: 'inline-block' }}
    >
      {displayText}
    </div>
  );
};

export default TypeWriter; 