import { BANDS, bandFor } from '../data/curriculum';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Button, Chip, Screen, T } from '../ui';
import { MicCheckCard } from '../components';
import { Mascot } from '../art/Mascot';
import { colors, layout, soft } from '../theme';
import { SOUNDS } from '../data/sounds';
import { useNav } from '../nav';
import { useStore } from '../store';

const input = {
  minHeight: layout.tap, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
  backgroundColor: colors.white, paddingHorizontal: 16, fontSize: 16, color: colors.ink, fontFamily: 'Nunito_400Regular',
} as const;
const Label = ({ children }: { children: string }) => <T k="bodyBold" style={{ marginTop: 6 }}>{children}</T>;

export default function Onboarding() {
  const { addProfile, set } = useStore();
  const { switchTab } = useNav();
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [sounds, setSounds] = useState<string[]>(BANDS[bandFor(6)].focus.slice(0, 3));
  const [goal, setGoal] = useState(10);
  const [pin, setPin] = useState('');
  const [rec, setRec] = useState('');
  const valid = name.trim().length > 0 && /^\d{4}$/.test(pin) && sounds.length > 0;

  const finish = () => {
    addProfile({ name: name.trim(), age, targetSounds: sounds, dailyGoal: goal });
    set((s) => ({ ...s, onboarded: true, pin, recoveryWord: rec.trim().toLowerCase() }));
    switchTab('Home'); // Go straight to the Sounds page with focus sounds
  };
  const toggle = (id: string) => setSounds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginVertical: 4 }}>
        <Mascot mood="happy" size={100} />
      </View>
      <T k="title">Welcome to Angel Artic!</T>
      <T color={colors.muted}>Set up your child's profile in under a minute. A grown-up should do this part.</T>
      <Label>Child's first name</Label>
      <TextInput value={name} onChangeText={setName} placeholder="e.g. Angel" placeholderTextColor={colors.muted} style={input} />
      <Label>Age</Label>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {[[4, '3–4 years'], [6, '5–6 years'], [8, '7–8 years']].map(([a, l]) => <Chip key={a} label={l as string} on={age === a} onPress={() => { setAge(a as number); setSounds(BANDS[bandFor(a as number)].focus.slice(0, 3)); }} color="teal" style={{ flex: 1, minWidth: 95 }} />)}
      </View>
      <Label>Sounds to work on (tap any)</Label>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {SOUNDS.map((s) => <Chip key={s.id} label={`${s.label} ${s.emoji}`} on={sounds.includes(s.id)} onPress={() => toggle(s.id)} color="teal" />)}
      </View>
      <Label>Daily practice goal</Label>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[5, 10, 15].map((g) => <Chip key={g} label={`${g} words`} on={goal === g} onPress={() => setGoal(g)} color="sunny" style={{ flex: 1 }} />)}
      </View>
      <Label>Parent PIN (4 numbers) — locks the Parent Hub, plans & settings</Label>
      <TextInput value={pin} onChangeText={(v) => setPin(v.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" maxLength={4} placeholder="e.g. 1234" placeholderTextColor={colors.muted} style={input} />
      <Label>Recovery word (optional) — unlocks grown-up areas if you forget the PIN</Label>
      <TextInput value={rec} onChangeText={setRec} autoCapitalize="none" placeholder="e.g. a pet's name" placeholderTextColor={colors.muted} style={input} />
      <MicCheckCard name={name.trim()} />
      <Button label="Start practising →" onPress={finish} disabled={!valid} color="coral" style={{ borderRadius: 18, minHeight: 60 }} />
      <View style={{ backgroundColor: soft.sunny, borderRadius: 14, padding: 12 }}>
        <T k="caption" color={colors.muted}>🔒 Safe by design: no ads in child mode, no chat, no social features, and recordings never leave this device. Child mode only shows practice, play and the AAC board — settings and reports sit behind your parent PIN.</T>
      </View>
      <T k="caption" color={colors.muted} style={{ textAlign: 'center' }}>From the makers of Angel Talk: a voice for every child. 💬</T>
    </Screen>
  );
}
