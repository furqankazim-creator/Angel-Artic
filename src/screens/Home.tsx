import React from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Button, Card, Muted, Pill, Ring, Row, Screen, T } from '../ui';
import { colors, soft } from '../theme';
import { GROUPS, SOUNDS } from '../data/sounds';
import { useStore } from '../store';
import { useNav } from '../nav';
import { tr } from '../i18n';
import { Pic } from '../art/Pic';
import { WordPic } from '../art/WordPic';
import { playUri } from '../audio';
import { MascotBubble } from '../art/Mascot';
import { AngelTalkBanner, FloatingInfo, HopeBridgeBanner, InfoLabel, POPUP_MS } from '../components';
import { BANDS, bandFor } from '../data/curriculum';
import { ladder, levelMeta, SOUND_ANCHORS } from '../data/levels';
import { soundById } from '../data/sounds';

/** Profiles whose age plan popup was already shown this session, so switching tabs does not bring it back. */
const shownFor = new Set<string>();

function Chips({ ids, faded }: { ids: string[]; faded?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {ids.map((id) => {
        const snd = soundById(id);
        return (
          <View key={id} style={{ backgroundColor: faded ? colors.white : soft[snd.accent], borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1.5, borderColor: faded ? colors.border : soft[snd.accent], opacity: faded ? 0.85 : 1 }}>
            <T k="caption" color={colors.ink}>{snd.label}</T>
          </View>
        );
      })}
    </View>
  );
}

function AgePlanPopup({ band, calm, onClose }: { band: (typeof BANDS)['5-6']; calm: boolean; onClose: () => void }) {
  return (
    <FloatingInfo kicker="YOUR AGE PLAN" title={band.label} calm={calm} onClose={onClose}>
      <Muted k="caption">{band.goal}</Muted>
      <View style={{ gap: 2 }}><InfoLabel>WORDS</InfoLabel><Muted k="caption">{band.wordLevel}</Muted></View>
      <View style={{ gap: 2 }}><InfoLabel>SENTENCES</InfoLabel><Muted k="caption">{band.sentenceLevel}</Muted></View>
      <View style={{ gap: 4 }}><InfoLabel>FOCUS SOUNDS</InfoLabel><Chips ids={band.focus} /></View>
      {band.emerging.length > 0 && <View style={{ gap: 4 }}><InfoLabel color={colors.muted}>STILL DEVELOPING</InfoLabel><Chips ids={band.emerging} faded /></View>}
    </FloatingInfo>
  );
}

export default function Home() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;
  const isTablet = width >= 580 && width < 860;
  const narrow = width < 360;
  const { s, profile, derived, allSounds } = useStore();
  const { go, openSound, switchTab } = useNav();
  const [popup, setPopup] = React.useState(() => !!profile && !shownFor.has(profile.id));
  React.useEffect(() => {
    if (!profile || !popup) return;
    shownFor.add(profile.id);
    const t = setTimeout(() => setPopup(false), POPUP_MS); // closes itself after 10 seconds
    return () => clearTimeout(t);
  }, [popup, profile?.id]);
  if (!profile) return null;
  const band = BANDS[bandFor(profile?.age ?? 5)];
  const last = [...profile.attempts].reverse().find((a) => a.status === 'scored');
  const lastSound = last ? soundById(last.soundId) : undefined;
  const lastNext = lastSound ? ladder(profile.attempts, lastSound.id, bandFor(profile.age)).find((x) => x.state === 'next') : undefined;
  const goalDone = Math.round(derived.goalProgress * profile.dailyGoal);
  const customWords = s.custom.filter((c) => c.profileId === profile.id);

  return (
    <View style={{ flex: 1 }}>
    <Screen>
      <Row style={{ alignItems: 'flex-end' }}>
        <View style={{ flex: 1 }}><MascotBubble text={tr(s.settings.lang, "Hi {name}! Pick a sound and let's practise!", { name: profile.name })} mood="happy" size={narrow ? 60 : 92} /></View>
        <Ring progress={derived.goalProgress} label={`${goalDone}/${profile.dailyGoal}`} size={72} />
      </Row>
      <Row style={{ flexWrap: 'wrap', gap: 6 }}>
        <Pill label={`⭐ ${derived.stars}`} color="sunny" />
        <Pill label={`✨ ${derived.xp} XP`} color="sunny" />
        <Pill label={`🔥 ${profile.streak} day${profile.streak === 1 ? '' : 's'}`} color="coral" />
        <Pressable accessibilityRole="button" accessibilityLabel="Show the age plan" onPress={() => setPopup(true)} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Pill label="ℹ️ Plan" color="violet" />
        </Pressable>
      </Row>
      {lastSound && <Button label={`▶ Continue ${lastSound.label}${lastNext ? ` · ${levelMeta(lastNext.level).label}` : ''}`} onPress={() => openSound(lastSound.id)} color="coral" />}
      <Row style={{ gap: 12 }}>
        <Button label="📅 Daily" onPress={() => go('DailyChallenge')} color="pink" style={{ flex: 1 }} />
        <Button label="🎮 Play" onPress={() => switchTab('Play')} color="teal" style={{ flex: 1 }} />
      </Row>

      {/* Custom Words Section on Main Page */}
      <View style={{ gap: 8, marginTop: 4 }}>
        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <T k="heading">My Words ⭐</T>
          <Pressable accessibilityRole="button" accessibilityLabel="Add custom words" onPress={() => go('CustomWords')} style={{ paddingVertical: 4, paddingHorizontal: 8 }}>
            <T k="caption" color={colors.teal} style={{ fontFamily: 'Nunito_700Bold' }}>{customWords.length > 0 ? '+ Add More' : '+ Add Word'}</T>
          </Pressable>
        </Row>
        {customWords.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
            {customWords.map((c) => (
              <Card
                key={c.id}
                accent="teal"
                style={{ width: 145, minHeight: 140, padding: 12, alignItems: 'center', justifyContent: 'space-between', gap: 6 }}
                onPress={() => (s.micChecked ? go('Record', { wordId: c.id, mode: 'custom' }) : go('MicCheck'))}
              >
                <WordPic w={c} size={56} />
                <T k="bodyBold" numberOfLines={1} style={{ textAlign: 'center' }}>{c.word}</T>
                <Row style={{ alignItems: 'center', gap: 6 }}>
                  <Pill label={`/${c.soundId}/`} color="teal" />
                  {c.voiceUri && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Play voice for ${c.word}`}
                      onPress={(e: any) => {
                        e?.stopPropagation?.();
                        playUri(c.voiceUri!);
                      }}
                      style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                    >
                      <T style={{ fontSize: 13 }}>🔊</T>
                    </Pressable>
                  )}
                </Row>
              </Card>
            ))}
          </ScrollView>
        ) : (
          <Card accent="teal" onPress={() => go('CustomWords')}>
            <Row style={{ alignItems: 'center', gap: 12 }}>
              <T style={{ fontSize: 32 }}>📷</T>
              <View style={{ flex: 1, gap: 2 }}>
                <T k="bodyBold" color={colors.teal}>Add Family Words & Photos</T>
                <Muted k="caption">Add pets, family names, or favorite toys with your own photo and voice!</Muted>
              </View>
              <T k="title" color={colors.teal}>›</T>
            </Row>
          </Card>
        )}
      </View>

      {/* Target Focus Sounds Section */}
      {profile.targetSounds.length > 0 && (
        <View style={{ gap: 10 }}>
          <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <T k="heading">🎯 My Focus Sounds</T>
            <Pill label={`${profile.targetSounds.length} Active`} color="teal" />
          </Row>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {profile.targetSounds.map((sid) => {
              const snd = soundById(sid, s.customSounds);
              if (!snd) return null;
              return (
                <Pressable
                  key={`focus-${snd.id}`}
                  accessibilityLabel={`Sound ${snd.label}`}
                  onPress={() => openSound(snd.id)}
                  style={{
                    width: isDesktop ? '18.4%' : isTablet ? '23.4%' : narrow ? '47.5%' : '30.8%',
                    minHeight: 122,
                    borderRadius: 22,
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    backgroundColor: soft[snd.accent],
                    borderWidth: 3,
                    borderColor: colors[snd.accent],
                    shadowColor: colors[snd.accent],
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <Pic emoji={snd.emoji} size={56} name={SOUND_ANCHORS[snd.id]} />
                  <T k="heading">{snd.label}</T>
                  <T k="caption" color={colors[snd.accent]}>★ Focus Sound</T>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {GROUPS.filter((g) => g !== 'Custom' || (s.customSounds && s.customSounds.length > 0)).map((g) => (
        <View key={g} style={{ gap: 10 }}>
          <T k="heading">{g === 'Custom' ? 'Custom Sounds ⭐' : g}</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {allSounds.filter((x) => x.group === g).map((snd) => {
              const isTarget = profile.targetSounds.includes(snd.id);
              const forAge = band.focus.includes(snd.id);
              return (
                <Pressable
                  key={snd.id}
                  accessibilityLabel={`Sound ${snd.label}`}
                  onPress={() => openSound(snd.id)}
                  style={{
                    width: isDesktop ? '18.4%' : isTablet ? '23.4%' : narrow ? '47.5%' : '30.8%',
                    minHeight: 122,
                    borderRadius: 22,
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    backgroundColor: soft[snd.accent],
                    borderWidth: 3,
                    borderColor: isTarget ? colors[snd.accent] : colors.border,
                  }}
                >
                  <Pic emoji={snd.emoji} size={56} name={SOUND_ANCHORS[snd.id]} />
                  <T k="heading">{snd.label}</T>
                  {forAge && <T k="caption" color={colors[snd.accent]}>★ for age</T>}
                  {snd.group === 'Custom' && <T k="caption" color={colors[snd.accent]}>Custom</T>}
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
      <View style={{ gap: 12, marginTop: 8 }}>
        <T k="heading">Communication & Apps 💬</T>
        <AngelTalkBanner />
        <HopeBridgeBanner />
      </View>
    </Screen>
    {popup && <AgePlanPopup band={band} calm={s.settings.calm} onClose={() => setPopup(false)} />}
    </View>
  );
}
