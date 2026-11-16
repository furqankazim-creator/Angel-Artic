import React from 'react';
import { Linking, Pressable, View } from 'react-native';
import { Button, Card, Muted, Pill, Row, Screen, T } from '../ui';
import { HOPE_BRIDGE, HopeBridgeApp } from '../data/hopeBridge';
import { useNav } from '../nav';
import { colors, soft } from '../theme';

export function HopeBridgePromo() {
  const { go, switchTab } = useNav();
  const openUrl = (url: string) => { Linking.openURL(url).catch(() => {}); };
  const contact = () => openUrl(`mailto:${HOPE_BRIDGE.email}?subject=${encodeURIComponent('Hope Bridge Digital Inquiry')}`);

  return (
    <Screen title="Hope Bridge Digital" onBack>
      {/* Hero Header */}
      <View style={{ backgroundColor: colors.violet, borderRadius: 28, padding: 22, gap: 12, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', right: -35, top: -35, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <View style={{ position: 'absolute', left: -25, bottom: -45, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        
        <Row style={{ alignItems: 'center', gap: 12 }}>
          <View style={{ width: 62, height: 62, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 }}>
            <T style={{ fontSize: 34 }}>🌟</T>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <T k="caption" color="#DCD7FF" style={{ letterSpacing: 1.2, fontFamily: 'Nunito_800ExtraBold' }}>ABOUT THE PUBLISHER</T>
            <T k="title" color={colors.white} style={{ fontSize: 24, lineHeight: 28 }}>{HOPE_BRIDGE.name}</T>
          </View>
        </Row>

        <T k="display" color={colors.white} style={{ fontSize: 25, lineHeight: 32 }}>
          {HOPE_BRIDGE.tagline}
        </T>

        <T color="#EFEAFF" style={{ fontSize: 15.5, lineHeight: 22.5 }}>
          {HOPE_BRIDGE.mission}
        </T>

        <Row style={{ flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
          <Pill label="🛡️ 100% Private & Offline" color="sunny" />
          <Pill label="🩺 SLP Guided" color="sunny" />
          <Pill label="🚫 Zero Ads or Tracking" color="sunny" />
          <Pill label="🌍 Bilingual (EN & AR)" color="sunny" />
        </Row>

        <Row style={{ gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
          <Button
            label="🌐 Visit Official Live Portal"
            color="sunny"
            onPress={() => openUrl(HOPE_BRIDGE.portalUrl)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Button
            label="✉️ Contact Us"
            outline
            onPress={contact}
            style={{ borderColor: 'rgba(255,255,255,0.5)', minWidth: 120 }}
          />
        </Row>
      </View>

      {/* What We Do & Pillars */}
      <View style={{ gap: 8, marginTop: 4 }}>
        <T k="heading">What We Do & Our Core Philosophy</T>
        <T color={colors.muted} style={{ fontSize: 15, lineHeight: 21 }}>
          We design assistive tools where <T style={{ fontStyle: 'italic', fontFamily: 'Nunito_700Bold' }}>silence never earns a score, and a child never loses progress.</T> Every experience is built for family comfort, clinical accuracy, and sensory well-being.
        </T>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {HOPE_BRIDGE.pillars.map((p) => (
          <View key={p.title} style={{ width: '48%', flexGrow: 1, backgroundColor: colors.white, borderRadius: 20, padding: 14, gap: 6, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: soft.violet, alignItems: 'center', justifyContent: 'center' }}>
              <T style={{ fontSize: 22 }}>{p.icon}</T>
            </View>
            <T k="bodyBold" style={{ fontSize: 16 }}>{p.title}</T>
            <Muted k="caption" style={{ lineHeight: 18 }}>{p.desc}</Muted>
          </View>
        ))}
      </View>

      {/* Complete Apps Portfolio */}
      <View style={{ gap: 4, marginTop: 8 }}>
        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <T k="heading">Our Apps Portfolio</T>
          <Pill label={`${HOPE_BRIDGE.apps.length} Dedicated Apps`} color="teal" />
        </Row>
        <T color={colors.muted} style={{ fontSize: 15 }}>
          Explore our suite of specialized apps designed to support speech development, communication, learning, and care team collaboration.
        </T>
      </View>

      <View style={{ gap: 14 }}>
        {HOPE_BRIDGE.apps.map((app: HopeBridgeApp) => (
          <Card key={app.id} accent={app.badgeColor} style={{ padding: 16, gap: 10 }}>
            <Row style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <Row style={{ alignItems: 'center', gap: 10, flex: 1 }}>
                <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: soft[app.badgeColor], alignItems: 'center', justifyContent: 'center' }}>
                  <T style={{ fontSize: 26 }}>{app.icon}</T>
                </View>
                <View style={{ flex: 1 }}>
                  <T k="heading" style={{ fontSize: 18 }}>{app.name}</T>
                  <T k="caption" color={colors[app.badgeColor]} style={{ fontFamily: 'Nunito_700Bold' }}>{app.category}</T>
                </View>
              </Row>
              <Pill label={app.badge} color={app.badgeColor} />
            </Row>

            <T k="bodyBold" style={{ fontStyle: 'italic', color: colors.ink }}>
              "{app.tagline}"
            </T>

            <T color={colors.ink} style={{ fontSize: 14.5, lineHeight: 21 }}>
              {app.description}
            </T>

            {/* Highlights bullet points */}
            <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: 12, gap: 5, borderWidth: 1, borderColor: colors.border }}>
              <T k="caption" color={colors.muted} style={{ fontFamily: 'Nunito_800ExtraBold', letterSpacing: 0.6 }}>KEY FEATURES & INNOVATIONS</T>
              {app.highlights.map((h, i) => (
                <Row key={i} style={{ alignItems: 'flex-start', gap: 6 }}>
                  <T color={colors[app.badgeColor]} style={{ fontSize: 13, lineHeight: 18 }}>•</T>
                  <T k="caption" color={colors.ink} style={{ flex: 1, lineHeight: 18 }}>{h}</T>
                </Row>
              ))}
            </View>

            {/* Curriculum tags if present */}
            {app.curriculum && (
              <Row style={{ flexWrap: 'wrap', gap: 6 }}>
                {app.curriculum.map((c) => (
                  <Pill key={c} label={c} color="pink" />
                ))}
              </Row>
            )}

            {/* Workflow steps if present */}
            {app.workflow && (
              <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: 12, gap: 8, borderWidth: 1, borderColor: colors.border }}>
                <T k="caption" color={colors[app.badgeColor]} style={{ fontFamily: 'Nunito_800ExtraBold', letterSpacing: 0.6 }}>
                  {app.workflowTitle ?? 'LEARNING WORKFLOW'}
                </T>
                <View style={{ gap: 6 }}>
                  {app.workflow.map((w) => (
                    <Row key={w.step} style={{ alignItems: 'flex-start', gap: 8 }}>
                      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors[app.badgeColor], alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                        <T k="caption" color={colors.white} style={{ fontSize: 11, fontFamily: 'Nunito_800ExtraBold' }}>{w.step}</T>
                      </View>
                      <View style={{ flex: 1, gap: 1 }}>
                        <T k="caption" style={{ fontFamily: 'Nunito_700Bold', color: colors.ink }}>{w.title}</T>
                        <Muted k="caption" style={{ lineHeight: 16 }}>{w.desc}</Muted>
                      </View>
                    </Row>
                  ))}
                </View>
              </View>
            )}

            <Row style={{ alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <T k="caption" color={colors.muted}>Made for:</T>
              <T k="caption" style={{ fontFamily: 'Nunito_700Bold' }}>{app.audience}</T>
            </Row>

            {/* App Action Buttons */}
            <Row style={{ gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              {app.id === 'angel-artic' && (
                <Button small label="▶ Explore Speech Sounds" color="coral" onPress={() => switchTab('Home')} style={{ flex: 1 }} />
              )}
              {app.id === 'angel-talk' && (
                <Button small label="💬 Open Angel Talk AAC" color="violet" onPress={() => go('AngelTalk')} style={{ flex: 1 }} />
              )}
              <Button
                small
                label="🌐 View on Live Site ↗"
                outline
                onPress={() => openUrl(app.url)}
                style={{ flex: app.id !== 'angel-artic' && app.id !== 'angel-talk' ? 1 : undefined }}
              />
            </Row>
          </Card>
        ))}
      </View>

      {/* Child Safety & Privacy Standards */}
      <View style={{ gap: 8, marginTop: 8 }}>
        <T k="heading">Child Safety, Privacy & Clinical Standards 🛡️</T>
        <View style={{ backgroundColor: colors.white, borderRadius: 22, padding: 16, gap: 12, borderWidth: 1, borderColor: colors.border }}>
          {HOPE_BRIDGE.standards.map((st) => (
            <Row key={st.title} style={{ alignItems: 'flex-start', gap: 10 }}>
              <T style={{ fontSize: 18, marginTop: 2 }}>✅</T>
              <View style={{ flex: 1 }}>
                <T k="bodyBold" style={{ fontSize: 15 }}>{st.title}</T>
                <Muted k="caption" style={{ lineHeight: 18 }}>{st.desc}</Muted>
              </View>
            </Row>
          ))}
        </View>
      </View>

      {/* Closing Call to Action */}
      <View style={{ backgroundColor: soft.sunny, borderRadius: 28, padding: 20, gap: 12, alignItems: 'center', marginTop: 4 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
          <T style={{ fontSize: 28 }}>🌟</T>
        </View>
        <T k="title" style={{ textAlign: 'center', fontSize: 22 }}>
          Empowering Every Child's Unique Voice
        </T>
        <T color={colors.muted} style={{ textAlign: 'center', fontSize: 15, lineHeight: 21 }}>
          Hope Bridge Digital creates compassionate, evidence-based assistive technology. Visit our live portal to discover new releases, clinical updates, and partnership opportunities.
        </T>
        <Button
          label="🌐 Open hopebirdgedigital.site"
          color="coral"
          onPress={() => openUrl(HOPE_BRIDGE.portalUrl)}
          style={{ alignSelf: 'stretch' }}
        />
        <Button
          label="✉️ Contact Publisher (hello@hopebridgedigital.com)"
          outline
          onPress={contact}
          style={{ alignSelf: 'stretch' }}
        />
      </View>

      <Muted k="caption" style={{ textAlign: 'center', marginTop: 4 }}>
        Hope Bridge Digital apps support speech development and communication. They are not medical diagnostic devices.
      </Muted>
    </Screen>
  );
}
