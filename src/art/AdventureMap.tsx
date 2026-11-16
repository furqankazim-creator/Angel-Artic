import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ADVENTURE } from '../data/adventure';
import { questPool, questWords } from '../lib/quest';
import { useStore } from '../store';
import { useNav } from '../nav';
import { colors } from '../theme';
import { Muted, T } from '../ui';
import { Mascot } from './Mascot';
import { Pic } from './Pic';

const ROW = 156;

export function useQuest() {
  const { s, profile, derived, allWords } = useStore();
  const pool = questPool(allWords, profile?.targetSounds ?? []);
  const passed = new Set((profile?.attempts ?? []).filter((a) => a.status === 'scored' && a.score >= 80).map((a) => a.wordId));
  return ADVENTURE.map((w, i) => {
    const words = questWords(i, pool);
    const done = words.filter((x) => passed.has(x.id)).length;
    return { world: w, index: i, words, done, open: derived.masteredCount >= w.need, complete: words.length > 0 && done === words.length };
  });
}

/** A winding adventure path. Worlds open as words are mastered; tap one to play its quest. */
export function AdventureMap() {
  const { go } = useNav();
  const { derived } = useStore();
  const quests = useQuest();
  const [w, setW] = useState(320);
  const here = quests.findIndex((q) => q.open && !q.complete);
  const xs = quests.map((_, i) => (i % 2 === 0 ? 0.3 : 0.7) * w);
  const ys = quests.map((_, i) => 64 + i * ROW);
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < quests.length; i++) {
    const my = (ys[i - 1] + ys[i]) / 2;
    d += ` C ${xs[i - 1]} ${my}, ${xs[i]} ${my}, ${xs[i]} ${ys[i]}`;
  }
  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ height: ROW * quests.length + 30 }}>
      <Svg width={w} height={ROW * quests.length + 30} style={{ position: 'absolute' }}>
        <Path d={d} stroke={colors.sunny} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 16" fill="none" />
      </Svg>
      {quests.map((q, i) => {
        const left = xs[i] - 46;
        const onLeft = i % 2 === 0;
        return (
          <View key={q.world.id}>
            <Pressable
              accessibilityLabel={`${q.world.name}${q.open ? '' : ', locked'}`}
              onPress={() => (q.open ? go('WorldQuest', { worldId: q.world.id }) : null)}
              style={{ position: 'absolute', left, top: ys[i] - 46, width: 92, height: 92, borderRadius: 46, backgroundColor: q.open ? q.world.tint : colors.card, borderWidth: 4, borderColor: q.complete ? colors.green : q.open ? colors.violet : colors.border, alignItems: 'center', justifyContent: 'center', opacity: q.open ? 1 : 0.65 }}
            >
              <Pic emoji={q.open ? q.world.scene[0] : '🔒'} size={48} />
            </Pressable>
            <View style={{ position: 'absolute', top: ys[i] + 50, left: xs[i] - 90, width: 180, alignItems: 'center' }}>
              <T k="bodyBold" style={{ textAlign: 'center' }}>{q.world.name}</T>
              <Muted k="caption">
                {q.complete ? '⭐ Complete!' : q.open ? `${q.done} / ${q.words.length} stops` : `Master ${q.world.need - derived.masteredCount} more words`}
              </Muted>
            </View>
            {i === here && (
              <View style={{ position: 'absolute', top: ys[i] - 60, left: onLeft ? xs[i] + 52 : xs[i] - 52 - 64 }}>
                <Mascot mood="cheer" size={64} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
