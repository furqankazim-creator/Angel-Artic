import React from 'react';
import { View } from 'react-native';
import { Button, Card, Confetti, Muted, Row, Screen, T } from '../ui';
import { soundById } from '../data/sounds';
import { STICKERS } from '../data/extras';
import { isNearMiss, isPass, starsFor } from '../lib/scoring';
import { useStore } from '../store';
import { useNav } from '../nav';
import { colors } from '../theme';
import { Pic } from '../art/Pic';
import { WordPic } from '../art/WordPic';
import { Mascot } from '../art/Mascot';
import { useSpeak } from '../audio';
import { playSfx } from '../sfx';

export default function Feedback({ params }: { params: { attemptId: string; mode: string } }) {
  const { s, profile, wordById, replaceAttempt, derived } = useStore();
  const { replace, back, go, reset } = useNav();
  const a = profile?.attempts.find((x) => x.id === params.attemptId);
  const speak = useSpeak();
  React.useEffect(() => {
    if (!a) return;
    playSfx(isPass(a.score) ? 'chime' : 'soft');
    speak(isPass(a.score) ? 'Amazing! You said it so well!' : isNearMiss(a.score) ? 'So close! Great trying!' : "Good try! Let's listen first, then try together.");
  }, [a?.id]);
  if (!a) return null;
  const w = wordById(a.wordId)!;
  const sound = soundById(a.soundId, s.customSounds);
  const pass = isPass(a.score);
  const near = isNearMiss(a.score);
  const before = derived.xp - a.xp;
  const sticker = STICKERS.find((k) => before < k.xp && derived.xp >= k.xp);

  const line = pass ? 'Amazing! You said it so well!' : near ? 'So close! Great trying!' : "Good try! Let's listen first, then try together.";
  const tip = pass ? 'Say it once more to lock it in.' : near ? `Tip: ${sound.watch}` : `Tip: ${sound.cue}`;

  const parentScore = (score: number) => {
    const stars = starsFor(score);
    replaceAttempt(a.id, { score, stars, xp: stars * 5 + (isPass(score) ? 5 : 0), source: 'parent', verified: true });
  };
  const again = () => {
    // Returns to the last page that the user was in
    if (a.mode === 'daily') { reset(); go('DailyChallenge'); }
    else if (a.mode.startsWith('quest:')) { reset(); go('WorldQuest', { worldId: a.mode.slice(6) }); }
    else if (a.mode === 'custom:home') { reset(); }
    else if (a.mode === 'custom') { reset(); go('CustomWords'); }
    else { back(); }
  };
  const done = () => {
    if (a.mode === 'daily') { reset(); go('DailyChallenge'); }
    else if (a.mode.startsWith('quest:')) { reset(); go('WorldQuest', { worldId: a.mode.slice(6) }); }
    else if (a.mode === 'custom:home') { reset(); }
    else if (a.mode === 'custom') { reset(); go('CustomWords'); }
    else { back(); }
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen title={pass ? 'Brilliant! 🎉' : 'Nice try!'} onBack>
        <Card accent={pass ? 'green' : near ? 'sunny' : 'coral'} style={{ alignItems: 'center', gap: 6 }}>
          <WordPic w={w} size={84} />
          <T k="bigWord">{w.word}</T>
          <T k="title">{a.score} / 100</T>
          <T style={{ fontSize: 44 }}>{'⭐'.repeat(a.stars)}</T>
          <Muted k="caption">{a.source === 'parent' ? 'Parent-scored' : a.source === 'azure' ? 'Pronunciation score (Azure)' : a.verified ? 'Practice score' : 'Practice score (voice heard, word not verified)'}</Muted>
        </Card>
        <View style={{ alignItems: 'center' }}><Mascot mood={pass ? 'cheer' : near ? 'happy' : 'gentle'} size={80} /></View>
        <T k="heading" style={{ textAlign: 'center' }}>{line}</T>
        <T style={{ textAlign: 'center' }}>{tip}</T>
        {sticker && (
          <Card accent="sunny" style={{ alignItems: 'center' }}>
            <Pic emoji={sticker.emoji} size={64} />
            <T k="heading">New sticker: {sticker.name}!</T>
          </Card>
        )}
        <Row>
          <Button label="🔁 Try again" onPress={again} color="coral" style={{ flex: 1 }} />
          <Button label="Done ✓" onPress={done} style={{ flex: 1 }} />
        </Row>
        <Card>
          <Muted k="caption">GROWN-UP SCORING (labelled parent-scored)</Muted>
          <Row style={{ marginTop: 8 }}>
            <Button small label="Correct" color="green" onPress={() => parentScore(92)} style={{ flex: 1 }} />
            <Button small label="Almost" color="sunny" onPress={() => parentScore(70)} style={{ flex: 1 }} />
            <Button small label="Try Again" color="coral" onPress={() => parentScore(40)} style={{ flex: 1 }} />
          </Row>
        </Card>
      </Screen>
      {pass && <Confetti />}
    </View>
  );
}
