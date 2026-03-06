import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Logging you in....',
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
        }}
      >
        <div
          aria-label="Loading"
          style={{
            width: 48,
            height: 48,
            borderRadius: '9999px',
            border: '4px solid #E5E7EB',
            borderTopColor: '#6366F1',
            animation: 'tinyAuthSpin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes tinyAuthSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div
          style={{
            fontSize: '1rem',
            color: '#212121',
            fontWeight: 500,
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
