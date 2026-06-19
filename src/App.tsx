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

  return (
    <div className="min-h-screen bg-[#ece0c9] flex items-center justify-center p-4 overflow-x-hidden font-sans select-none antialiased">
      {/* Background silk grain texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-color-burn bg-[radial-gradient(#8f7253_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Main Classical Cabinet Container representing the dress up game console */}
      <motion.div 
        className="w-full max-w-[1080px] aspect-[3/2] bg-[#f5ebd2] rounded-3xl overflow-hidden relative shadow-2xl"
        style={{
          boxShadow: '0 25px 60px -15px rgba(100, 75, 45, 0.45)'
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
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

      {/* Global Background Music Outchain Song Player */}
      <audio
        id="global-bg-music"
        src="https://music.163.com/song/media/outer/url?id=1849304699.mp3"
        loop
        autoPlay
        style={{ display: 'none', position: 'absolute', width: 0, height: 0, opacity: 0 }}
      />
    </div>
  );
}
