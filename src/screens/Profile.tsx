import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { Button, Card, Muted, Pill, Row, Screen, T } from '../ui';
import { useStore } from '../store';
import { useNav } from '../nav';
import { colors, layout } from '../theme';

export default function Profile() {
  const { s, profile, set, addProfile, derived } = useStore();
  const { go } = useNav();
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  if (!profile) return null;

  return (
    <Screen onBack>
      <T k="title">Profile</T>
      <Card accent="violet">
        <T k="heading">{profile.name}, age {profile.age}</T>
        <Row style={{ flexWrap: 'wrap', marginTop: 8 }}>
          <Pill label={`✨ ${derived.xp} XP`} color="sunny" />
          <Pill label={`🔥 ${profile.streak} day streak`} color="coral" />
          <Pill label={`🎯 goal ${profile.dailyGoal}/day`} color="pink" />
        </Row>
      </Card>
      <T k="heading">Children</T>
      {s.profiles.map((p) => (
        <Card key={p.id} accent={p.id === profile.id ? 'green' : undefined} onPress={() => set((st) => ({ ...st, activeId: p.id }))}>
          <T k="bodyBold">{p.id === profile.id ? '✅ ' : ''}{p.name} (age {p.age})</T>
        </Card>
      ))}
      {adding && (
        <>
          <TextInput value={name} onChangeText={setName} placeholder="First name" placeholderTextColor={colors.muted}
            style={{ minHeight: layout.tap, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: 16, fontSize: 17, color: colors.ink }} />
          <Button label="Add child" disabled={!name.trim()} onPress={() => { addProfile({ name: name.trim(), age: 5, targetSounds: ['p', 's', 'r'], dailyGoal: 5 }); setName(''); setAdding(false); }} />
        </>
      )}
      {!adding && <Button label="+ Add a child" outline onPress={() => setAdding(true)} />}
      <Button label="Privacy & Terms" outline onPress={() => go('Legal')} color="teal" />
    </Screen>
  );
}
