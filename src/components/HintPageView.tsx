/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { EraType, AvatarState } from '../types';

interface HintPageViewProps {
  era: EraType;
  currentState: AvatarState;
  onClose: () => void;
}

const getHintImagePath = (era: EraType): string => {
  if (era === 'edo_normal') {
    return '/resources/hint/edo.png';
  }
  return `/resources/hint/${era}.png`;
};

export const HintPageView: React.FC<HintPageViewProps> = ({ era, onClose }) => {
  const imagePath = getHintImagePath(era);

  return (
    <div 
      className="absolute inset-0 bg-[#fbefe2] z-40 overflow-hidden flex flex-col justify-between p-0 m-0 w-full h-full" 
      id="hint-page-full-viewport"
    >
      {/* Container for the 3:2 aspect ratio layout, filling absolute parent */}
      <div className="relative w-full h-full flex flex-col justify-center items-center" id="hint-inner-wrapper">
        
        {/* The single static image matching the requested selected era */}
        <div className="relative w-full h-full flex items-center justify-center" id="hint-image-container">
          <img 
            src={imagePath} 
            alt={`${era} hint`} 
            className="w-full h-full object-contain pointer-events-none select-none"
            onError={(e) => {
              console.log(`Failed to load hint image: ${imagePath}, using fallback.`);
              // If not found, show a message or use fallback if required
              (e.target as HTMLImageElement).src = '/resources/quiz/background.png';
            }}
            referrerPolicy="no-referrer"
          />

          {/* Top-Right Red Circular Close Button - matches perfect UI matching the template styling */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 z-50 outline-none"
            title="前のページに戻る"
            id="hint-close-button"
          >
            <img 
              src="/resources/close_button.png" 
              alt="前のページに戻る" 
              className="w-11 h-11 object-contain" 
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
