import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Button, Card, Muted, Row, Screen, T } from '../ui';
import { Waveform } from '../components';
import { useMeterRecorder, useSpeak, playUri } from '../audio';
import { GATE_MESSAGES, runGate } from '../lib/gate';
import { isPass, localScore, starsFor } from '../lib/scoring';
import { scoreWithAzure, scoreWithServer } from '../lib/azure';
import { Attempt, uid, useStore } from '../store';
import { useNav } from '../nav';
import { persistFile } from '../lib/recordings';
import { WordPic } from '../art/WordPic';
import { Mascot } from '../art/Mascot';
import { dayKey } from '../lib/date';
import { colors, soft } from '../theme';
import { soundById } from '../data/sounds';
import { MouthAnim } from '../art/MouthAnim';

export default function Record({ params }: { params: { wordId: string; mode: string } }) {
  const { s, wordById, addAttempt } = useStore();
  const { replace, back } = useNav();
  const speak = useSpeak();
  const { start, stop, recording, status, levels, denied } = useMeterRecorder();
  const w = wordById(params.wordId)!;
  const sound = soundById(w.soundId);
  // Single sounds and syllables are not real words, so cloud scoring cannot judge them: local gate only.
  const cloud = w.kind !== 'sound' && w.kind !== 'syllable';
  const [message, setMessage] = useState<string | null>(null);
  const [showMouth, setShowMouth] = useState(false);

  const tap = async () => {
    if (recording) return stop();
    setMessage(null);
    await start({ autoStop: w.kind !== 'story', maxMs: w.kind === 'story' ? 30000 : w.kind === 'sentence' ? 14000 : w.kind === 'phrase' ? 9000 : 7000 }, async (c) => {
      const g = runGate(c.samples);
      const base = { id: uid(), ts: Date.now(), day: dayKey(), wordId: w.id, soundId: w.soundId, word: w.word, mode: params.mode,
        durationMs: g.totalMs, peakDb: Math.round(g.peakDb), uri: await persistFile(c.uri) };
      if (g.status !== 'ok') {
        // No score, no stars, no XP: logged separately as "No sound heard".
        addAttempt({ ...base, status: g.status, score: 0, stars: 0, xp: 0, source: 'local', verified: false } as Attempt);
        setMessage(GATE_MESSAGES[g.status]);
        return;
      }
      const sr = (cloud ? await scoreWithServer({ url: s.scoreUrl, token: s.scoreToken }, c.uri, w.word) : null) ?? (cloud ? await scoreWithAzure({ key: s.azureKey, region: s.azureRegion }, c.uri, w.word) : null) ?? localScore(w.word, c.heard, g.speechMs);
      const stars = starsFor(sr.score);
      const attempt: Attempt = { ...base, status: 'scored', score: sr.score, stars, xp: stars * 5 + (isPass(sr.score) ? 5 : 0), source: sr.source, verified: sr.verified };
      addAttempt(attempt);
      replace('Feedback', { attemptId: attempt.id, mode: params.mode });
    });
  };

  const live = status === 'idle' ? (recording ? 'Listening' : 'Tap the mic and say it!') : status;
  const tint = status === 'Hearing you' ? colors.green : status === 'Too quiet' ? colors.coral : colors.violet;

  return (
    <Screen title="Your turn" onBack>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <WordPic w={w} size={96} />
        {w.word.length > 14 ? <T k="heading" style={{ textAlign: 'center' }}>{w.word}</T> : <T k="bigWord">{w.word}</T>}
        <Row style={{ gap: 8, marginTop: 4, alignItems: 'center' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hear the target word"
            onPress={() => (w.voiceUri ? playUri(w.voiceUri) : speak(w.word))}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: soft.sky, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 }}
          >
            <T style={{ fontSize: 16 }}>🔊</T>
            <T k="caption" color={colors.sky} style={{ fontFamily: 'Nunito_700Bold' }}>
              {w.voiceUri ? "Hear parent's voice" : 'Hear it'}
            </T>
          </Pressable>

          {sound && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Watch mouth shape"
              onPress={() => setShowMouth((v) => !v)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: showMouth ? soft.sunny : colors.white,
                borderWidth: 1.5,
                borderColor: colors.sunny,
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 999,
              }}
            >
              <T style={{ fontSize: 16 }}>👄</T>
              <T k="caption" color={colors.ink} style={{ fontFamily: 'Nunito_700Bold' }}>
                Mouth
              </T>
            </Pressable>
          )}
        </Row>
      </View>

      {showMouth && sound && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mouth guide, tap to close"
          onPress={() => setShowMouth(false)}
          style={{
            backgroundColor: soft.sunny,
            borderRadius: 24,
            padding: 14,
            alignItems: 'center',
            gap: 6,
            borderWidth: 2,
            borderColor: '#F6D365',
            shadowColor: colors.sunny,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 3,
            width: '100%',
            maxWidth: 540,
            alignSelf: 'center',
          }}
        >
          <T k="bodyBold" style={{ fontSize: 16 }}>👄 Watch the mouth</T>
          <MouthAnim soundId={sound.id} />
          {sound.cue && <Muted k="caption" style={{ textAlign: 'center' }}>{sound.cue}</Muted>}
        </Pressable>
      )}
      <View style={{ alignItems: 'center' }}><Mascot mood={status === 'Hearing you' ? 'cheer' : 'listen'} size={72} /></View>
      <Waveform levels={levels} color={tint} />
      <T k="heading" style={{ textAlign: 'center' }} color={tint}>{live}</T>
      <View style={{ alignItems: 'center' }}>
        <Pressable accessibilityLabel={recording ? 'Stop' : 'Record'} onPress={tap}
          style={{ width: 132, height: 132, borderRadius: 66, backgroundColor: recording ? colors.coral : colors.violet,
            alignItems: 'center', justifyContent: 'center', borderWidth: 10, borderColor: recording ? soft.coral : soft.violet }}>
          <T style={{ fontSize: 54 }}>{recording ? '⏹' : '🎤'}</T>
        </Pressable>
      </View>
      {message && (
        <Card accent="coral">
          <T k="bodyBold">🙉 {message}</T>
          <Muted k="caption" style={{ marginTop: 4 }}>No score for this one. It does not count against you.</Muted>
        </Card>
      )}
      {denied && <T k="bodyBold" color={colors.coral}>The microphone is switched off. A grown-up can allow it in Settings.</T>}
      <Button label="Back to word" outline onPress={back} />
    </Screen>
  );
}
