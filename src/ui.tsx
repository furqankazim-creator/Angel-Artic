import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleProp, Text, TextProps, TextStyle, View, ViewStyle, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accent, colors, layout, soft, type, TypeKey } from './theme';
import { useStore } from './store';
import { useNav } from './nav';
import { translateChildren, isRtl } from './i18n';

export function T({ k = 'body', color, style, ...rest }: TextProps & { k?: TypeKey; color?: string; style?: StyleProp<TextStyle> }) {
  const { s } = useStore();
  const base = type[k];
  const scale = s.settings.bigText ? 1.2 : 1;
  const defaultColor = color ?? (s.settings.contrast ? '#15132B' : colors.ink);
  const display = ['display', 'title', 'heading', 'sub', 'button', 'bigSound', 'bigWord'].includes(k);
  const ar = isRtl(s.settings.lang);
  const family = ar ? (base.fontWeight === '400' || k === 'caption' ? 'Cairo_400Regular' : 'Cairo_700Bold') : display
    ? base.fontWeight === '800' ? 'Baloo2_800ExtraBold' : 'Baloo2_700Bold'
    : k === 'bodyBold' ? 'Nunito_700Bold' : k === 'caption' ? 'Nunito_600SemiBold' : 'Nunito_400Regular';
  const { children, ...others } = rest as any;
  return <Text {...others} style={[{ fontSize: base.fontSize * scale, fontFamily: family, color: defaultColor }, style]}>{translateChildren(s.settings.lang, children)}</Text>;
}
export function Muted({ style, ...p }: TextProps & { k?: TypeKey; style?: StyleProp<TextStyle> }) {
  const { s } = useStore();
  return <T color={s.settings.contrast ? '#4A4770' : colors.muted} style={style} {...p} />;
}

export function Screen({ children, scroll = true, title, onBack, right, gap = 16 }: {
  children: React.ReactNode; scroll?: boolean; title?: string; onBack?: boolean; right?: React.ReactNode; gap?: number;
}) {
  const { back, stack } = useNav();
  const { s: st } = useStore();
  const Body: any = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, width: '100%' }} edges={[]}>
      {(title || onBack) && (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.pad, paddingTop: 8, minHeight: 56, width: '100%', maxWidth: 1040, alignSelf: 'center' }}>
          {onBack && stack.length > 0 && (
            <Pressable accessibilityLabel="Back" onPress={back} style={{ width: 56, height: 56, justifyContent: 'center' }}>
              <T k="title">{isRtl(st.settings.lang) ? '›' : '‹'}</T>
            </Pressable>
          )}
          <T k="title" style={{ flex: 1 }} numberOfLines={1}>{title}</T>
          {right}
        </View>
      )}
      <Body
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={scroll ? { padding: layout.pad, paddingBottom: 40, gap, width: '100%', maxWidth: 1040, alignSelf: 'center' } : undefined}
        showsVerticalScrollIndicator={false}
      >
        {scroll ? children : <View style={{ flex: 1, padding: layout.pad, gap, width: '100%', maxWidth: 1040, alignSelf: 'center' }}>{children}</View>}
      </Body>
    </SafeAreaView>
  );
}

export function Card({ children, accent, style, onPress }: {
  children: React.ReactNode; accent?: Accent; style?: StyleProp<ViewStyle>; onPress?: () => void;
}) {
  const { s } = useStore();
  const Comp: any = onPress ? Pressable : View;
  return (
    <Comp
      onPress={onPress}
      style={[{
        backgroundColor: accent ? soft[accent] : colors.card,
        borderRadius: layout.radius, padding: layout.cardPad,
        borderWidth: s.settings.contrast ? 2 : 1, borderColor: s.settings.contrast ? colors.ink : colors.border,
      }, style]}
    >{children}</Comp>
  );
}

export function Button({ label, onPress, color = 'violet', outline, disabled, style, small }: {
  label: string; onPress: () => void; color?: Accent; outline?: boolean; disabled?: boolean;
  style?: StyleProp<ViewStyle>; small?: boolean;
}) {
  const bg = colors[color];
  const dark = color === 'sunny' || color === 'green' || color === 'pink';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [{
        minHeight: small ? 44 : layout.tap, borderRadius: layout.radius, paddingHorizontal: 20,
        alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
        backgroundColor: outline ? colors.white : bg, borderWidth: outline ? 2 : 0, borderColor: bg,
        opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
      }, style]}
    >
      <T k="button" color={outline ? bg : dark ? colors.ink : colors.white} style={{ textAlign: 'center' }}>{label}</T>
    </Pressable>
  );
}

export function Pill({ label, color = 'violet' }: { label: string; color?: Accent }) {
  return (
    <View style={{ backgroundColor: soft[color], borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 }}>
      <T k="bodyBold" numberOfLines={1}>{label}</T>
    </View>
  );
}

export function Chip({ label, on, onPress, color = 'violet', style }: { label: string; on: boolean; onPress: () => void; color?: Accent; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable onPress={onPress} style={[{
      minHeight: 46, paddingHorizontal: 16, borderRadius: 999, justifyContent: 'center', alignItems: 'center',
      backgroundColor: on ? colors[color] : colors.white, borderWidth: 2, borderColor: colors[color],
    }, style]}>
      <T k="bodyBold" color={on ? (color === 'sunny' || color === 'green' ? colors.ink : colors.white) : colors.ink} style={{ textAlign: 'center' }}>{label}</T>
    </Pressable>
  );
}

export function Ring({ progress, size = 64, label }: { progress: number; size?: number; label: string }) {
  const pct = Math.round(progress * 100);
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2, borderWidth: 8,
      borderColor: progress >= 1 ? colors.green : soft.violet, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white,
    }}>
      <T k="bodyBold">{label || `${pct}%`}</T>
    </View>
  );
}

export function Bar({ value, color = 'violet' }: { value: number; color?: Accent }) {
  return (
    <View style={{ height: 14, borderRadius: 7, backgroundColor: colors.white, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', backgroundColor: colors[color] }} />
    </View>
  );
}

export function Confetti() {
  const { s } = useStore();
  const pieces = useRef(Array.from({ length: 28 }, (_, i) => ({
    x: Math.random() * 100, delay: Math.random() * 600,
    c: [colors.violet, colors.teal, colors.sunny, colors.coral, colors.pink, colors.green, colors.sky][i % 7],
    v: new Animated.Value(0),
  }))).current;
  useEffect(() => {
    if (s.settings.calm) return;
    pieces.forEach((p) =>
      Animated.timing(p.v, { toValue: 1, duration: 2200, delay: p.delay, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' }).start());
  }, []);
  if (s.settings.calm) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {pieces.map((p, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: -20, width: 12, height: 12, borderRadius: 3, backgroundColor: p.c,
          transform: [{ translateY: p.v.interpolate({ inputRange: [0, 1], outputRange: [0, 700] }) },
            { rotate: p.v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] }) }],
          opacity: p.v.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
        }} />
      ))}
    </View>
  );
}

export const Row = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12 }, style]}>{children}</View>
);
