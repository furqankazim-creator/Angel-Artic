import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button, Card, Muted, Pill, Row, Screen, T } from '../ui';
import { dayKey } from '../lib/date';
import { useStore } from '../store';
import { useNav } from '../nav';
import { WordPic } from '../art/WordPic';
import { getDailyChallenge } from '../lib/daily';

export default function DailyChallenge() {
  const { s, profile, allWords, patchProfile } = useStore();
  const { go } = useNav();
  if (!profile) return null;

  const challengeItems = getDailyChallenge(profile, allWords);
  const doneIds = profile.attempts
    .filter((a) => a.day === dayKey() && a.mode === 'daily' && a.status === 'scored')
    .map((a) => a.wordId);

  const allDone = challengeItems.every((item) => doneIds.includes(item.word.id));

  useEffect(() => {
    if (allDone && profile.challengeDay !== dayKey()) {
      patchProfile({ challengeDay: dayKey(), bonusXp: profile.bonusXp + 25 });
    }
  }, [allDone]);

  return (
    <Screen title="Daily Challenge" onBack>
      <Card accent="pink">
        <T k="heading">Today's Focus Challenge ⭐</T>
        <Muted>
          5 words automatically chosen from sounds {profile.name} is working on. Finish all five for 25 bonus XP!
        </Muted>
      </Card>

      {challengeItems.map((item) => {
        const done = doneIds.includes(item.word.id);
        const w = item.word;
        return (
          <Card key={w.id} accent={done ? 'green' : undefined}>
            <Row style={{ alignItems: 'center', gap: 12 }}>
              <WordPic w={w} size={54} />
              <View style={{ flex: 1, gap: 2 }}>
                <Row style={{ alignItems: 'center', gap: 8 }}>
                  <T k="heading">{w.word}</T>
                  <Pill
                    label={item.badge}
                    color={item.isProblematic ? 'coral' : 'violet'}
                  />
                </Row>
                <Muted k="caption">
                  Sound /{item.soundId}/ · {item.reason}
                </Muted>
              </View>
              {done ? (
                <T style={{ fontSize: 26 }}>✅</T>
              ) : (
                <Button
                  small
                  label="Say it"
                  onPress={() => (s.micChecked ? go('Record', { wordId: w.id, mode: 'daily' }) : go('MicCheck'))}
                  color="coral"
                />
              )}
            </Row>
          </Card>
        );
      })}

      {allDone && (
        <Card accent="sunny">
          <T k="heading">🎉 Daily Challenge complete! +25 bonus XP</T>
          <Muted>Great job practicing target sounds today!</Muted>
        </Card>
      )}
    </Screen>
  );
}
