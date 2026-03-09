import { useEffect, useState } from 'react';

import { HELPFUL_TIPS, STAGE_MESSAGES } from './constant';
import GeneratingAnimation from './GeneratingAnimation';

function useRotatingIndex(items: string[], intervalMs: number, active: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const id = setInterval(() => setIndex((prev) => (prev + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [active, items.length, intervalMs]);
  return index;
}


function LoadingExperience() {
  const stageIndex = useRotatingIndex(STAGE_MESSAGES, 3500, true);
  const tipIndex = useRotatingIndex(HELPFUL_TIPS, 7000, true);
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <GeneratingAnimation />
      <div className="flex flex-col items-center gap-1.5 min-h-[44px]">
        <p
          key={`stage-${stageIndex}`}
          className="text-sm font-medium text-gray-700"
          style={{ animation: 'fadeSlideIn 0.4s ease-out' }}
        >
          {STAGE_MESSAGES[stageIndex]}
        </p>
      </div>
      <p
        key={`tip-${tipIndex}`}
        className="text-xs text-gray-400 text-center px-4 leading-relaxed italic"
        style={{ animation: 'fadeSlideIn 0.5s ease-out' }}
      >
        {HELPFUL_TIPS[tipIndex]}
      </p>
    </div>
  );
}

export default LoadingExperience;