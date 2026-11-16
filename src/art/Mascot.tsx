import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { useStore } from '../store';
import { TalkMark } from './TalkMark';
import { AngelArticLogo } from './AngelArticLogo';

const KID_MASCOT = require('../../assets/brand/kid_mascot.png');

export function KidMascot({ size = 120, style }: { size?: number; style?: any }) {
  const radius = Math.round(size * 0.22);
  if (Platform.OS === 'web') {
    const src = typeof KID_MASCOT === 'string' ? KID_MASCOT : (KID_MASCOT as any)?.uri ?? KID_MASCOT;
    return (
      <View style={[{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }, style]}>
        <img
          src={src}
          style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover', display: 'block' }}
          alt="Angel Artic Kid Mascot"
        />
      </View>
    );
  }
  return (
    <View style={[{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }, style]}>
      <Image
        source={KID_MASCOT}
        style={{ width: size, height: size, borderRadius: radius }}
        resizeMode="cover"
      />
    </View>
  );
}

export type Mood = 'happy' | 'cheer' | 'think' | 'listen' | 'gentle';
const SKIN = '#FFD9B8';
const INK = '#2D2A4A';

/** Angel: the app's mascot. Halo, wings, robe, and a face that changes with the mood. */
export function Mascot({ mood = 'happy', size = 120, face = false }: { mood?: Mood; size?: number; face?: boolean }) {
  const { s } = useStore();
  const bob = useRef(new Animated.Value(0)).current;
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (s.settings.calm) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(bob, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' }),
    ]));
    loop.start();
    const t = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 140); }, 3600);
    return () => { loop.stop(); clearInterval(t); };
  }, [s.settings.calm]);

  const eye = (cx: number) => blink || mood === 'cheer'
    ? <Path d={`M${cx - 7} 56 Q${cx} ${mood === 'cheer' ? 48 : 60} ${cx + 7} 56`} stroke={INK} strokeWidth={3.5} strokeLinecap="round" fill="none" />
    : <G><Circle cx={cx} cy={56} r={mood === 'listen' ? 8 : 6.5} fill={INK} /><Circle cx={cx + 2.2} cy={53.5} r={2.2} fill="#fff" /></G>;

  const mouth = {
    happy: <Path d="M43 71 Q50 79 57 71" stroke={INK} strokeWidth={3.5} strokeLinecap="round" fill="none" />,
    cheer: <G><Path d="M40 68 Q50 86 60 68 Z" fill="#7A2740" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" /><Path d="M44 77 Q50 82 56 77 Q50 74 44 77Z" fill="#FF8FAB" /></G>,
    think: <Ellipse cx={50} cy={73} rx={4} ry={5} fill="#7A2740" stroke={INK} strokeWidth={2} />,
    listen: <Path d="M44 72 Q50 76 56 72" stroke={INK} strokeWidth={3.5} strokeLinecap="round" fill="none" />,
    gentle: <Path d="M43 74 Q50 70 57 74" stroke={INK} strokeWidth={3.5} strokeLinecap="round" fill="none" />,
  }[mood];

  const head = (
    <G>
      <Ellipse cx={50} cy={10} rx={22} ry={6} fill="none" stroke="#FFC93C" strokeWidth={5} />
      <Circle cx={50} cy={56} r={34} fill={SKIN} />
      <Path d="M18 48 Q22 20 50 20 Q78 20 82 48 Q66 34 50 36 Q34 34 18 48Z" fill="#6C5CE7" />
      <Circle cx={36} cy={66} r={6} fill="#FF8FAB" opacity={0.6} />
      <Circle cx={64} cy={66} r={6} fill="#FF8FAB" opacity={0.6} />
      {eye(38)}{eye(62)}
      {mood === 'think' && <Path d="M28 46 Q36 41 44 45" stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none" />}
      {mouth}
    </G>
  );

  if (face) {
    return (
      <Svg width={size} height={size} viewBox="12 14 76 84">{head}</Svg>
    );
  }
  // The app's mascot character is the Angel Artic Kid Mascot.
  return (
    <Animated.View style={{ transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }] }} accessibilityLabel="Angel Artic mascot">
      <KidMascot size={size} />
    </Animated.View>
  );
}

export function MascotBubble({ text, mood = 'happy', size = 96 }: { text: string; mood?: Mood; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
      <Mascot mood={mood} size={size} />
      <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, borderBottomLeftRadius: 4, padding: 14, borderWidth: 1, borderColor: '#EFE6D8', marginBottom: 20 }}>
        {/* text supplied by caller via children-free prop to keep bubble styling in one place */}
        <BubbleText>{text}</BubbleText>
      </View>
    </View>
  );
}
import { T } from '../ui';
const BubbleText = ({ children }: { children: string }) => <T k="bodyBold">{children}</T>;
