import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Chip, Muted, Row, Screen, T } from '../ui';
import { playUri } from '../audio';
import { WordPic } from '../art/WordPic';
import { useStore } from '../store';
import { withPin } from './PinGate';

function CompareInner() {
  const { profile, wordById } = useStore();
  const [pick, setPick] = useState<string | null>(null);
  const withAudio = (profile?.attempts ?? []).filter((a) => a.status === 'scored' && a.uri);
  const ids = Array.from(new Set(withAudio.map((a) => a.wordId))).filter((id) => withAudio.filter((a) => a.wordId === id).length >= 2);
  const chosen = pick ?? ids[0] ?? null;
  const list = withAudio.filter((a) => a.wordId === chosen);
  const first = list[0];
  const last = list[list.length - 1];
  const w = chosen ? wordById(chosen) : undefined;
  const delta = first && last ? last.score - first.score : 0;

  return (
    <Screen title="Compare recordings" onBack>
      <Muted>Listen to the first and the latest try of the same word, side by side.</Muted>
      {ids.length === 0 && <Card><T k="bodyBold">Not enough recordings yet</T><Muted>Practise a word at least twice and it will appear here.</Muted></Card>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {ids.map((id) => <Chip key={id} label={wordById(id)?.word ?? id} on={id === chosen} onPress={() => setPick(id)} color="violet" />)}
      </View>
      {w && first && last && (
        <>
          <Row style={{ justifyContent: 'center' }}><WordPic w={w} size={72} /><T k="title">{w.word}</T></Row>
          {[['First try', first], ['Latest try', last]].map(([label, a]: any) => (
            <Card key={label} accent={a === last ? 'green' : undefined}>
              <Row>
                <View style={{ flex: 1 }}>
                  <T k="heading">{label}</T>
                  <Muted k="caption">{new Date(a.ts).toLocaleDateString()} · {a.score}/100</Muted>
                </View>
                <Button small label="▶ Play" onPress={() => playUri(a.uri)} color="sky" />
              </Row>
            </Card>
          ))}
          <Card accent={delta >= 0 ? 'sunny' : undefined}>
            <T k="bodyBold">{first === last ? 'Only one recording so far.' : delta > 0 ? `Up ${delta} points since the first try. 🎉` : delta === 0 ? 'Same score as the first try.' : `${Math.abs(delta)} points lower than the first try. Keep practising!`}</T>
          </Card>
        </>
      )}
    </Screen>
  );
}
export default withPin(CompareInner, 'Compare recordings');
