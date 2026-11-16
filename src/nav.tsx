import React, { createContext, useCallback, useContext, useState } from 'react';

export type Tab = 'Home' | 'Practice' | 'Play' | 'Talk' | 'Parents';
export interface Route { name: string; params?: any }
interface Nav {
  tab: Tab;
  stack: Route[];
  go: (name: string, params?: any) => void;
  replace: (name: string, params?: any) => void;
  back: () => void;
  reset: () => void;
  switchTab: (t: Tab) => void;
  practiceSound: string;
  openSound: (id: string) => void;
  welcome: boolean;
  setWelcome: (v: boolean) => void;
  logout: () => void;
  unlocked: boolean;
  setUnlocked: (v: boolean) => void;
}
const NavCtx = createContext<Nav>(null as any);
export const useNav = () => useContext(NavCtx);

export function NavProvider({ children, initial }: { children: React.ReactNode; initial?: Route[] }) {
  const [tab, setTab] = useState<Tab>('Home');
  const [stack, setStack] = useState<Route[]>(initial ?? []);
  const [unlocked, setUnlocked] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [practiceSound, setPracticeSound] = useState('s');
  const openSound = useCallback((id: string) => { setPracticeSound(id); setStack([]); setTab('Practice'); setUnlocked(false); }, []);
  const go = useCallback((name: string, params?: any) => setStack((s) => [...s, { name, params }]), []);
  const replace = useCallback((name: string, params?: any) => setStack((s) => [...s.slice(0, -1), { name, params }]), []);
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), []); // stays unlocked: back returns to the Parent Hub, not the PIN pad
  const reset = useCallback(() => { setStack([]); setUnlocked(false); }, []);
  const switchTab = useCallback((t: Tab) => { setStack([]); setTab(t); setUnlocked(false); }, []);
  const logout = useCallback(() => { setStack([]); setTab('Home'); setUnlocked(false); setWelcome(true); }, []);
  return <NavCtx.Provider value={{ welcome, setWelcome, logout, tab, stack, go, replace, back, reset, switchTab, practiceSound, openSound, unlocked, setUnlocked }}>{children}</NavCtx.Provider>;
}
