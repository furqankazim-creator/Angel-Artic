import React, { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Muted, Screen, T } from '../ui';
import { useStore } from '../store';
import { useNav } from '../nav';
import { colors, soft } from '../theme';

/** Wraps a grown-up screen: shows the PIN pad until the PIN is entered. */
export function withPin<P extends object>(Comp: React.ComponentType<P>, title: string, canGoBack = false) {
  return function Gated(props: P) {
    const { unlocked } = useNav();
    return unlocked ? <Comp {...props} /> : <PinPad title={title} canGoBack={canGoBack} />;
  };
}

const MAX_TRIES = 5;
const LOCK_MS = 30000;

export function PinPad({ title }: { title: string; canGoBack?: boolean }) {
  const { s } = useStore();
  const { setUnlocked, stack } = useNav();
  const [v, setV] = useState('');
  const [bad, setBad] = useState(false);
  const [fails, setFails] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [forgot, setForgot] = useState(false);
  const [word, setWord] = useState('');
  const [wordBad, setWordBad] = useState(false);
  const locked = lockedUntil > now;

  useEffect(() => {
    if (!locked) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [locked]);

  const fail = () => {
    const n = fails + 1;
    setBad(true); setTimeout(() => setV(''), 300);
    if (n >= MAX_TRIES) { setFails(0); setLockedUntil(Date.now() + LOCK_MS); setNow(Date.now()); } else setFails(n);
  };
  const submit = (n: string) => (n === s.pin ? setUnlocked(true) : fail());
  const press = (d: string) => {
    if (locked) return;
    const n = (v + d).slice(0, 4);
    setV(n); setBad(false);
    if (n.length === 4) submit(n);
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];
  const secs = Math.ceil((lockedUntil - now) / 1000);
  return (
    <Screen title={undefined} onBack={stack.length > 0}>
      <T k="title">Grown-ups only 🔒</T>
      <T color={colors.muted}>Enter your parent PIN to open progress, plans and settings. Child mode never shows this area.</T>
      <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center', marginVertical: 6 }}>
        {[0, 1, 2, 3].map((i) => <View key={i} style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: bad ? colors.coral : colors.ink, backgroundColor: v.length > i ? (bad ? colors.coral : colors.ink) : 'transparent' }} />)}
      </View>
      {locked ? <T k="bodyBold" color={colors.coral} style={{ textAlign: 'center' }}>Too many tries. Wait {secs}s.</T>
        : bad ? <T k="bodyBold" color={colors.coral} style={{ textAlign: 'center' }}>That PIN is not right. Try again.</T> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 264, gap: 10, alignSelf: 'center', opacity: locked ? 0.4 : 1 }}>
        {keys.map((d) => (
          <Pressable key={d} disabled={locked} onPress={() => (d === '⌫' ? setV(v.slice(0, -1)) : d === '✓' ? submit(v) : press(d))}
            style={{ width: 80, height: 64, borderRadius: 18, backgroundColor: soft.sky, alignItems: 'center', justifyContent: 'center' }}>
            <T k="title">{d}</T>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={() => setForgot((f) => !f)} style={{ minHeight: 44, justifyContent: 'center' }}>
        <T k="bodyBold" color={colors.sky} style={{ textAlign: 'center' }}>Forgot your PIN?</T>
      </Pressable>
      {forgot && (
        <View style={{ backgroundColor: soft.sunny, borderRadius: 14, padding: 12, gap: 8 }}>
          {s.recoveryWord ? (
            <>
              <T k="caption" color={colors.muted}>Type the recovery word you set in Settings.</T>
              <TextInput value={word} onChangeText={(x) => { setWord(x); setWordBad(false); }} autoCapitalize="none" placeholder="Recovery word" placeholderTextColor={colors.muted}
                style={{ minHeight: 56, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: 16, fontSize: 16 }} />
              {wordBad && <T k="caption" color={colors.coral}>That is not the recovery word.</T>}
              <Pressable onPress={() => (word.trim().toLowerCase() === s.recoveryWord ? setUnlocked(true) : setWordBad(true))} style={{ alignSelf: 'flex-start', minHeight: 48, borderRadius: 16, backgroundColor: colors.white, paddingHorizontal: 16, justifyContent: 'center' }}>
                <T k="bodyBold">Unlock</T>
              </Pressable>
            </>
          ) : (
            <T k="caption" color={colors.muted}>No recovery word was set. Deleting and reinstalling the app resets the PIN but erases all progress.</T>
          )}
        </View>
      )}
    </Screen>
  );
}
