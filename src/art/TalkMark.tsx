import React from 'react';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { View } from 'react-native';

/**
 * The Angel Talk mark: two chat bubbles and a voice wave. It is deliberately different from the
 * Angel Artic angel, so the two apps read as two separate products.
 */
export function TalkMark({ size = 72, framed = true }: { size?: number; framed?: boolean }) {
  const art = (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="tmFront" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#7B6CF0" /><Stop offset="1" stopColor="#5B49D6" /></LinearGradient>
        <LinearGradient id="tmBack" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FF9A8B" /><Stop offset="1" stopColor="#FF6B7A" /></LinearGradient>
      </Defs>
      {/* back bubble (coral), tail on the right */}
      <Path d="M44 22 H78 A12 12 0 0 1 90 34 V54 A12 12 0 0 1 78 66 H76 L80 80 L62 66 H44 A12 12 0 0 1 32 54 V34 A12 12 0 0 1 44 22 Z" fill="url(#tmBack)" />
      {/* front bubble (violet), tail on the left */}
      <Path d="M22 36 H56 A12 12 0 0 1 68 48 V68 A12 12 0 0 1 56 80 H38 L24 92 L26 80 H22 A12 12 0 0 1 10 68 V48 A12 12 0 0 1 22 36 Z" fill="url(#tmFront)" stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
      {/* voice wave */}
      <Rect x={22} y={52} width={6} height={12} rx={3} fill="#fff" />
      <Rect x={32} y={46} width={6} height={24} rx={3} fill="#fff" />
      <Rect x={42} y={50} width={6} height={16} rx={3} fill="#fff" />
      <Rect x={52} y={55} width={6} height={6} rx={3} fill="#FFE48A" />
    </Svg>
  );
  if (!framed) return art;
  return <View style={{ backgroundColor: '#fff', borderRadius: size * 0.3, padding: size * 0.08 }}>{art}</View>;
}
