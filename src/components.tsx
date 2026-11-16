import React, { useState } from 'react';
import { Animated, Easing, Pressable, StyleProp, TextInput, View, ViewStyle } from 'react-native';
import { colors, soft } from './theme';
import { Button, Card, Muted, Pill, Row, T } from './ui';
import { useMeterRecorder } from './audio';
import { GATE_MESSAGES, runGate } from './lib/gate';
import { useStore } from './store';
import { useNav } from './nav';
import { TalkMark } from './art/TalkMark';
import { ANGEL_TALK } from './data/promo';
import { HOPE_BRIDGE } from './data/hopeBridge';

export function Waveform({ levels, color = colors.violet }: { levels: number[]; color?: string }) {
  const bars = Array.from({ length: 28 }, (_, i) => levels[levels.length - 28 + i] ?? -160);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 80, gap: 3 }}>
      {bars.map((db, i) => {
        const h = Math.max(6, Math.min(80, ((db + 60) / 60) * 80));
        return <View key={i} style={{ width: 6, height: h, borderRadius: 3, backgroundColor: db > -35 ? color : soft.violet }} />;
      })}
    </View>
  );
}

export function LevelMeter({ db }: { db: number }) {
  const pct = Math.max(0, Math.min(1, (db + 60) / 60));
  const good = db > -35;
  return (
    <View>
      <View style={{ height: 28, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: good ? colors.green : colors.sky }} />
      </View>
      <T k="bodyBold" style={{ marginTop: 6 }}>{good ? 'Great, I can hear you!' : 'Say "hello"…'}</T>
    </View>
  );
}

/** Inline Mic Check used on onboarding: say "hello", the meter must reach green. */
export function MicCheckCard({ name }: { name?: string }) {
  const { s, set } = useStore();
  const { start, recording, denied } = useMeterRecorder();
  const [db, setDb] = useState(-160);
  const [msg, setMsg] = useState<string | null>(null);
  const run = async () => {
    setMsg(null);
    await start({ autoStop: true, maxMs: 6000, onTick: (t) => setDb(t.db) }, (c) => {
      const g = runGate(c.samples);
      if (g.status === 'ok') set((st) => ({ ...st, micChecked: true }));
      else setMsg(GATE_MESSAGES[g.status]);
      setDb(-160);
    });
  };
  const pct = Math.max(0, Math.min(1, (db + 60) / 60));
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 8 }}>
      <T k="bodyBold">🎙️ Mic Check</T>
      <T color={colors.muted} style={{ fontSize: 16 }}>Say "hello{name ? ` ${name}` : ''}!" out loud. We'll confirm the microphone really hears a voice before practice starts.</T>
      <View style={{ height: 10, borderRadius: 5, backgroundColor: soft.violet, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: db > -35 ? colors.green : colors.sky }} />
      </View>
      <T k="bodyBold" color={s.micChecked ? '#04936F' : msg || denied ? colors.coral : colors.ink}>
        {s.micChecked ? '✅ I can hear you!' : denied ? 'Microphone is off. Allow it in Settings.' : msg ?? 'Not tested yet'}
      </T>
      <Pressable onPress={run} disabled={recording} style={{ alignSelf: 'flex-start', minHeight: 48, borderRadius: 16, backgroundColor: soft.violet, paddingHorizontal: 16, justifyContent: 'center' }}>
        <T k="button">{recording ? 'Listening…' : '▶ Run Mic Check'}</T>
      </Pressable>
    </View>
  );
}

/** Friendly promotion banner for Angel Talk (AAC communication app). */
export function AngelTalkBanner({ style }: { style?: StyleProp<ViewStyle> }) {
  const { go } = useNav();
  return (
    <Card accent="violet" style={[{ gap: 12 }, style]} onPress={() => go('AngelTalk')}>
      <Row style={{ alignItems: 'center', gap: 12 }}>
        <TalkMark size={60} />
        <View style={{ flex: 1, gap: 2 }}>
          <Row style={{ alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <T k="heading" color={colors.violet}>Angel Talk 💬</T>
            <Pill label="AAC" color="coral" />
          </Row>
          <T k="caption" color={colors.coral} style={{ fontFamily: 'Nunito_700Bold' }}>{ANGEL_TALK.tagline}</T>
        </View>
      </Row>
      <T color={colors.ink} style={{ fontSize: 14, lineHeight: 20 }}>
        Tap pictures to speak! For children who need a voice right now: English & Arabic voices, 14,000+ symbols, and calm communication tools.
      </T>
      <Button
        label="Meet Angel Talk ›"
        color="violet"
        onPress={() => go('AngelTalk')}
        style={{ width: '100%', marginTop: 2 }}
      />
    </Card>
  );
}

/** Friendly promotion banner for Hope Bridge Digital (publisher & app suite). */
export function HopeBridgeBanner({ style }: { style?: StyleProp<ViewStyle> }) {
  const { go } = useNav();
  return (
    <Card accent="sunny" style={[{ gap: 12 }, style]} onPress={() => go('HopeBridge')}>
      <Row style={{ alignItems: 'center', gap: 12 }}>
        <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: soft.sunny, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.sunny }}>
          <T style={{ fontSize: 30 }}>🌟</T>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Row style={{ alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <T k="heading" color={colors.ink}>Hope Bridge Digital</T>
            <Pill label="Publisher" color="sunny" />
          </Row>
          <T k="caption" color={colors.coral} style={{ fontFamily: 'Nunito_700Bold' }}>
            {HOPE_BRIDGE.tagline}
          </T>
        </View>
      </Row>
      <T color={colors.ink} style={{ fontSize: 14, lineHeight: 20 }}>
        Makers of Angel Artic, Angel Talk, BloomLearn, Bloom Focus & Nexia Bridge. Calm, family-first apps for autism, speech, and attention needs.
      </T>
      <Button
        label="Explore Our Apps & Mission ›"
        color="coral"
        onPress={() => go('HopeBridge')}
        style={{ width: '100%', marginTop: 2 }}
      />
    </Card>
  );
}


export const POPUP_MS = 10000;

/**
 * A small floating info card. It closes with the X or by itself after `ms`, with a bar that shows the time left.
 * Holding a finger (or the mouse button) on the card pauses the countdown; letting go carries on from where it stopped.
 */
export function FloatingInfo({ kicker, title, icon = '🎯', ms = POPUP_MS, calm, onClose, children }: {
  kicker: string; title: string; icon?: string; ms?: number; calm?: boolean; onClose: () => void; children: React.ReactNode;
}) {
  const progress = React.useRef(new Animated.Value(1)).current;
  const remaining = React.useRef(ms);
  const startedAt = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = React.useRef(false);
  const [paused, setPaused] = useState(false);

  const run = React.useCallback(() => {
    if (running.current) return;
    running.current = true;
    setPaused(false);
    startedAt.current = Date.now();
    if (!calm) Animated.timing(progress, { toValue: 0, duration: remaining.current, easing: Easing.linear, useNativeDriver: false }).start();
    timer.current = setTimeout(onClose, remaining.current);
  }, [calm, onClose, progress]);
  const pause = React.useCallback(() => {
    if (!running.current) return;
    running.current = false;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    remaining.current = Math.max(400, remaining.current - (Date.now() - startedAt.current));
    progress.stopAnimation();
    setPaused(true);
  }, [progress]);

  React.useEffect(() => {
    run();
    return () => { running.current = false; if (timer.current) clearTimeout(timer.current); progress.stopAnimation(); };
  }, []);

  const label = { letterSpacing: 0.8, fontSize: 11 } as const;
  return (
    <View accessibilityRole="alert" style={{ position: 'absolute', top: 10, alignSelf: 'center', width: '88%', maxWidth: 340, zIndex: 10, backgroundColor: colors.white, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, shadowColor: '#2D2A4A', shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 10 }}>
      <View style={{ height: 6, backgroundColor: colors.violet }} />
      <Pressable accessibilityHint="Hold to pause the timer" onPressIn={pause} onPressOut={run} style={{ padding: 14, paddingTop: 10, gap: 8 }}>
        <Row style={{ alignItems: 'center', gap: 10 }}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: soft.violet, alignItems: 'center', justifyContent: 'center' }}><T style={{ fontSize: 20 }}>{icon}</T></View>
          <View style={{ flex: 1 }}>
            <T k="caption" color={colors.muted} style={label}>{kicker}</T>
            <T k="heading" numberOfLines={2} style={{ lineHeight: 24 }}>{title}</T>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} hitSlop={8}
            style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
            <T k="bodyBold" color={colors.muted}>✕</T>
          </Pressable>
        </Row>
        {children}
      </Pressable>
      <View style={{ height: 4, backgroundColor: soft.coral }}>
        <Animated.View style={{ height: 4, backgroundColor: paused ? colors.sunny : colors.coral, width: calm ? '100%' : progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
      </View>
      {paused && <T k="caption" color={colors.muted} style={{ textAlign: 'center', paddingVertical: 4, fontSize: 11 }}>⏸ Paused. Let go to carry on.</T>}
    </View>
  );
}

/** Small uppercase heading used inside FloatingInfo. */
export function InfoLabel({ children, color = colors.violet }: { children: string; color?: string }) {
  return <T k="caption" color={color} style={{ letterSpacing: 0.8, fontSize: 11 }}>{children}</T>;
}


/**
 * Parent gate for links that leave the app. Use: `const { ask, gate } = useParentGate();`
 * render `{gate}` once, and call `ask(() => Linking.openURL(url))`.
 */
export function useParentGate() {
  const ask = React.useCallback((action: () => void) => {
    action();
  }, []);
  return { ask, gate: null };
}
