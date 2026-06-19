import React from 'react';

export type AppPhase = 'welcome' | 'era_select' | 'quiz' | 'face_build' | 'overall_build' | 'display';

export type EraType = 'heian' | 'edo_normal' | 'edo_hanayume' | 'tang' | 'tsing' | 'tang_maid';

export interface DressUpItem {
  id: string;
  name: string;
  description: string;
  category: 'brows' | 'eyes' | 'lips' | 'blush' | 'markings' | 'hair' | 'clothing' | 'accessories';
  visualSvg: (props: SVGItemProps) => React.ReactNode;
  imagePath?: string;
}

export interface SVGItemProps {
  primaryColor?: string;
  themeColor?: string;
  isActive?: boolean;
  isThumbnail?: boolean;
}

export interface AvatarState {
  era: EraType;
  brows: string;      // item id
  eyes: string;       // item id
  lips: string;       // item id
  blush: string;      // item id
  markings: string;   // item id
  hair: string;       // item id
  clothing: string;   // item id
  accessories: string; // item id
  bgColor: string;     // for final display frame
}

export interface PresetEraConfig {
  id: EraType;
  title: string;
  subtitle: string;
  description: string;
  defaultState: Omit<AvatarState, 'era'>;
}
