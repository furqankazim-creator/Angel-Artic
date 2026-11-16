import { ladder, levelMeta } from '../data/levels';
import { bandFor } from '../data/curriculum';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Button, Card, Muted, Pill, Row, Screen, T } from '../ui';
import { SOUNDS, soundById } from '../data/sounds';
import { masteryFor } from '../lib/mastery';
import { daysAgo } from '../lib/date';
import { playUri } from '../audio';
import { useStore } from '../store';
import { useNav } from '../nav';
import { colors, soft } from '../theme';
import { withPin } from './PinGate';

function Hub() {
  const { profile, s } = useStore();
  const { go, logout } = useNav();
  const [openSound, setOpenSound] = useState<string | null>(null);
  const [showLog, setShowLog] = useState(false);
  if (!profile) return null;
  const att = profile.attempts;
  const scored = att.filter((a) => a.status === 'scored');
  const noSound = att.filter((a) => a.status !== 'scored');
  const acc = scored.length ? Math.round(scored.reduce((n, a) => n + a.score, 0) / scored.length) : 0;
  const days = Array.from({ length: 14 }, (_, i) => daysAgo(13 - i));
  const perDay = days.map((d) => {
    const x = scored.filter((a) => a.day === d);
    return x.length ? x.reduce((n, a) => n + a.score, 0) / x.length : 0;
  });
  const practised = SOUNDS.filter((x) => att.some((a) => a.soundId === x.id));

  return (
    <Screen>
      <T k="title">Parent Hub</T>
      <Muted>{profile.name} · Practice scores, not a diagnosis.</Muted>
      <Row style={{ flexWrap: 'wrap' }}>
        <Pill label={`${scored.length} scored tries`} color="violet" />
        <Pill label={`${acc}% average`} color="green" />
        <Pill label={`${noSound.length} no sound heard`} color="coral" />
      </Row>

      <Card>
        <T k="heading">Accuracy, last 14 days</T>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 4, marginTop: 10 }}>
          {perDay.map((v, i) => <View key={i} style={{ flex: 1, height: Math.max(4, v), backgroundColor: v >= 80 ? colors.green : v > 0 ? colors.sky : colors.border, borderRadius: 4 }} />)}
        </View>
      </Card>

      <T k="heading">Mastery per sound</T>
      {practised.length === 0 && <Muted>No tries yet.</Muted>}
      {practised.map((x) => {
        const m = masteryFor(att, x.id);
        return (
          <Pressable key={x.id} accessibilityRole="button" accessibilityLabel={`${x.label} details`} onPress={() => setOpenSound(openSound === x.id ? null : x.id)}>
            <Card accent={x.accent}>
              <Row><T k="heading" style={{ width: 60 }}>{x.label}</T><T k="bodyBold" style={{ flex: 1 }}>{m.level}</T><Muted>{m.n} tries · {m.avg}%</Muted><T color={colors.muted}>{openSound === x.id ? '▴' : '▾'}</T></Row>
              {openSound === x.id && (
                <View style={{ gap: 6, marginTop: 6 }}>
                  {ladder(att, x.id, bandFor(profile.age)).map((st) => (
                    <Row key={st.level} style={{ justifyContent: 'space-between' }}>
                      <T k="bodyBold">{levelMeta(st.level).icon} {levelMeta(st.level).label}</T>
                      <Muted k="caption">{st.state === 'done' ? `✅ done · ${st.avg}%` : st.state === 'next' ? `▶ next${st.tries ? ` · ${st.tries} tries` : ''}` : st.tries ? `${st.tries} tries · ${st.avg}%` : 'not started'}</Muted>
                    </Row>
                  ))}
                </View>
              )}
            </Card>
          </Pressable>
        );
      })}

      <Button label={showLog ? 'Hide attempt log' : `Show attempt log (${att.length})`} onPress={() => setShowLog((v) => !v)} outline color="violet" />
      {showLog && [...att].reverse().slice(0, 30).map((a) => (
        <Card key={a.id} accent={a.status === 'scored' ? (a.score >= 80 ? 'green' : undefined) : 'coral'}>
          <Row>
            <View style={{ flex: 1 }}>
              <T k="bodyBold">{a.word} <Muted k="caption">{soundById(a.soundId).label}</Muted></T>
              <Muted k="caption">
                {new Date(a.ts).toLocaleString()} · {a.status === 'scored'
                  ? `${a.score}/100 · ${a.source === 'parent' ? 'parent-scored' : a.source === 'azure' ? 'pronunciation score' : 'practice score'}`
                  : `No sound heard (${a.status.replace('_', ' ')}) · ${(a.durationMs / 1000).toFixed(1)}s · peak ${a.peakDb} dB`}
              </Muted>
            </View>
            {a.uri && <Button small label="▶" onPress={() => playUri(a.uri!)} color="sky" />}
          </Row>
        </Card>
      ))}

      <Card accent="violet">
        <T k="heading">💬 Does your child need a voice today?</T>
        <Muted>Meet Angel Talk: tap pictures and the app speaks. English and Arabic voices, made by the same team.</Muted>
        <Button label="Learn about Angel Talk" onPress={() => go('AngelTalk')} style={{ marginTop: 8 }} />
      </Card>

      <Card accent="sunny">
        <Row style={{ alignItems: 'center', gap: 10 }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: soft.sunny, alignItems: 'center', justifyContent: 'center' }}>
            <T style={{ fontSize: 24 }}>🌟</T>
          </View>
          <View style={{ flex: 1 }}>
            <T k="heading" style={{ fontSize: 17 }}>Hope Bridge Digital</T>
            <Muted k="caption">Our apps portfolio & clinical mission</Muted>
          </View>
        </Row>
        <T color={colors.ink} style={{ fontSize: 14, lineHeight: 20 }}>
          Developing child-safe, evidence-based assistive technology for speech development, non-verbal communication, and neurodivergent learners.
        </T>
        <Button label="About Hope Bridge Digital ›" color="coral" onPress={() => go('HopeBridge')} style={{ marginTop: 4 }} />
      </Card>

      <T k="heading">Tools</T>
      <Button label="📚 Custom Words" onPress={() => go('CustomWords')} color="teal" />
      <Button label="🎧 Compare recordings" onPress={() => go('Compare')} color="violet" />
      <Button label="📈 Weekly Report" onPress={() => go('WeeklyReport')} color="sky" />
      <Button label="⚙️ Settings" onPress={() => go('Settings')} outline />
      <Button label="Privacy & Terms" onPress={() => go('Legal')} outline />
      <Button label="🔒 Log out" onPress={() => logout()} color="violet" />
    </Screen>
  );
}
export default withPin(Hub, 'Parents');
