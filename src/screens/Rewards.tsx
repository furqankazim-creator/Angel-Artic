import React from 'react';
import { Pressable, View } from 'react-native';
import { Card, Muted, Pill, Row, Screen, T, Bar, Button } from '../ui';
import { OUTFITS, STICKERS, WORLDS } from '../data/extras';
import { useStore } from '../store';
import { useNav } from '../nav';
import { colors } from '../theme';
import { Pic } from '../art/Pic';
import { Mascot } from '../art/Mascot';
import { AdventureMap } from '../art/AdventureMap';

export default function Rewards() {
  const { s, profile, derived, patchProfile } = useStore();
  const { go } = useNav();
  if (!profile) return null;
  const { xp, masteredCount, missionWords, todayWordIds } = derived;
  const worldUnlocked = WORLDS.filter((w) => masteredCount >= w.words);
  const nextWorld = WORLDS.find((w) => masteredCount < w.words);
  const outfit = OUTFITS.find((o) => o.id === profile.outfit);

  return (
    <Screen title="Play & Rewards" onBack>
      <Card accent="sunny" style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}><Mascot mood="cheer" size={90} />{outfit && <Pic emoji={outfit.emoji} size={44} />}</View>
        <T k="heading">{profile.name}</T>
        <Row><Pill label={`⭐ ${derived.stars}`} color="sunny" /><Pill label={`✨ ${xp} XP`} color="sunny" /></Row>
        <Muted k="caption" style={{ marginTop: 6 }}>XP is never spent or lost.</Muted>
      </Card>

      <T k="heading">Adventure map 🗺️</T>
      <Muted>Master words to open new worlds. Tap a world to start its quest.</Muted>
      <AdventureMap />
      <Card accent="pink">
        <T k="heading">🎯 Today's Challenge</T>
        <Muted>Picked for {profile.name} from the sounds that need the most practice. Say these 3 words today.</Muted>
        {missionWords.map((w) => {
          const done = todayWordIds.includes(w.id);
          return (
            <Row key={w.id} style={{ marginTop: 8 }}>
              <Pic emoji={w.emoji} size={36} />
              <T k="bodyBold" style={{ flex: 1 }}>{w.word}</T>
              {done ? <T>✅</T> : <Button small label="Say it" color="coral" onPress={() => (s.micChecked ? go('Record', { wordId: w.id, mode: 'mission' }) : go('MicCheck'))} />}
            </Row>
          );
        })}
        <Button label="📅 See all of today's words" outline color="coral" onPress={() => go('DailyChallenge')} style={{ marginTop: 10 }} />
      </Card>

      <T k="heading">Stickers</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {STICKERS.map((k) => {
          const on = xp >= k.xp;
          return (
            <View key={k.id} style={{ width: '47%', backgroundColor: on ? colors.white : colors.card, borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border, opacity: on ? 1 : 0.6 }}>
              <Pic emoji={on ? k.emoji : '🔒'} size={48} />
              <T k="bodyBold">{k.name}</T>
              <Muted k="caption">{k.xp} XP</Muted>
            </View>
          );
        })}
      </View>

      <T k="heading">Dress-up</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {OUTFITS.map((o) => {
          const on = xp >= o.xp;
          return (
            <Pressable key={o.id} disabled={!on} onPress={() => patchProfile({ outfit: o.id })}
              style={{ width: '47%', backgroundColor: profile.outfit === o.id ? colors.green : colors.white, borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border, opacity: on ? 1 : 0.6 }}>
              <Pic emoji={on ? o.emoji : '🔒'} size={48} />
              <T k="bodyBold">{o.name}</T>
              <Muted k="caption">{o.xp} XP</Muted>
            </Pressable>
          );
        })}
      </View>

    </Screen>
  );
}
