import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sound, SOUNDS, Word, WORDS } from './data/sounds';
import { ALL_ITEMS, isGeneratedId } from './data/levels';
import { bandFor } from './data/curriculum';
import { OUTFITS, STICKERS, WORLDS } from './data/extras';
import { dayKey, seedFromDay } from './lib/date';
import { getDailyChallenge } from './lib/daily';

export type AttemptStatus = 'scored' | 'no_speech' | 'too_quiet' | 'too_short';
export interface Attempt {
  id: string;
  ts: number;
  day: string;
  wordId: string;
  soundId: string;
  word: string;
  mode: string;
  status: AttemptStatus;
  score: number;
  stars: number;
  xp: number;
  source: 'local' | 'azure' | 'parent';
  verified: boolean;
  durationMs: number;
  peakDb: number;
  uri?: string;
}
export interface Profile {
  id: string;
  name: string;
  age: number;
  targetSounds: string[];
  dailyGoal: number;
  attempts: Attempt[];
  bonusXp: number;
  streak: number;
  lastDay: string;
  outfit?: string;
  challengeDay?: string;
  questDone?: string[];
}
export interface Settings { bigText: boolean; calm: boolean; contrast: boolean; slow: boolean; lang?: 'en' | 'ar' | 'es' | 'ur' }
export interface CustomWord extends Word { profileId: string }
interface State {
  ready: boolean;
  onboarded: boolean;
  micChecked: boolean;
  pin: string;
  profiles: Profile[];
  activeId: string;
  settings: Settings;
  custom: CustomWord[];
  customSounds?: Sound[];
  azureKey: string;
  azureRegion: string;
  scoreUrl: string;
  scoreToken: string;
  recoveryWord: string;
}

const KEY = 'angel-artic-v1';
const initial: State = {
  ready: false, onboarded: false, micChecked: false, pin: '1234',
  profiles: [], activeId: '', custom: [], customSounds: [], azureKey: '', azureRegion: '', scoreUrl: '', scoreToken: '', recoveryWord: '',
  settings: { bigText: false, calm: false, contrast: false, slow: false },
};

export const uid = () => Math.random().toString(36).slice(2, 10);

interface Ctx {
  s: State;
  profile: Profile | undefined;
  set: (fn: (s: State) => State) => void;
  patchProfile: (patch: Partial<Profile>) => void;
  addProfile: (p: Omit<Profile, 'id' | 'attempts' | 'bonusXp' | 'streak' | 'lastDay'>) => string;
  addAttempt: (a: Attempt) => void;
  replaceAttempt: (id: string, patch: Partial<Attempt>) => void;
  derived: Derived;
  allWords: Word[];
  allSounds: Sound[];
  addCustomSound: (snd: Sound) => void;
  deleteCustomSound: (id: string) => void;
  wordById: (id: string) => Word | undefined;
}
interface Derived {
  stars: number; xp: number; scoredToday: number; goalProgress: number;
  masteredWordIds: string[]; masteredCount: number; todayWordIds: string[];
  missionWords: Word[]; unlockedStickers: number;
}

const StoreCtx = createContext<Ctx>(null as any);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setS({ ...initial, ...JSON.parse(raw), ready: true });
        else setS((p) => ({ ...p, ready: true }));
      } catch { setS((p) => ({ ...p, ready: true })); }
      loaded.current = true;
    })();
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    const { ready, ...rest } = s;
    AsyncStorage.setItem(KEY, JSON.stringify(rest)).catch(() => {});
  }, [s]);

  const set = useCallback((fn: (s: State) => State) => setS(fn), []);
  const profile = s.profiles.find((p) => p.id === s.activeId) ?? s.profiles[0];

  const patchProfile = useCallback((patch: Partial<Profile>) =>
    setS((p) => ({ ...p, profiles: p.profiles.map((x) => (x.id === (p.activeId || p.profiles[0]?.id) ? { ...x, ...patch } : x)) })), []);

  const addProfile: Ctx['addProfile'] = useCallback((p) => {
    const id = uid();
    setS((st) => ({
      ...st,
      activeId: id,
      profiles: [...st.profiles, { ...p, id, attempts: [], bonusXp: 0, streak: 0, lastDay: '', questDone: [] }],
    }));
    return id;
  }, []);

  const addAttempt = useCallback((a: Attempt) =>
    setS((st) => ({
      ...st,
      profiles: st.profiles.map((p) => {
        if (p.id !== (st.activeId || st.profiles[0]?.id)) return p;
        let { streak, lastDay } = p;
        if (a.status === 'scored' && lastDay !== a.day) {
          streak = lastDay === dayKey(Date.parse(a.day + 'T12:00:00') - 86400000) ? streak + 1 : 1;
          lastDay = a.day;
        }
        return { ...p, attempts: [...p.attempts, a], streak, lastDay };
      }),
    })), []);

  const replaceAttempt = useCallback((id: string, patch: Partial<Attempt>) =>
    setS((st) => ({
      ...st,
      profiles: st.profiles.map((p) => ({ ...p, attempts: p.attempts.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
    })), []);

  const allWords = useMemo(() => [...WORDS, ...s.custom.filter((c) => c.profileId === profile?.id)], [s.custom, profile?.id]);
  const allSounds = useMemo(() => [...SOUNDS, ...(s.customSounds ?? [])], [s.customSounds]);
  const wordById = useCallback((id: string) => allWords.find((w) => w.id === id) ?? ALL_ITEMS.find((w) => w.id === id), [allWords]);

  const addCustomSound = useCallback((snd: Sound) => {
    setS((st) => ({
      ...st,
      customSounds: [...(st.customSounds ?? []).filter((x) => x.id !== snd.id), snd],
    }));
  }, []);

  const deleteCustomSound = useCallback((id: string) => {
    setS((st) => ({
      ...st,
      customSounds: (st.customSounds ?? []).filter((x) => x.id !== id),
    }));
  }, []);

  const derived = useMemo<Derived>(() => {
    const att = profile?.attempts ?? [];
    const scored = att.filter((a) => a.status === 'scored');
    const today = dayKey();
    const todayScored = scored.filter((a) => a.day === today);
    const xp = scored.reduce((n, a) => n + a.xp, 0) + (profile?.bonusXp ?? 0);
    const mastered = Array.from(new Set(scored.filter((a) => a.score >= 80 && !isGeneratedId(a.wordId)).map((a) => a.wordId)));
    const seed = seedFromDay();
    const band = bandFor(profile?.age ?? 5);
    const pool = band === '3-4' ? WORDS.filter((w) => w.level !== 2) : WORDS;
    const challengeItems = profile ? getDailyChallenge(profile, allWords) : [];
    const missionWords = challengeItems.length >= 3
      ? challengeItems.slice(0, 3).map((item) => item.word)
      : [0, 1, 2].map((i) => pool[(seed * (i + 3) + i * 67) % pool.length]);
    return {
      stars: scored.reduce((n, a) => n + a.stars, 0), xp,
      scoredToday: todayScored.length,
      goalProgress: profile ? Math.min(1, new Set(todayScored.map((a) => a.wordId)).size / profile.dailyGoal) : 0,
      masteredWordIds: mastered, masteredCount: mastered.length,
      todayWordIds: todayScored.map((a) => a.wordId),
      missionWords, unlockedStickers: STICKERS.filter((k) => xp >= k.xp).length,
    };
  }, [profile]);

  const value = useMemo(
    () => ({ s, profile, set, patchProfile, addProfile, addAttempt, replaceAttempt, derived, allWords, allSounds, addCustomSound, deleteCustomSound, wordById }),
    [s, profile, set, patchProfile, addProfile, addAttempt, replaceAttempt, derived, allWords, allSounds, addCustomSound, deleteCustomSound, wordById],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const worldsUnlocked = (mastered: number) => WORLDS.filter((w) => mastered >= w.words);
export const outfitsUnlocked = (xp: number) => OUTFITS.filter((o) => xp >= o.xp);
