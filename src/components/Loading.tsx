'use client';

import { useEffect, useState } from 'react';

interface LoadingProps {
  onComplete?: () => void;
}

export default function Loading({ onComplete }: LoadingProps = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 300);
          }
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  const displayProgress = Math.min(Math.round(progress), 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-20 h-20 mb-8 relative">
        <div className="absolute inset-0 rounded-full border-4 border-primary-200" />
        <div
          className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"
          style={{ animationDuration: '1s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-600">B</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">Beiyoo MBTI</h2>
      <p className="text-sm text-gray-500 mb-8">正在准备你的专属测试...</p>

      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-3">{displayProgress}%</p>
    </div>
  );
}
