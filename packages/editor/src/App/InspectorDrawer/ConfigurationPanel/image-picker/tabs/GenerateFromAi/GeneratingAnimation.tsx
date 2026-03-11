import { Sparkles } from 'lucide-react';


function GeneratingAnimation() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #a78bfa, #818cf8, #8b5cf6)',
          backgroundSize: '400% 400%',
          animation: 'shimmerGradient 3s ease infinite',
        }}
      />
      <div
        className="absolute inset-1 rounded-xl bg-white/20 backdrop-blur-sm"
        style={{ animation: 'morphPulse 2s ease-in-out infinite' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles
          className="w-8 h-8 text-white drop-shadow-lg"
          style={{ animation: 'sparkleRotate 4s linear infinite' }}
        />
      </div>
      <style>{`
        @keyframes shimmerGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes morphPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; border-radius: 12px; }
          50% { transform: scale(0.85); opacity: 0.6; border-radius: 20px; }
        }
        @keyframes sparkleRotate {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default GeneratingAnimation;