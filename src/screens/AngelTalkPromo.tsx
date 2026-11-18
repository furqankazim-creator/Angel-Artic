import React from 'react';
import { Linking, View } from 'react-native';
import { Button, Card, Muted, Pill, Row, Screen, T } from '../ui';
import { TalkMark } from '../art/TalkMark';
import { Pic } from '../art/Pic';
import { ANGEL_TALK } from '../data/promo';
import { useNav } from '../nav';
import { colors, soft } from '../theme';

export function AngelTalkPromo() {
  const { go } = useNav();
  const open = (url: string) => { Linking.openURL(url).catch(() => {}); };
  const early = () => open(`mailto:${ANGEL_TALK.email}?subject=${encodeURIComponent('Angel Talk early access')}`);
  return (
    <Screen title="Angel Talk" onBack>
      {/* Hero */}
      <View style={{
        backgroundColor: soft.violet,
        borderRadius: 28,
        padding: 20,
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
        <View style={{ position: 'absolute', right: -40, top: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(108, 92, 231, 0.08)' }} />
        <View style={{ position: 'absolute', left: -30, bottom: -50, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(108, 92, 231, 0.05)' }} />
        <Row style={{ alignItems: 'center', gap: 12 }}>
          <TalkMark size={72} />
          <View style={{ flex: 1 }}>
            <T k="caption" color={colors.violet} style={{ letterSpacing: 1.2, fontFamily: 'Nunito_800ExtraBold' }}>FROM THE MAKERS OF ANGEL ARTIC</T>
            <T k="title" color={colors.ink}>Angel Talk 💬</T>
          </View>
        </Row>
        <T k="display" color={colors.ink} style={{ fontSize: 28, lineHeight: 34 }}>{ANGEL_TALK.tagline}</T>
        <T color={colors.ink} style={{ fontSize: 16, lineHeight: 23, opacity: 0.9 }}>
          Tap pictures and the app speaks. A picture communication board (AAC) for children who need a voice right now.
        </T>
        <Row style={{ flexWrap: 'wrap', gap: 6 }}>
          <Pill label="🌍 English & Arabic" color="violet" />
          <Pill label="📴 Works offline" color="teal" />
          <Pill label="🚫 No ads" color="pink" />
        </Row>
        <Button label={ANGEL_TALK.inStores ? '⬇️ Get Angel Talk' : '✉️ Request early access'} color="sunny" onPress={() => (ANGEL_TALK.inStores ? open(ANGEL_TALK.url) : early())} style={{ marginTop: 4 }} />
      </View>

      {/* How it works */}
      <T k="heading">How it works</T>
      <View style={{ gap: 10 }}>
        {ANGEL_TALK.steps.map((st, i) => (
          <Row key={st.title} style={{ alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 20, padding: 12, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' }}><T k="heading" color={colors.white}>{String(i + 1)}</T></View>
            <View style={{ flex: 1 }}><T k="bodyBold">{st.icon} {st.title}</T><Muted k="caption">{st.text}</Muted></View>
          </Row>
        ))}
      </View>

      {/* Features */}
      <T k="heading">Everything a child needs to be heard</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {ANGEL_TALK.features.map((f) => (
          <View key={f.title} style={{ width: '48%', flexGrow: 1, backgroundColor: colors.white, borderRadius: 22, padding: 14, gap: 6, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: soft.violet, alignItems: 'center', justifyContent: 'center' }}><Pic emoji={f.icon} size={28} /></View>
            <T k="bodyBold">{f.title}</T>
            <Muted k="caption">{f.text}</Muted>
          </View>
        ))}
      </View>

      {/* Two apps, two jobs */}
      <T k="heading">Two apps, two jobs</T>
      <Row style={{ gap: 10, alignItems: 'stretch' }}>
        <View style={{ flex: 1, backgroundColor: soft.violet, borderRadius: 22, padding: 14, gap: 4 }}>
          <T k="caption" color={colors.violet} style={{ letterSpacing: 1 }}>ANGEL TALK</T>
          <T k="bodyBold">Saying it right now</T>
          <Muted k="caption">For needs, feelings and conversation, with pictures that speak.</Muted>
        </View>
        <View style={{ flex: 1, backgroundColor: soft.coral, borderRadius: 22, padding: 14, gap: 4 }}>
          <T k="caption" color={colors.coral} style={{ letterSpacing: 1 }}>ANGEL ARTIC</T>
          <T k="bodyBold">Saying it clearly</T>
          <Muted k="caption">Gentle practice for speech sounds, with progress for parents.</Muted>
        </View>
      </Row>

      {/* Audience */}
      <T k="heading">Made for</T>
      <Row style={{ flexWrap: 'wrap', gap: 8 }}>
        {ANGEL_TALK.audience.map((a) => <Pill key={a} label={a} color="teal" />)}
      </Row>

      {/* Closing call to action */}
      <View style={{ backgroundColor: soft.sunny, borderRadius: 28, padding: 18, gap: 10, alignItems: 'center' }}>
        <T k="title" style={{ textAlign: 'center' }}>{ANGEL_TALK.inStores ? 'Ready to give your child a voice?' : 'Be among the first to try it'}</T>
        <T color={colors.muted} style={{ textAlign: 'center' }}>
          {ANGEL_TALK.inStores ? 'Free to explore on the App Store and Google Play.' : 'The App Store and Google Play versions are coming soon. Tell us you are interested and we will be in touch.'}
        </T>
        {ANGEL_TALK.inStores
          ? <Button label="⬇️ Get Angel Talk" onPress={() => open(ANGEL_TALK.url)} style={{ alignSelf: 'stretch' }} />
          : <Button label="✉️ Request early access" color="coral" onPress={early} style={{ alignSelf: 'stretch' }} />}
        <Button label="🌐 See Angel Talk online" outline onPress={() => open(ANGEL_TALK.url)} style={{ alignSelf: 'stretch' }} />
      </View>

      <Card accent="sunny" style={{ gap: 8, alignItems: 'center', marginTop: 4 }}>
        <Row style={{ alignItems: 'center', gap: 8 }}>
          <T style={{ fontSize: 22 }}>🌟</T>
          <T k="bodyBold">From Hope Bridge Digital</T>
        </Row>
        <Muted k="caption" style={{ textAlign: 'center' }}>
          Angel Talk and Angel Artic are developed by Hope Bridge Digital. Discover our full assistive apps portfolio, mission, and clinical standards.
        </Muted>
        <Button small label="About Hope Bridge Digital ›" color="coral" onPress={() => go('HopeBridge')} />
      </Card>

      <Muted k="caption" style={{ textAlign: 'center' }}>The buttons open your browser or mail app. Nothing from this app is sent. Angel Talk supports communication and is not a medical device or a diagnosis.</Muted>
    </Screen>
  );
}
