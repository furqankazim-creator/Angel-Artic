import React from 'react';
import { Linking, View } from 'react-native';
import { Button, Muted, Pill, Row, Screen, T } from '../ui';
import { HOPE_BRIDGE } from '../data/hopeBridge';
import { colors, soft } from '../theme';

export function HopeBridgePromo() {
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

    </Screen>
  );
}
