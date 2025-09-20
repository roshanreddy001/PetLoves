import React from 'react';

interface ActivityErrorModalProps {
  message: string;
  onClose: () => void;
}

const ActivityErrorModal: React.FC<ActivityErrorModalProps> = ({ message, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 32,
        minWidth: 320,
        boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h2 style={{ color: '#d32f2f', marginBottom: 16 }}>Action Not Allowed</h2>
        <div style={{ marginBottom: 24, fontSize: 18 }}>{message}</div>
        <button
          onClick={onClose}
          style={{
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '10px 24px',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ActivityErrorModal;
