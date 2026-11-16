import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Muted, Screen, T } from '../ui';
import { LevelMeter } from '../components';
import { useMeterRecorder } from '../audio';
import { GATE_MESSAGES, runGate } from '../lib/gate';
import { useStore } from '../store';
import { useNav } from '../nav';
import { colors } from '../theme';

export default function MicCheck({ params }: { params?: { first?: boolean } }) {
  const { s, set } = useStore();
  const { reset, back } = useNav();
  const { start, recording, denied } = useMeterRecorder();
  const [db, setDb] = useState(-160);
  const [result, setResult] = useState<'pass' | string | null>(null);

  const run = async () => {
    setResult(null);
    await start({ autoStop: true, maxMs: 6000, onTick: (t) => setDb(t.db) }, (c) => {
      const g = runGate(c.samples);
      if (g.status === 'ok') { setResult('pass'); set((st) => ({ ...st, micChecked: true })); }
      else setResult(GATE_MESSAGES[g.status]);
      setDb(-160);
    });
  };

  return (
    <Screen title="Mic Check" onBack={!params?.first}>
      <Card accent="sky">
        <T k="heading">🎙️ Let's test the microphone</T>
        <Muted style={{ marginTop: 6 }}>Press the button and say "hello" out loud. A grown-up can watch the meter. It must turn green.</Muted>
      </Card>
      <Card>
        <LevelMeter db={db} />
      </Card>
      {denied && <T k="bodyBold" color={colors.coral}>The microphone is switched off. A grown-up can allow it in Settings.</T>}
      {result === 'pass' && <Card accent="green"><T k="heading">✅ I can hear you!</T><Muted>The microphone works. Silence will never get a score.</Muted></Card>}
      {result && result !== 'pass' && <Card accent="coral"><T k="bodyBold">{result}</T></Card>}
      <Button label={recording ? 'Listening… say hello' : result === 'pass' ? 'Test again' : '▶ Run Mic Check'} onPress={run} disabled={recording} color="teal" />
      {result === 'pass' && <Button label={params?.first ? "Let's practise →" : 'Done'} onPress={reset} />}
      <View style={{ height: 8 }} />
      <Muted k="caption">Mic Check status: {s.micChecked ? 'passed' : 'not tested yet'}</Muted>
    </Screen>
  );
}
