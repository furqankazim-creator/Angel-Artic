import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Button, Muted, Row, T } from '../ui';
import { useSpeak } from '../audio';
import { useNav } from '../nav';
import { Pic } from '../art/Pic';
import { TalkMark } from '../art/TalkMark';
import { FloatingInfo } from '../components';
import { ANGEL_TALK } from '../data/promo';
import { useStore } from '../store';
import { colors, layout, soft } from '../theme';
import { BOARDS } from '../data/talkBoards';

const LOCKED = ['School', 'Animals', 'Transport', 'Clothes'];
const PERKS: [string, string][] = [['🖼️', 'About 14,800 symbols'], ['📷', 'Your own photos'], ['🌍', 'English & Arabic voices'], ['🎙️', 'Voice Add']];

let nudgeShown = false; // the gentle "see Angel Talk" nudge appears once per app launch

export default function Talk() {
  const speak = useSpeak();
  const { go } = useNav();
  const { s } = useStore();
  const [sentence, setSentence] = useState<[string, string][]>([]);
  const [board, setBoard] = useState(BOARDS[0].name);
  const [spoken, setSpoken] = useState(0);
  const [nudge, setNudge] = useState(false);
  const sentenceScrollRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (sentence.length > 0) {
      setTimeout(() => {
        sentenceScrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [sentence.length]);

  const words = BOARDS.find((b) => b.name === board)!.words;
  const text = sentence.map((x) => x[0]).join(' ');

  const say = () => {
    if (!sentence.length) return;
    speak(text);
    const n = spoken + 1;
    setSpoken(n);
    if (n === 3 && !nudgeShown) { nudgeShown = true; setNudge(true); }
  };
  const early = () => { Linking.openURL(`mailto:${ANGEL_TALK.email}?subject=${encodeURIComponent('Angel Talk early access')}`).catch(() => {}); };

  const accent = BOARDS.find((b) => b.name === board)!.accent;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView stickyHeaderIndices={[1]} contentContainerStyle={{ padding: layout.pad, paddingBottom: 40, gap: 12, width: '100%', maxWidth: 640, alignSelf: 'center' }}>
        <View style={{ gap: 4 }}>
          <T k="title">Angel Talk 💬</T>
          <T color={colors.muted} style={{ fontSize: 16 }}>
            Tap pictures to build a sentence, then tap the speaker. Angel Talk is for <T style={{ fontStyle: 'italic', fontFamily: 'Nunito_700Bold' }}>saying it</T> — Angel Artic is for <T style={{ fontStyle: 'italic', fontFamily: 'Nunito_700Bold' }}>saying it clearly.</T>
          </T>
        </View>

        {/* Stays at the top while the board scrolls */}
        <View style={{ backgroundColor: colors.bg, paddingTop: 6, paddingBottom: 10 }}>
          {/* The sentence */}
          <View style={{ backgroundColor: colors.white, borderRadius: 24, borderWidth: 2, borderColor: sentence.length ? colors.violet : colors.border, shadowColor: colors.violet, shadowOpacity: sentence.length ? 0.18 : 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, overflow: 'hidden', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, minHeight: 64 }}>
              <ScrollView
                ref={sentenceScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', gap: 8, paddingHorizontal: 4 }}
                style={{ flex: 1, minHeight: 48 }}
              >
                {sentence.length === 0 ? (
                  <T k="bodyBold" color={colors.muted} numberOfLines={1}>
                    👆 Tap pictures below to build a sentence
                  </T>
                ) : (
                  sentence.map(([w, e], i) => (
                    <Pressable
                      key={`${w}-${i}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${w}`}
                      onPress={() => setSentence((x) => x.filter((_, j) => j !== i))}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: pressed ? colors.white : soft.sunny,
                        borderWidth: 2,
                        borderColor: colors.sunny,
                        borderRadius: 999,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        minHeight: 44,
                      })}
                    >
                      <Pic emoji={e} size={24} name={w} />
                      <T k="bodyBold" style={{ fontSize: 16 }}>{w}</T>
                      <T color={colors.muted} style={{ fontSize: 12, marginLeft: 2 }}>✕</T>
                    </Pressable>
                  ))
                )}
              </ScrollView>
              {sentence.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear"
                  onPress={() => setSentence([])}
                  style={{ width: 42, height: 42, borderRadius: 21, marginLeft: 8, backgroundColor: soft.coral, alignItems: 'center', justifyContent: 'center' }}
                >
                  <T k="bodyBold" color={colors.coral} style={{ fontSize: 16 }}>✕</T>
                </Pressable>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Speak the sentence"
                disabled={!sentence.length}
                onPress={say}
                style={({ pressed }) => ({
                  marginLeft: 8,
                  minWidth: 50,
                  height: 50,
                  borderRadius: 25,
                  paddingHorizontal: 0,
                  backgroundColor: colors.violet,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: sentence.length ? (pressed ? 0.8 : 1) : 0.35,
                })}
              >
                <T style={{ fontSize: 26 }}>🔊</T>
              </Pressable>
            </View>
          </View>

          {/* Boards: swipe left and right with a finger */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 24 }}>
            {BOARDS.map((b) => (
              <Pressable key={b.name} accessibilityRole="button" onPress={() => setBoard(b.name)}
                style={{ minHeight: 44, borderRadius: 999, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: board === b.name ? colors[b.accent] : soft[b.accent] }}>
                <T k="caption" color={board === b.name ? (b.accent === 'sunny' || b.accent === 'green' ? colors.ink : colors.white) : colors.ink} style={{ fontFamily: 'Nunito_700Bold' }}>{b.icon} {b.name}</T>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {words.map(([w, e]) => (
            <Pressable key={w} accessibilityRole="button" accessibilityLabel={w} onPress={() => { speak(w); setSentence((x) => [...x, [w, e]]); }}
              style={({ pressed }) => ({ width: '23%', flexGrow: 1, minHeight: 86, borderRadius: 20, backgroundColor: pressed ? colors.white : soft[accent], borderWidth: 1.5, borderColor: pressed ? colors[accent] : 'transparent', alignItems: 'center', justifyContent: 'center', gap: 2 })}>
              <Pic emoji={e} size={36} name={w} />
              <T k="caption" style={{ fontFamily: 'Nunito_700Bold' }}>{w}</T>
            </Pressable>
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <T k="caption" color={colors.muted}>More boards in the full Angel Talk</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {LOCKED.map((l) => (
              <Pressable key={l} accessibilityRole="button" accessibilityLabel={`${l}, in Angel Talk`} onPress={() => go('AngelTalk')}
                style={{ minHeight: 44, borderRadius: 999, paddingHorizontal: 14, justifyContent: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.violet, backgroundColor: colors.white }}>
                <T k="caption" color={colors.violet} style={{ fontFamily: 'Nunito_700Bold' }}>🔒 {l}</T>
              </Pressable>
            ))}
          </View>
        </View>

        {/* What the full app adds */}
        <T k="heading">There is so much more in Angel Talk</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {PERKS.map(([e, t]) => (
            <Pressable key={t} accessibilityRole="button" onPress={() => go('AngelTalk')}
              style={{ width: '48%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: soft.violet, borderRadius: 18, padding: 12, minHeight: 56 }}>
              <Pic emoji={e} size={26} /><T k="caption" style={{ flex: 1, fontFamily: 'Nunito_700Bold' }}>{t}</T>
            </Pressable>
          ))}
        </View>

        {/* Call to action */}
        <View style={{
          backgroundColor: soft.violet,
          borderRadius: 28,
          padding: 18,
          gap: 12,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: '#D7D1FB',
          shadowColor: colors.violet,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 2,
        }}>
          <View style={{ position: 'absolute', right: -36, top: -36, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(108, 92, 231, 0.08)' }} />
          <Row style={{ alignItems: 'center', gap: 12 }}>
            <TalkMark size={64} />
            <View style={{ flex: 1 }}>
              <T k="heading" color={colors.ink} style={{ fontSize: 20, lineHeight: 26 }}>Give your child a bigger voice</T>
            </View>
          </Row>
          <T color={colors.ink} style={{ fontSize: 15, lineHeight: 22, opacity: 0.9 }}>
            The full Angel Talk has thousands of symbols, your own photos, voices in English and Arabic, and calm tools for every day. Works offline, with no ads.
          </T>
          <Button label={ANGEL_TALK.inStores ? '⬇️ Get Angel Talk' : '✉️ Request early access'} color="sunny" onPress={() => (ANGEL_TALK.inStores ? Linking.openURL(ANGEL_TALK.url).catch(() => {}) : early())} />
          <Button label="See what is inside ›" outline color="violet" onPress={() => go('AngelTalk')} />
        </View>
        <Muted k="caption" style={{ textAlign: 'center' }}>Angel Talk supports communication. It is not a medical device or a diagnosis.</Muted>
      </ScrollView>

      {nudge && (
        <FloatingInfo kicker="NICE SENTENCE!" title="Want your child to say more?" icon="🎉" calm={s.settings.calm} onClose={() => setNudge(false)}>
          <Muted k="caption">This is just a taste. Angel Talk has about 14,800 symbols, your own photos and English and Arabic voices.</Muted>
          <Button small label="See what is inside ›" onPress={() => { setNudge(false); go('AngelTalk'); }} />
        </FloatingInfo>
      )}
    </View>
  );
}
