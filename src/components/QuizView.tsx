/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EraType, AvatarState } from '../types';

interface QuizViewProps {
  era: EraType;
  avatarState: AvatarState;
  onCorrectAnswer: () => void;
  onPrev: () => void;
  onHome: () => void;
  isMuted: boolean;
}

interface TriviaQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

/// Exactly the question pairings specified by the user
const TRIVIA_QUESTIONS: Record<EraType, TriviaQuestion> = {
  tang: {
    prompt: '中国の唐は、化粧のほかに顔に何かをする？正解を選んでください。',
    options: ['貼花钿', 'まゆ'],
    correctIndex: 0
  },
  tsing: {
    prompt: '中国の清朝、化粧にはどんな特徴がありますか？',
    options: ['薄い', '鮮やか'],
    correctIndex: 0
  },
  tang_maid: {
    prompt: '中国唐代では、女性が男装をする風習があった。',
    options: ['⭕️', '❌'],
    correctIndex: 0
  },
  heian: {
    prompt: '日本の平安時代の中で、どの元素が最も特徴的でしたか？',
    options: ['目', 'まゆ'],
    correctIndex: 1
  },
  edo_normal: {
    prompt: '日本の江戸時代の中で、どの元素が最も特徴的でしたか？',
    options: ['目', 'お歯黒'],
    correctIndex: 1
  },
  edo_hanayume: {
    prompt: '日本の江戸時代の中で、花嫁の髪型はどのようなものが一般的だったのですか？',
    options: ['垂髪', '高島田'],
    correctIndex: 1
  }
};


export const QuizView: React.FC<QuizViewProps> = ({ era, onCorrectAnswer, onPrev, onHome, isMuted }) => {
  const [bgError, setBgError] = useState<boolean>(false);
  const quiz = TRIVIA_QUESTIONS[era] || TRIVIA_QUESTIONS['tang'];
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Audio refs for correct and incorrect sounds
  const rightAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  // Home and Close buttons error states
  const [homeBtnError, setHomeBtnError] = useState<boolean>(false);
  const [closeBtnError, setCloseBtnError] = useState<boolean>(false);

  // Left side character image path - Edo Hanayume uses edo_hanayume.png, Edo Normal uses edo.png
  const characterImgPath = era === 'edo_hanayume' 
    ? '/resources/quiz/edo_hanayume.png' 
    : (era === 'edo_normal' ? '/resources/quiz/edo.png' : `/resources/quiz/${era}.png`);

  const handleSelectOption = (index: number) => {
    setSelectedIndex(index);
    setIsAnswered(true);

    if (!isMuted) {
      if (index === quiz.correctIndex) {
        if (rightAudioRef.current) {
          rightAudioRef.current.currentTime = 0;
          rightAudioRef.current.play().catch(e => console.log("Failed to play right_music:", e));
        }
      } else {
        if (errorAudioRef.current) {
          errorAudioRef.current.currentTime = 0;
          errorAudioRef.current.play().catch(e => console.log("Failed to play error_music:", e));
        }
      }
    }
  };

  const isCurrentCorrect = selectedIndex !== null && selectedIndex === quiz.correctIndex;

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-between p-6 select-none font-sans overflow-hidden bg-[#fff4d2]" 
      id="quiz-view-container"
    >
      {/* Background Graphic representing public/resources/quiz/background.png */}
      {!bgError ? (
        <img 
          src="/resources/quiz/background.png" 
          alt="クイズ背景" 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          onError={() => {
            console.log("quiz/background.png not found, falling back to gorgeous high-fidelity fill.");
            setBgError(true);
          }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-[#fff4d2] z-0 pointer-events-none" />
      )}

      {/* Top Bar Navigation (Left Home & Right X close, center title) */}
      <div className="w-full flex justify-between items-center z-10" id="quiz-top-bar">
        {/* Left Home Button - Clicking goes to Welcome page */}
        <button
          onClick={onHome}
          className="cursor-pointer hover:scale-110 active:scale-95 transition-transform outline-none"
          title="ホーム"
          id="quiz-btn-home"
        >
          <img 
            src="/resources/home_button.png" 
            alt="ホーム" 
            className="w-12 h-12 object-contain" 
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Center Title: もんだいを答えてね！ */}
        <h2 
          className="font-black text-[28px] md:text-[34px] leading-tight tracking-wider"
          style={{
            color: '#f05357',
            fontFamily: '"Trebuchet MS", "Yu Gothic", sans-serif',
            textShadow: '3px 3px 0px #fff, -3px -3px 0px #fff, 3px -3px 0px #fff, -3px 3px 0px #fff, 3px 4px 0px rgba(190,50,50,0.18)'
          }}
        >
          もんだいを答えてね！
        </h2>

        {/* Right Close Button - Clicking returns to Era Select (previous page) */}
        <button
          onClick={onPrev}
          className="cursor-pointer hover:scale-110 active:scale-95 transition-transform outline-none"
          title="前のページに戻る"
          id="quiz-btn-close"
        >
          <img 
            src="/resources/close_button.png" 
            alt="前のページに戻る" 
            className="w-12 h-12 object-contain" 
            referrerPolicy="no-referrer"
          />
        </button>
      </div>

      {/* Main Container Layout: Left Character & Right Speech Bubble + Answers */}
      <div className="w-full flex-1 flex items-center gap-6 px-12 z-10" id="quiz-body-layout">
        {/* Left Side: Selected Character Display */}
        <div className="w-[30%] flex items-center justify-center relative h-full max-h-[380px]" id="quiz-left-character-box">
          <motion.img 
            src={characterImgPath}
            alt={era}
            className="w-full h-full object-contain drop-shadow-[5px_5px_15px_rgba(0,0,0,0.15)]"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onError={(e) => {
              console.log("Quiz character png missing, falling back to tang.png of same directory");
              (e.target as HTMLImageElement).src = "/resources/quiz/tang.png";
            }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Side: Speech Bubble & Answer Grid */}
        <div className="flex-1 flex flex-col justify-center items-start gap-6 pl-2" id="quiz-right-speech-box">
          {/* Speech Bubble with elegant 4px solid gold border matching the options */}
          <div 
            className="relative bg-white border-[4px] border-[#E6B942] rounded-[28px] px-8 py-5 max-w-[480px] w-full min-h-[110px] sm:min-h-[130px] flex items-center shadow-sm"
            id="quiz-speech-bubble"
          >
            {/* Elegant bottom-left pointer tail pointing downwards-left toward the character */}
            <div className="absolute left-10 -bottom-[12px] w-5 h-5 bg-white border-b-[4px] border-l-[4px] border-[#E6B942] -rotate-45 z-10" />
            
            <p className="relative z-20 text-[#E6B942] font-extrabold text-[15px] sm:text-[17px] leading-relaxed font-serif w-full">
              {quiz.prompt}
            </p>
          </div>

          {/* Symmetrical Answer Options Layout (Two next to each other) */}
          <div className="flex items-center gap-6 w-full max-w-[480px]" id="quiz-answers-row">
            {quiz.options.map((option, index) => {
              const isSelected = selectedIndex === index;
              const isCorrectOption = index === quiz.correctIndex;
              
              // Dynamic borders/colors based on correct/wrong logic requested matching #E6B942 border color
              let optionStyle = "bg-white border-[#E6B942] text-[#E6B942] hover:scale-105 active:scale-95 cursor-pointer";
              let iconElement = null;

              if (isAnswered) {
                // Keep the golden-yellow borders and gold text exactly as requested and shown in image!
                if (isCorrectOption) {
                  optionStyle = "bg-white border-[#E6B942] text-[#E6B942] scale-100 cursor-default";
                  iconElement = (
                    <svg className="w-10 h-10 ml-3 flex-shrink-0" viewBox="0 0 40 40">
                      <path d="M8 20 L16 28 L32 10" fill="none" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  );
                } else if (isSelected) {
                  optionStyle = "bg-white border-[#E6B942] text-[#E6B942] scale-100 cursor-default";
                  iconElement = (
                    <svg className="w-8 h-8 ml-3 flex-shrink-0" viewBox="0 0 40 40">
                       <line x1="10" y1="10" x2="30" y2="30" stroke="#b91c1c" strokeWidth="7" strokeLinecap="round" />
                       <line x1="30" y1="10" x2="10" y2="30" stroke="#b91c1c" strokeWidth="7" strokeLinecap="round" />
                    </svg>
                  );
                } else {
                  // Non-selected wrong option
                  optionStyle = "bg-white/80 border-[#E6B942]/50 text-[#E6B942]/50 cursor-default";
                }
              }

              return (
                <button
                  key={index}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(index)}
                  className={`quiz-option-button flex-1 h-[54px] rounded-[22px] border-[4px] px-6 flex items-center justify-center font-black text-xl transition-all font-serif shadow-sm ${optionStyle}`}
                >
                  <span>{option}</span>
                  {iconElement}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Symmetrical lowercase "next" Button on the bottom right of the page */}
      {isAnswered && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onCorrectAnswer}
          className="absolute bottom-8 right-12 z-20 hover:scale-110 active:scale-95 transition-all outline-none cursor-pointer"
          id="quiz-btn-next"
        >
          <img 
            src="/resources/quiz/next_button.png" 
            alt="次へ" 
            className="w-24 h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.button>
      )}

      {/* Hidden preloaded audios for right and wrong answers */}
      <audio ref={rightAudioRef} src="/resources/right_music.m4a" preload="auto" style={{ display: 'none' }} />
      <audio ref={errorAudioRef} src="/resources/error_music.m4a" preload="auto" style={{ display: 'none' }} />
    </div>
  );
};
