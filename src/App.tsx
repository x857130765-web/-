/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppPhase, EraType, AvatarState } from './types';
import { WelcomeView } from './components/WelcomeView';
import { EraSelectView } from './components/EraSelectView';
import { QuizView } from './components/QuizView';
import { BuildPhaseView } from './components/BuildPhaseView';
import { FinalDisplayView } from './components/FinalDisplayView';
import { AnimatePresence, motion } from 'motion/react';

// Central Master State Coordinates for default look
const INITIAL_AVATAR_STATE: AvatarState = {
  era: 'tang',
  brows: 'brows_mayu2',
  eyes: 'eyes_gentle',
  lips: 'lips_butterfly',
  blush: 'blush_peach',
  markings: 'markings_lotus',
  hair: 'hair_tang',
  clothing: 'clothing_tang',
  accessories: 'acc_fan',
  bgColor: 'bg-[#faf6eb]'
};

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome');
  const [avatarState, setAvatarState] = useState<AvatarState>(INITIAL_AVATAR_STATE);
  const [activeBuildTab, setActiveBuildTab] = useState<string | undefined>(undefined);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Background music audio controller
  useEffect(() => {
    const audio = document.getElementById('global-bg-music') as HTMLAudioElement;
    if (!audio) return;
    
    const handleUserGesture = () => {
      if (!isMuted) {
        audio.play().catch((err) => {
          console.log("Audio autoplay waiting for user click:", err);
        });
      }
    };
    
    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('touchstart', handleUserGesture, { once: true });
    
    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };
  }, [isMuted]);

  useEffect(() => {
    const audio = document.getElementById('global-bg-music') as HTMLAudioElement;
    if (audio) {
      if (isMuted) {
        audio.pause();
      } else {
        audio.play().catch(e => console.log('BGM play failed, waiting for user interaction: ', e));
      }
    }
  }, [isMuted]);

  // Global click sound effect controller
  useEffect(() => {
    const playClickSound = (e: MouseEvent) => {
      if (isMuted) return;
      
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Skip standard click SFX for quiz answer options, since they play their own special sounds
      if (target.closest('.quiz-option-button')) {
        return;
      }
      
      const isClickable = 
        target.closest('button') || 
        target.closest('[role="button"]') || 
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.classList.contains('cursor-pointer');
        
      if (isClickable) {
        const sfxAudio = document.getElementById('click-sound-sfx') as HTMLAudioElement;
        if (sfxAudio) {
          sfxAudio.currentTime = 0;
          sfxAudio.play().catch((err) => {
            console.log("SFX playback failed:", err);
          });
        }
      }
    };
    
    window.addEventListener('click', playClickSound, { capture: true });
    return () => {
      window.removeEventListener('click', playClickSound, { capture: true });
    };
  }, [isMuted]);

  // Transition: Welcome -> Era Select
  const handleStartWelcome = () => {
    setPhase('era_select');
  };

  // Transition: Era selected -> Load default values -> Start Stage 1.5 (Quiz Trivia Board)
  const handleSelectEra = (era: EraType, defaultState: Omit<AvatarState, 'era'>) => {
    setAvatarState({
      era,
      ...defaultState
    });
    setPhase('quiz'); // Transit directly to the trivia questionnaire!
  };

  // Transition: Correctly Answered Quiz -> Face customizer
  const handleQuizCorrect = () => {
    setActiveBuildTab('brows');
    setAvatarState((prev) => ({
      ...prev,
      brows: 'brows_none',
      eyes: 'eyes_none',
      lips: 'lips_none',
      blush: 'blush_none',
      markings: 'markings_none',
      hair: 'hair_none',
      clothing: 'clothing_none',
      accessories: 'acc_none',
    }));
    setPhase('face_build');
  };

  // Transition: Phase 1 (Face) -> Phase 2 (Overall)
  const handleNextFromFace = () => {
    setActiveBuildTab('hair');
    setPhase('overall_build');
  };

  // Transition: Phase 2 (Overall) -> Final Poster Exhibition
  const handleNextFromOverall = () => {
    setPhase('display');
  };

  // Navigation Backward
  const handlePrevFromQuiz = () => {
    setPhase('era_select');
  };

  // Navigation from face customizer back to quiz
  const handlePrevFromFace = () => {
    setPhase('quiz');
  };

  // Navigation from overall customizer back to face customizer (starts on 'eyes' tab)
  const handlePrevFromOverall = () => {
    setActiveBuildTab('eyes');
    setPhase('face_build');
  };

  // Restart Customization Flow entirely
  const handleRestart = () => {
    setPhase('era_select');
  };

  const handleBackToStep2Markings = () => {
    setActiveBuildTab('markings');
    setPhase('overall_build');
  };

  // Reset to Welcome Page
  const handleGoHome = () => {
    setPhase('welcome');
    setAvatarState(INITIAL_AVATAR_STATE);
    setActiveBuildTab(undefined);
  };

  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1080,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    // Force call immediately
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const targetWidth = 1080;
  const targetHeight = 720;
  
  // Use slightly less padding on mobile to optimize screen area
  const padding = dimensions.width < 640 ? 12 : 32;
  const availableWidth = Math.max(200, dimensions.width - padding);
  const availableHeight = Math.max(200, dimensions.height - padding);

  let scale = Math.min(availableWidth / targetWidth, availableHeight / targetHeight);
  // Cap upscale to 1.3 to avoid oversized containers
  if (scale > 1) {
    scale = Math.min(scale, 1.3);
  }

  return (
    <div className="min-h-screen bg-[#ece0c9] flex items-center justify-center p-2 sm:p-4 overflow-hidden font-sans select-none antialiased">
      {/* Background silk grain texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-color-burn bg-[radial-gradient(#8f7253_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Responsive Viewport Wrapper that locks aspect ratio flow space precisely in the DOM */}
      <div 
        className="flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{
          width: `${targetWidth * scale}px`,
          height: `${targetHeight * scale}px`,
          transition: 'width 0.15s ease-out, height 0.15s ease-out',
        }}
        id="responsive-scaled-viewport"
      >
        {/* Main Classical Cabinet Container representing the dress up game console */}
        <motion.div 
          className="w-[1080px] h-[720px] bg-[#f5ebd2] rounded-3xl overflow-hidden relative shadow-2xl flex-shrink-0"
          style={{
            boxShadow: '0 25px 60px -15px rgba(100, 75, 45, 0.45)',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          initial={{ opacity: 0, scale: scale * 0.98 }}
          animate={{ opacity: 1, scale: scale }}
          transition={{ duration: 0.4 }}
          id="classical-game-display-cabinet"
        >
          {/* Dynamic Phase Controller Switcher */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              {phase === 'welcome' && (
                <WelcomeView 
                  onStart={handleStartWelcome} 
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                />
              )}

              {phase === 'era_select' && (
                <EraSelectView onSelectEra={handleSelectEra} onHome={handleGoHome} />
              )}

              {phase === 'quiz' && (
                <QuizView 
                  era={avatarState.era}
                  avatarState={avatarState}
                  onCorrectAnswer={handleQuizCorrect}
                  onPrev={handlePrevFromQuiz}
                  onHome={handleGoHome}
                  isMuted={isMuted}
                />
              )}

              {phase === 'face_build' && (
                <BuildPhaseView 
                  era={avatarState.era}
                  phase="face_build"
                  currentState={avatarState}
                  onStateChange={setAvatarState}
                  onNext={handleNextFromFace}
                  onPrev={handlePrevFromFace}
                  onHome={handleGoHome}
                  initialTab={activeBuildTab}
                  onExitToSelection={handleRestart}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                />
              )}

              {phase === 'overall_build' && (
                <BuildPhaseView 
                  era={avatarState.era}
                  phase="overall_build"
                  currentState={avatarState}
                  onStateChange={setAvatarState}
                  onNext={handleNextFromOverall}
                  onPrev={handlePrevFromOverall}
                  onHome={handleGoHome}
                  initialTab={activeBuildTab}
                  onExitToSelection={handleRestart}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                />
              )}

              {phase === 'display' && (
                <FinalDisplayView 
                  currentState={avatarState}
                  onHome={handleGoHome}
                  onRestart={handleBackToStep2Markings}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>

      {/* Global Background Music Outchain Song Player */}
      <audio
        id="global-bg-music"
        src="/resources/backmusic.m4a"
        loop
        preload="auto"
        style={{ display: 'none', position: 'absolute', width: 0, height: 0, opacity: 0 }}
      />
      {/* Preloaded Click SFX Audio */}
      <audio
        id="click-sound-sfx"
        src="/resources/click_music.m4a"
        preload="auto"
        style={{ display: 'none', position: 'absolute', width: 0, height: 0, opacity: 0 }}
      />
    </div>
  );
}
