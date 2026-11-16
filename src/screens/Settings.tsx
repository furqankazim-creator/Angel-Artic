import React, { useState } from 'react';
import { Alert, Pressable, Share, TextInput, View } from 'react-native';
import { clearCrashLog, readCrashLog } from '../crash';
import { exportBackup, parseBackup } from '../lib/backup';
import { Button, Card, Chip, Muted, Row, Screen, T } from '../ui';
import { Settings as SettingsT, useStore } from '../store';
import { colors, layout } from '../theme';
import { useNav } from '../nav';
import { withPin } from './PinGate';

function Toggle({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ minHeight: layout.tap, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <T k="bodyBold" style={{ flex: 1 }}>{label}</T>
      <T k="heading">{on ? '✅' : '⬜'}</T>
    </Pressable>
  );
}
const input = { minHeight: layout.tap, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: 16, fontSize: 17, color: colors.ink } as const;

function SettingsInner() {
  const { s, set, profile } = useStore();
  const { logout, go } = useNav();
  const [adv, setAdv] = useState(false);
  const [pin, setPin] = useState('');
  const [key, setKey] = useState(s.azureKey);
  const [region, setRegion] = useState(s.azureRegion);
  const [srvUrl, setSrvUrl] = useState(s.scoreUrl);
  const [srvTok, setSrvTok] = useState(s.scoreToken);
  const [rec, setRec] = useState(s.recoveryWord);
  const [backup, setBackup] = useState('');
  const restore = () => {
    const b = parseBackup(backup);
    if (!b) return Alert.alert('That backup is not valid', 'Paste the full text you exported.');
    Alert.alert('Restore backup?', 'This replaces the children and progress on this phone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Restore', style: 'destructive', onPress: () => { set((st) => ({ ...st, profiles: b.profiles, custom: b.custom, activeId: b.activeId, settings: { ...st.settings, ...(b.settings ?? {}) } })); setBackup(''); } },
    ]);
  };
  const flip = (k: keyof SettingsT) => set((st) => ({ ...st, settings: { ...st.settings, [k]: !st.settings[k] } }));
  const wipe = () => Alert.alert('Delete data?', `Delete all of ${profile?.name}'s tries, XP and streak? This cannot be undone.`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => set((st) => ({ ...st, profiles: st.profiles.map((p) => (p.id === profile?.id ? { ...p, attempts: [], bonusXp: 0, streak: 0, lastDay: '', outfit: undefined } : p)) })) },
  ]);
  return (
    <Screen title="Settings" onBack>
      <Card>
        <T k="heading">Accessibility</T>
        <Toggle label="Bigger text" on={s.settings.bigText} onPress={() => flip('bigText')} />
        <Toggle label="Calm mode (no animations)" on={s.settings.calm} onPress={() => flip('calm')} />
        <Toggle label="High contrast" on={s.settings.contrast} onPress={() => flip('contrast')} />
        <Toggle label="Slower speech" on={s.settings.slow} onPress={() => flip('slow')} />
      </Card>
      <Card>
        <T k="heading">Language</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
          {[
            { id: 'en', label: 'English' },
            { id: 'ar', label: 'العربية' },
            { id: 'ur', label: 'اردو' },
            { id: 'es', label: 'Español' },
          ].map((lang) => (
            <Chip
              key={lang.id}
              label={lang.label}
              on={(s.settings.lang ?? 'en') === lang.id}
              onPress={() => set((st) => ({ ...st, settings: { ...st.settings, lang: lang.id as any } }))}
              color="violet"
              style={{ flex: 1, minWidth: '45%', minHeight: 46 }}
            />
          ))}
        </View>
        <Muted k="caption" style={{ marginTop: 6 }}>Translations change the app screens only. Practice words are English. Drafts need review by a native speaker.</Muted>
      </Card>
      <Card>
        <T k="heading">Backup & restore</T>
        <Muted k="caption">Keeps progress safe if you change phone. Everything stays on your device unless you choose to share it. The backup never includes your PIN or keys.</Muted>
        <Button label="📤 Export backup" outline onPress={() => Share.share({ message: exportBackup(s), title: 'Angel Artic backup' })} style={{ marginTop: 8 }} />
        <TextInput value={backup} onChangeText={setBackup} multiline placeholder="Paste a backup here to restore" placeholderTextColor={colors.muted} style={[input, { marginVertical: 8, minHeight: 80, paddingTop: 12 }]} />
        <Button label="Restore from backup" onPress={restore} disabled={!backup.trim()} color="coral" />
      </Card>
      <Card>
        <T k="heading">Change PIN</T>
        <TextInput value={pin} onChangeText={(v) => setPin(v.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" placeholder="New 4-digit PIN" placeholderTextColor={colors.muted} style={[input, { marginVertical: 8 }]} />
        <Button label="Save PIN" disabled={pin.length !== 4} onPress={() => { set((st) => ({ ...st, pin })); setPin(''); Alert.alert('PIN changed'); }} />
      </Card>
      <Card>
        <T k="heading">PIN recovery word</T>
        <Muted k="caption">If you forget the PIN, this word unlocks grown-up areas. Pick something a child would not guess.</Muted>
        <TextInput value={rec} onChangeText={setRec} autoCapitalize="none" placeholder="Recovery word" placeholderTextColor={colors.muted} style={[input, { marginVertical: 8 }]} />
        <Button label="Save recovery word" outline disabled={rec.trim().length < 4} onPress={() => { set((st) => ({ ...st, recoveryWord: rec.trim().toLowerCase() })); Alert.alert('Saved'); }} />
      </Card>
      <Button label={adv ? '▴ Hide advanced options' : '▾ Advanced options (scoring, problem report)'} outline color="violet" onPress={() => setAdv((v) => !v)} />
      {adv && (
        <View style={{ gap: 12 }}>
      <Card>
        <T k="heading">Real pronunciation scoring (Azure)</T>
        <Muted k="caption">Optional. Needs a free Azure Speech key. Works for iPhone recordings. Without a key, or if it fails, the app uses its local practice score. Audio is sent to Microsoft only when a key is saved here.</Muted>
        <TextInput value={key} onChangeText={setKey} autoCapitalize="none" secureTextEntry placeholder="Azure Speech key" placeholderTextColor={colors.muted} style={[input, { marginTop: 8 }]} />
        <TextInput value={region} onChangeText={setRegion} autoCapitalize="none" placeholder="Region, e.g. eastus" placeholderTextColor={colors.muted} style={[input, { marginVertical: 8 }]} />
        <Button label="Save Azure settings" outline onPress={() => set((st) => ({ ...st, azureKey: key.trim(), azureRegion: region.trim().toLowerCase() }))} />
      </Card>
      <Card>
        <T k="heading">Scoring server</T>
        <Muted k="caption">Optional. A server you host keeps the Azure key off this phone and also scores Android recordings. When set, each recording is sent to that server and to Microsoft for that one word. See server/README.md.</Muted>
        <TextInput value={srvUrl} onChangeText={setSrvUrl} autoCapitalize="none" placeholder="https://your-server.example.com" placeholderTextColor={colors.muted} style={[input, { marginTop: 8 }]} />
        <TextInput value={srvTok} onChangeText={setSrvTok} autoCapitalize="none" secureTextEntry placeholder="Server token" placeholderTextColor={colors.muted} style={[input, { marginVertical: 8 }]} />
        <Button label="Save scoring server" outline onPress={() => set((st) => ({ ...st, scoreUrl: srvUrl.trim(), scoreToken: srvTok.trim() }))} />
      </Card>
      <Card>
        <T k="heading">Problem report</T>
        <Muted k="caption">If the app ever crashes, a short error note is saved on this phone only. It has no names, scores or recordings. Share it with support to help fix the bug.</Muted>
        <Button label="📤 Share problem report" outline style={{ marginTop: 8 }} onPress={async () => {
          const log = await readCrashLog();
          if (!log) return Alert.alert('Nothing to report', 'No problems have been saved. 🎉');
          Share.share({ message: `Angel Artic problem report\n\n${log}`, title: 'Angel Artic problem report' });
        }} />
        <Button label="Clear problem report" outline style={{ marginTop: 8 }} onPress={() => { clearCrashLog(); Alert.alert('Cleared'); }} color="coral" />
      </Card>
        </View>
      )}
      <Button label="🌟 About Hope Bridge Digital" outline onPress={() => go('HopeBridge')} color="violet" />
      <Button label="Run Mic Check again" outline onPress={() => set((st) => ({ ...st, micChecked: false }))} color="teal" />
      <Button label="Delete this child's data" outline onPress={wipe} color="coral" />
      <Button label="🔒 Log out of the parent area" onPress={() => logout()} color="violet" />
      <Muted k="caption" style={{ textAlign: 'center' }}>Logging out only locks the grown-up area. Nothing is deleted. Enter the PIN to open it again.</Muted>
    </Screen>
  );
}
export default withPin(SettingsInner, 'Settings');
