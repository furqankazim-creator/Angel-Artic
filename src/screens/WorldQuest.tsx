import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Muted, Row, Screen, T } from '../ui';
import { Pic } from '../art/Pic';
import { WordPic } from '../art/WordPic';
import { MascotBubble } from '../art/Mascot';
import { useQuest } from '../art/AdventureMap';
import { useStore } from '../store';
import { useNav } from '../nav';
import { colors } from '../theme';

export default function WorldQuest({ params }: { params: { worldId: string } }) {
  const { s, profile, patchProfile } = useStore();
  const { go } = useNav();
  const quests = useQuest();
  const q = quests.find((x) => x.world.id === params.worldId);
  const claimed = profile?.questDone?.includes(params.worldId);

  useEffect(() => {
    if (q?.complete && profile && !claimed) {
      patchProfile({ questDone: [...(profile.questDone ?? []), params.worldId], bonusXp: profile.bonusXp + 20 });
    }
  }, [q?.complete, claimed]);

  if (!q) return null;
  const { world, words } = q;
  const play = (id: string) => (s.micChecked ? go('Record', { wordId: id, mode: `quest:${world.id}` }) : go('MicCheck'));

  return (
    <Screen title={world.name} onBack>
      <View style={{ backgroundColor: world.tint, borderRadius: 28, padding: 16, gap: 12 }}>
        <Row style={{ justifyContent: 'space-around' }}>{world.scene.map((e, i) => <Pic key={i} emoji={e} size={44} />)}</Row>
        <MascotBubble text={world.story} mood={q.complete ? 'cheer' : 'happy'} size={88} />
      </View>
      <T k="heading">Your quest · {q.done} / {words.length}</T>
      {words.map((w, i) => {
        const ok = (profile?.attempts ?? []).some((a) => a.wordId === w.id && a.status === 'scored' && a.score >= 80);
        return (
          <Pressable key={w.id + i} onPress={() => play(w.id)} style={{ marginLeft: i % 2 ? 36 : 0, marginRight: i % 2 ? 0 : 36, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: ok ? '#D2F7EB' : colors.white, borderRadius: 22, padding: 12, borderWidth: 2, borderColor: ok ? colors.green : colors.border }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: ok ? colors.green : colors.violet, alignItems: 'center', justifyContent: 'center' }}>
              <T k="bodyBold" color={ok ? colors.ink : colors.white}>{ok ? '✓' : i + 1}</T>
            </View>
            <WordPic w={w} size={48} />
            <T k="heading" style={{ flex: 1 }}>{w.word}</T>
            <Muted k="caption">/{w.soundId}/</Muted>
          </Pressable>
        );
      })}
      {q.complete && (
        <View style={{ backgroundColor: '#FFF3C4', borderRadius: 24, padding: 16, alignItems: 'center', gap: 6 }}>
          <Pic emoji={world.badge} size={64} />
          <T k="heading">{world.name} complete!</T>
          <Muted>+20 XP bonus earned. New worlds open as you master more words.</Muted>
        </View>
      )}
    </Screen>
  );
}
