import React, { useEffect } from 'react';

interface AutoCloseSuccessProps {
  onClose: () => void;
  children: React.ReactNode;
  delayMs?: number;
}

const AutoCloseSuccess: React.FC<AutoCloseSuccessProps> = ({ onClose, children, delayMs = 2000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, delayMs);
    return () => clearTimeout(timer);
  }, [onClose, delayMs]);

  return <>{children}</>;
};

export default AutoCloseSuccess;
