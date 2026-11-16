import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Muted, Row, Screen, T } from '../ui';
import { colors, soft } from '../theme';
import { Position, soundById, wordsFor, Word } from '../data/sounds';
import { BANDS, SOUND_INFO, bandFor } from '../data/curriculum';
import { BAND_LEVELS, LEVELS, itemsFor, ladder, levelMeta, type Level } from '../data/levels';
import { useStore } from '../store';
import { useNav } from '../nav';
import { useSpeak as useSpeakBase, playUri } from '../audio';
import { FloatingInfo, InfoLabel } from '../components';
import { WordPic } from '../art/WordPic';
import { MouthAnim } from '../art/MouthAnim';

type Mode = 'Listen & Repeat' | 'Watch Mouth' | 'Sentence Practice';
const POS: { p: Position; label: string; icon: string }[] = [
  { p: 'initial', label: 'Start', icon: '▶' }, { p: 'medial', label: 'Middle', icon: '●' }, { p: 'final', label: 'End', icon: '■' },
];

function Highlighted({ w, soundId, pos }: { w: Word; soundId: string; pos: Position }) {
  const n = soundId.length;
  const word = w.word;
  let a = -1;
  if (pos === 'initial') a = 0;
  else if (pos === 'final') a = word.lastIndexOf(soundId);
  else a = word.indexOf(soundId, 1);
  const S = { fontSize: 38, fontFamily: 'Baloo2_800ExtraBold' } as const;
  if (a < 0) return <T style={S}>{word}</T>;
  return (
    <T style={S}>
      {word.slice(0, a)}
      <T style={{ ...S, color: colors.coral, textDecorationLine: 'underline' }}>{word.slice(a, a + n)}</T>
      {word.slice(a + n)}
    </T>
  );
}

/** Sounds whose info card was already shown this session, so it does not pop up on every visit. */
const shownSounds = new Set<string>();

export default function Practice({ params }: { params: { soundId: string } }) {
  const { s, profile, derived } = useStore();
  const { go, switchTab } = useNav();
  const speakBase = useSpeakBase();
  const sound = soundById(params.soundId, s.customSounds);
  const [position, setPosition] = useState<Position>(sound.positions[0] ?? 'initial');
  const [mode, setMode] = useState<Mode>('Listen & Repeat');
  const [i, setI] = useState(0);
  const [watch, setWatch] = useState(false);

  const custom = useMemo(() => s.custom.filter((c) => c.profileId === profile?.id), [s.custom, profile?.id]);
  const band = bandFor(profile?.age ?? 5);
  const info = SOUND_INFO[sound.id] ?? {
    ipa: sound.label,
    how: sound.cue || 'Custom Target Sound',
    usual: 'as targeted by parent',
    pair: [sound.id, sound.id],
    twister: sound.cue || `Practise saying ${sound.label} clearly.`,
  };
  const [infoOpen, setInfoOpen] = useState(() => !shownSounds.has(params.soundId));
  React.useEffect(() => { if (infoOpen) shownSounds.add(params.soundId); }, [infoOpen]);
  const steps = ladder(profile?.attempts ?? [], sound.id, band);
  const [level, setLevel] = useState<Level>(() => steps.find((x) => x.state === 'next')?.level ?? BAND_LEVELS[band].start);
  const wordLevel = level === 'word';
  const rawList = wordLevel ? wordsFor(sound.id, position, custom, band) : itemsFor(sound.id, level, band);
  const list = rawList.length > 0 ? rawList : [{
    id: `custom-placeholder-${sound.id}`,
    soundId: sound.id,
    position: 'initial' as Position,
    word: sound.id,
    emoji: sound.emoji,
    sentence: sound.cue || `Practise saying "${sound.id}".`,
    custom: true,
  }];
  const idx = ((i % list.length) + list.length) % list.length;
  const w = list[idx];
  // A parent's own recording of a custom word plays instead of the voice clip.
  const speak = (text: string, slow?: boolean) => (w?.voiceUri && text === w.word ? playUri(w.voiceUri) : speakBase(text, slow));
  const sentenceMode = mode === 'Sentence Practice';
  const sayWord = !sentenceMode;

  const move = (d: number) => { setI(i + d); };
  const myTurn = () => (s.micChecked ? go('Record', { wordId: w.id, mode: wordLevel ? mode : level }) : go('MicCheck'));
  const say = wordLevel ? (sentenceMode ? w.sentence : w.word) : (w.speakText ?? w.word);

  const chip = (on: boolean, color: string = colors.violet) => ({ minHeight: 40, borderRadius: 999, paddingHorizontal: 12, justifyContent: 'center' as const, borderWidth: 2, borderColor: on ? color : colors.border, backgroundColor: on ? color : colors.white });
  const round = { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1.5, borderColor: '#BFE0F7', alignItems: 'center' as const, justifyContent: 'center' as const };

  return (
    <View style={{ flex: 1 }}>
    <Screen gap={10}>
      {/* Title row */}
      <Row style={{ alignItems: 'center', gap: 6 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="All sounds" onPress={() => switchTab('Home')} style={{ width: 40, height: 44, justifyContent: 'center' }}>
          <T k="title" color={colors.sky}>‹</T>
        </Pressable>
        <T k="title" style={{ flex: 1 }} numberOfLines={1}>{sound.label} sound</T>
        <Pressable accessibilityRole="button" accessibilityLabel="Show sound info" onPress={() => setInfoOpen(true)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <T k="heading">ℹ️</T>
        </Pressable>
        <View style={{ backgroundColor: soft.coral, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
          <T k="caption" color={colors.coral}>{idx + 1} / {list.length}</T>
        </View>
      </Row>

      {/* Levels: one row, swipe */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingRight: 20 }} style={{ flexGrow: 0 }}>
        {steps.map((st) => {
          const m = levelMeta(st.level);
          const on = st.level === level;
          return (
            <Pressable key={st.level} accessibilityRole="button" accessibilityLabel={`${m.label} level`} onPress={() => { setLevel(st.level); setI(0); setMode('Listen & Repeat'); }}
              style={{ ...chip(on), borderColor: on ? colors.violet : st.state === 'next' ? colors.coral : colors.border }}>
              <T k="caption" color={on ? colors.white : colors.ink} style={{ fontFamily: 'Nunito_700Bold' }}>{m.icon} {m.label}{st.state === 'done' ? ' ✅' : st.state === 'next' ? ' ▶' : ''}</T>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Where in the word, and sentence on/off */}
      {wordLevel && (
        <Row style={{ gap: 6 }}>
          {POS.filter((x) => sound.positions.includes(x.p)).map(({ p, label }) => (
            <Pressable key={p} onPress={() => { setPosition(p); setI(0); }}
              style={{ flex: 1, minHeight: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: position === p ? colors.sunny : soft.violet }}>
              <T k="caption" style={{ fontFamily: 'Nunito_700Bold' }}>{label}</T>
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" accessibilityLabel="Say the sentence" onPress={() => { setMode(sentenceMode ? 'Listen & Repeat' : 'Sentence Practice'); }}
            style={{ minHeight: 40, borderRadius: 14, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: sentenceMode ? colors.teal : soft.violet }}>
            <T k="caption" color={sentenceMode ? colors.white : colors.ink} style={{ fontFamily: 'Nunito_700Bold' }}>💬 Sentence</T>
          </Pressable>
        </Row>
      )}

      {/* The word card, with previous / next on its edges */}
      <View>
        <View style={{ backgroundColor: soft.sky, borderRadius: 26, borderWidth: 3, borderColor: '#BFE0F7', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 40, gap: 2, minHeight: 200, justifyContent: 'center' }}>
          {!wordLevel ? (
            <>
              <WordPic w={w} size={112} />
              <T style={{ fontSize: level === 'story' ? 19 : w.word.length > 28 ? 21 : w.word.length > 12 ? 26 : 38, fontFamily: 'Baloo2_800ExtraBold', textAlign: 'center', lineHeight: level === 'story' ? 28 : undefined }}>{w.word}</T>
              <T k="caption" color={colors.muted} style={{ textAlign: 'center' }}>{w.sentence}</T>
            </>
          ) : (
            <>
              <WordPic w={w} size={88} />
              <Highlighted w={w} soundId={sound.letters} pos={position} />
              <T k="caption" color={colors.muted} style={{ textAlign: 'center' }}>“{w.sentence}”</T>
            </>
          )}
          <Row style={{ gap: 5, marginTop: 4 }}>
            {list.map((_, d) => <View key={d} style={{ width: d === idx ? 22 : 8, height: 8, borderRadius: 4, backgroundColor: d === idx ? colors.coral : '#D5E4F2' }} />)}
          </Row>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous word" onPress={() => move(-1)} style={{ ...round, position: 'absolute', left: -6, top: '50%', marginTop: -22 }}><T k="title">‹</T></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Next word" onPress={() => move(1)} style={{ ...round, position: 'absolute', right: -6, top: '50%', marginTop: -22 }}><T k="title">›</T></Pressable>
      </View>

      {/* Actions */}
      <Row style={{ gap: 8 }}>
        <Button label="🔊 Listen" onPress={() => speak(say)} color="sky" style={{ flex: 1, minHeight: 52 }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Hear it slowly" onPress={() => speak(say, true)} style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: soft.violet, alignItems: 'center', justifyContent: 'center' }}>
          <T style={{ fontSize: 24 }}>🐢</T>
        </Pressable>
        <Button label="🎤 My Turn" onPress={myTurn} color="coral" style={{ flex: 1, minHeight: 52 }} />
      </Row>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Watch mouth"
        onPress={() => setWatch((v) => !v)}
        style={{
          minHeight: 52,
          borderRadius: 20,
          backgroundColor: watch ? soft.sunny : colors.white,
          borderWidth: 2,
          borderColor: colors.sunny,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          shadowColor: colors.sunny,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: watch ? 0.2 : 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <T style={{ fontSize: 20 }}>👄</T>
        <T k="button" color={colors.ink}>
          {watch ? 'Close mouth guide ✕' : 'Watch the mouth'}
        </T>
      </Pressable>

      {(watch || mode === 'Watch Mouth') && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mouth guide, tap to close"
          onPress={() => { setWatch(false); if (mode === 'Watch Mouth') setMode('Listen & Repeat'); }}
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
          }}
        >
          <T k="bodyBold" style={{ fontSize: 16 }}>👄 Watch the mouth</T>
          <MouthAnim soundId={sound.id} />
          <Muted k="caption" style={{ textAlign: 'center' }}>{sound.cue}</Muted>
        </Pressable>
      )}
    </Screen>
    {infoOpen && (
      <FloatingInfo kicker={`${info.ipa} · SOUND CARD`} title={info.how} icon="🔈" calm={s.settings.calm} onClose={() => setInfoOpen(false)}>
        <View style={{ gap: 2 }}><InfoLabel>WHEN</InfoLabel><Muted k="caption">Most children have this sound {info.usual}.</Muted></View>
        <View style={{ gap: 2 }}><InfoLabel>LISTENING GAME</InfoLabel><Muted k="caption">Do “{info.pair[0]}” and “{info.pair[1]}” sound the same?</Muted></View>
        <View style={{ gap: 2 }}><InfoLabel>{BANDS[band].label.toUpperCase()}</InfoLabel><Muted k="caption">{BANDS[band].wordLevel}</Muted></View>
      </FloatingInfo>
    )}
    </View>
  );
}
