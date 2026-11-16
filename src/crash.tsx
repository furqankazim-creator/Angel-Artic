import React from 'react';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from './theme';
import { useNav } from './nav';

const KEY = 'angel-artic-crashlog';
const MAX = 20;

/** Crash notes stay on the phone. They hold the error text only: no names, recordings or scores. */
export async function logCrash(error: unknown, where: string) {
  try {
    const e = error instanceof Error ? error : new Error(String(error));
    const raw = await AsyncStorage.getItem(KEY);
    const list: { at: string; where: string; message: string; stack: string }[] = raw ? JSON.parse(raw) : [];
    list.push({ at: new Date().toISOString(), where, message: e.message, stack: (e.stack ?? '').split('\n').slice(0, 8).join('\n') });
    await AsyncStorage.setItem(KEY, JSON.stringify(list.slice(-MAX)));
  } catch { /* logging must never crash the app */ }
}
export async function readCrashLog(): Promise<string> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!list.length) return '';
    return list.map((c: any) => `${c.at} [${c.where}]\n${c.message}\n${c.stack}`).join('\n\n');
  } catch { return ''; }
}
export async function clearCrashLog() { try { await AsyncStorage.removeItem(KEY); } catch { /* ignore */ } }

/** Catches errors that escape the JS global handler too (native only). */
export function installGlobalHandler() {
  const EU = (globalThis as any).ErrorUtils;
  if (!EU?.setGlobalHandler) return;
  const prev = EU.getGlobalHandler?.();
  EU.setGlobalHandler((err: unknown, fatal?: boolean) => { logCrash(err, fatal ? 'fatal' : 'global'); prev?.(err, fatal); });
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  let nav: any = null;
  try {
    nav = useNav();
  } catch {}

  const handleTryAgain = () => {
    try {
      if (nav?.stack && nav.stack.length > 0) {
        nav.back(); // returns to the last page that they were in
      } else if (nav?.tab) {
        nav.switchTab(nav.tab);
      }
    } catch {}
    onReset();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Text style={{ fontSize: 56 }}>😇</Text>
      <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink, marginTop: 12, textAlign: 'center' }}>Oops! Angel got tangled.</Text>
      <Text style={{ fontSize: 16, color: colors.muted, marginTop: 8, textAlign: 'center' }}>Your child's progress is safe. Let's try again.</Text>
      <Pressable
        onPress={handleTryAgain}
        accessibilityRole="button"
        accessibilityLabel="Try again, returns to the last page"
        style={{ marginTop: 24, minHeight: 56, paddingHorizontal: 32, borderRadius: 20, backgroundColor: colors.coral, justifyContent: 'center' }}
      >
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800' }}>Try again</Text>
      </Pressable>
    </View>
  );
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { logCrash(error, 'screen'); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <ErrorFallback onReset={() => this.setState({ failed: false })} />;
  }
}
