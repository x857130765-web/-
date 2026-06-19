/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface WelcomeViewProps {
  onStart: () => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
}

// Custom vector heart matching screenshot color style
const HeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} width="100%" height="100%">
    <path 
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
      fill="#faaf40"
    />
  </svg>
);

// High-fidelity character silhouettes mapping exact shapes from the reference image
const Silhouette1 = () => (
  <svg viewBox="0 0 60 110" className="w-[11%] max-w-[55px] h-[75px] md:h-[95px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
    <path d="M 30,10 C 20,10 16,18 16,28 C 16,34 18,38 22,40 C 18,48 14,70 12,95 L 48,95 C 46,70 42,48 38,40 C 42,38 44,34 44,28 C 44,18 40,10 30,10 Z" fill="#fcdd68" />
  </svg>
);

const Silhouette2 = () => (
  <svg viewBox="0 0 60 110" className="w-[11%] max-w-[55px] h-[75px] md:h-[95px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
    <circle cx="30" cy="12" r="8" fill="#fcdd68" />
    <path d="M 30,22 C 20,22 16,30 16,40 C 16,46 18,50 22,52 C 18,60 14,78 12,95 L 48,95 C 46,78 42,60 38,52 C 42,50 44,46 44,40 C 44,30 40,22 30,22 Z" fill="#fcdd68" />
  </svg>
);

const Silhouette3 = () => (
  <svg viewBox="0 0 60 110" className="w-[11%] max-w-[55px] h-[75px] md:h-[95px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
    <path d="M 30,12 C 16,12 12,24 12,45 C 12,65 14,80 15,95 L 45,95 C 46,80 48,65 48,45 C 48,24 44,12 30,12 Z" fill="#fcdd68" />
    <path d="M 22,38 L 10,95 L 50,95 L 38,38 Z" fill="#fcdd68" opacity="0.9" />
  </svg>
);

const Silhouette4 = () => (
  <svg viewBox="0 0 60 110" className="w-[11%] max-w-[55px] h-[75px] md:h-[95px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
    <circle cx="18" cy="20" r="7" fill="#fcdd68" />
    <circle cx="42" cy="20" r="7" fill="#fcdd68" />
    <path d="M 30,22 C 22,22 18,28 18,38 C 18,44 20,48 24,49 C 20,56 16,74 14,95 L 46,95 C 44,74 40,56 36,49 C 40,48 42,44 42,38 C 42,28 38,22 30,22 Z" fill="#fcdd68" />
  </svg>
);

const Silhouette5 = () => (
  <svg viewBox="0 0 60 110" className="w-[11%] max-w-[55px] h-[75px] md:h-[95px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
    <path d="M 21,3 L 39,3 L 37,21 L 23,21 Z" fill="#fcdd68" />
    <path d="M 30,21 C 22,21 18,27 18,37 C 18,43 20,47 24,48 C 18,55 14,71 12,95 L 48,95 C 46,71 42,55 36,48 C 40,47 42,43 42,37 C 42,27 38,21 30,21 Z" fill="#fcdd68" />
  </svg>
);

const Silhouette6 = () => (
  <svg viewBox="0 0 60 110" className="w-[11%] max-w-[55px] h-[75px] md:h-[95px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
    <path d="M 12,12 L 48,12 L 42,24 L 18,24 Z" fill="#fcdd68" />
    <line x1="15" y1="20" x2="15" y2="34" stroke="#fcdd68" strokeWidth="2.5" />
    <line x1="45" y1="20" x2="45" y2="34" stroke="#fcdd68" strokeWidth="2.5" />
    <path d="M 30,24 C 22,24 18,30 18,40 C 18,46 20,50 24,51 C 20,58 15,76 13,95 L 47,95 C 45,76 40,58 36,51 C 40,50 42,46 42,40 C 42,30 38,24 30,24 Z" fill="#fcdd68" />
  </svg>
);

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, isMuted, setIsMuted }) => {
  const [bgError, setBgError] = useState<boolean>(false);
  const [btnError, setBtnError] = useState<boolean>(false);

  // Definitive structured data matching floating hearts
  const floatingHeartsData = [
    { left: '23%', top: '8%', size: '15px', delay: '0s' },
    { left: '40%', top: '10%', size: '10px', delay: '1s' },
    { left: '65%', top: '9%', size: '14px', delay: '2.5s' },
    { left: '76%', top: '12%', size: '11px', delay: '3.1s' },
    { left: '14%', top: '25%', size: '13px', delay: '1.8s' },
    { left: '24%', top: '28%', size: '10px', delay: '0.5s' },
    { left: '73%', top: '28%', size: '12px', delay: '2.2s' },
    { left: '16%', top: '48%', size: '14px', delay: '1.4s' },
    { left: '27%', top: '55%', size: '11px', delay: '2.8s' },
    { left: '74%', top: '53%', size: '12px', delay: '1.9s' },
    { left: '84%', top: '41%', size: '13px', delay: '0.8s' },
  ];

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-[#fff4d2] flex flex-col items-center justify-between p-6 select-none font-sans" 
      id="welcome-view-container"
    >
      {/* 1. PHYSICAL FILE INPUT FOR resources/home_background.png */}
      <img 
        src="/resources/home_background.png" 
        alt="首页背景" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* 2. FLOATING MUSIC TOGGLE BUTTON (From Image 3 UI detail in the top right corner) */}
      <button 
        onClick={() => {
          setIsMuted(!isMuted);
        }}
        className="absolute top-4 right-4 w-8 h-8 rounded-full hover:scale-105 active:scale-95 transition-transform z-20 flex items-center justify-center overflow-hidden"
        title={isMuted ? "开启背景音乐" : "静音"}
        id="btn-welcome-music"
      >
        <img 
          src={isMuted ? "/resources/home_music_off.png" : "/resources/home_music_on.png"} 
          alt="music toggle" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </button>

      {/* 3. PLAY-START BUTTON (Loads resources/home_start_button.png) */}
      <div 
        className="absolute left-0 right-0 flex justify-center items-center z-25"
        style={{ bottom: 'calc(16% + 80px)' }}
      >
        <img 
          src="/resources/home_start_button.png" 
          alt="スタート" 
          className="w-[157px] h-auto object-contain cursor-pointer hover:scale-108 active:scale-95 transition-all drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
          onClick={() => {
            onStart();
          }}
          referrerPolicy="no-referrer"
        />
      </div>

    </div>
  );
};
