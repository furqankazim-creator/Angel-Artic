/** Manual backup so progress survives a new phone. Never includes the PIN, recovery word or API keys. */
export function exportBackup(state: any): string {
  const strip = (p: any) => ({ ...p, attempts: (p.attempts ?? []).map(({ uri, ...a }: any) => a) });
  return JSON.stringify({
    app: 'angel-artic', v: 1, at: Date.now(),
    profiles: (state.profiles ?? []).map(strip),
    custom: (state.custom ?? []).map(({ imageUri, voiceUri, ...c }: any) => c),
    settings: state.settings,
    activeId: state.activeId,
  });
}

export interface Backup { profiles: any[]; custom: any[]; settings: any; activeId: string }

export function parseBackup(text: string): Backup | null {
  try {
    const j = JSON.parse(text.trim());
    if (j?.app !== 'angel-artic' || j.v !== 1 || !Array.isArray(j.profiles) || !j.profiles.length) return null;
    const ok = j.profiles.every((p: any) => p && typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.attempts));
    if (!ok) return null;
    return { profiles: j.profiles, custom: Array.isArray(j.custom) ? j.custom : [], settings: j.settings ?? null, activeId: j.activeId ?? j.profiles[0].id };
  } catch {
    return null;
  }
}
