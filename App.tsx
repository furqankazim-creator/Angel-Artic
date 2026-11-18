import React from 'react';
import { AccessibilityInfo, ActivityIndicator, Animated, Image, Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { isRtl } from './src/i18n';
import { useFonts } from 'expo-font';
import { ErrorBoundary, installGlobalHandler } from './src/crash';
import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import WorldQuest from './src/screens/WorldQuest';
import Compare from './src/screens/Compare';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store';
import { NavProvider, Tab, useNav } from './src/nav';
import { T } from './src/ui';
import { colors, soft } from './src/theme';
import Onboarding from './src/screens/Onboarding';
import MicCheck from './src/screens/MicCheck';
import Home from './src/screens/Home';
import Practice from './src/screens/Practice';
import Record from './src/screens/Record';
import Feedback from './src/screens/Feedback';
import DailyChallenge from './src/screens/DailyChallenge';
import Rewards from './src/screens/Rewards';
import Talk from './src/screens/Talk';
import ParentHub from './src/screens/ParentHub';
import { AngelTalkPromo } from './src/screens/AngelTalkPromo';
import { HopeBridgePromo } from './src/screens/HopeBridgePromo';
import { CustomWords, WeeklyReport } from './src/screens/ProScreens';
import Profile from './src/screens/Profile';
import Settings from './src/screens/Settings';
import Legal from './src/screens/Legal';
import Welcome from './src/screens/Welcome';
import { AngelArticLogo } from './src/art/AngelArticLogo';

const SCREENS: Record<string, React.ComponentType<any>> = {
  MicCheck, Profile, WorldQuest, Compare, Record, Feedback, DailyChallenge, Rewards, CustomWords, WeeklyReport, Settings, Legal, AngelTalk: AngelTalkPromo, HopeBridge: HopeBridgePromo,
};
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'Home', label: 'Sounds', icon: '🏠' },
  { key: 'Practice', label: 'Practice', icon: '🃏' },
  { key: 'Play', label: 'Play', icon: '📗' },
  { key: 'Talk', label: 'Talk', icon: '💬' },
  { key: 'Parents', label: 'Parents', icon: '📊' },
];

function PublisherTicker() {
  const { go } = useNav();
  const { s } = useStore();
  const { width } = useWindowDimensions();
  const [contentWidth, setContentWidth] = React.useState(0);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const translateX = React.useRef(new Animated.Value(0)).current;
  const message = 'HOPE BRIDGE DIGITAL  ·  Every child deserves tools that help them thrive.  ·  ';
  const copyCount = Math.max(2, Math.ceil(width / (contentWidth || 260)) + 2);

  React.useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    if (reduceMotion || contentWidth === 0) return;
    const start = isRtl(s.settings.lang) ? -contentWidth : 0;
    const end = isRtl(s.settings.lang) ? 0 : -contentWidth;
    translateX.setValue(start);
    const animation = Animated.loop(Animated.timing(translateX, {
      toValue: end,
      duration: Math.max(10000, contentWidth * 40),
      useNativeDriver: Platform.OS !== 'web',
    }));
    animation.start();
    return () => animation.stop();
  }, [contentWidth, reduceMotion, s.settings.lang, translateX]);

  return (
    <Pressable
      onPress={() => go('HopeBridge')}
      accessibilityRole="button"
      accessibilityLabel="Hope Bridge Digital. Every child deserves tools that help them thrive. Learn more."
      accessibilityHint="Opens the Hope Bridge Digital publisher page."
      style={{
        minHeight: 34,
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
        backgroundColor: colors.sunny,
      }}
    >
      {reduceMotion ? (
        <Text numberOfLines={2} style={{ paddingHorizontal: 12, textAlign: 'center', fontSize: 11, lineHeight: 15, fontFamily: 'Nunito_700Bold', color: colors.ink }}>
          Hope Bridge Digital · Every child deserves tools that help them thrive.
        </Text>
      ) : (
        <Animated.View style={{ flexDirection: 'row', direction: 'ltr', transform: [{ translateX }] }}>
          {Array.from({ length: copyCount }, (_, index) => (
            <Text
              key={index}
              onLayout={index === 0 ? (event) => setContentWidth(event.nativeEvent.layout.width) : undefined}
              numberOfLines={1}
              accessible={false}
              style={{ flexShrink: 0, paddingHorizontal: 12, fontSize: 11, lineHeight: 15, fontFamily: 'Nunito_700Bold', color: colors.ink }}
            >
              {message}
            </Text>
          ))}
        </Animated.View>
      )}
    </Pressable>
  );
}

function Header() {
  const { profile, derived } = useStore();
  const { go } = useNav();
  const narrow = useWindowDimensions().width < 375;

  const statBadge = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 11,
    height: 33,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: colors.coral,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        zIndex: 10,
      }}
    >
      <PublisherTicker />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 12,
          width: '100%',
          maxWidth: 1040,
          alignSelf: 'center',
        }}
      >
        <Pressable
          onPress={() => profile && go('Profile')}
          accessibilityRole="button"
          accessibilityLabel="Angel Artic logo, open profile"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 }}
        >
          <AngelArticLogo size={46} borderRadius={14} />
          <View style={{ justifyContent: 'center', flexShrink: 1 }}>
            <T
              k="heading"
              numberOfLines={1}
              color={colors.white}
              style={{
                fontSize: 21,
                lineHeight: 25,
                fontFamily: 'Baloo2_800ExtraBold',
                letterSpacing: 0.2,
                textShadowColor: 'rgba(0, 0, 0, 0.15)',
                textShadowOffset: { width: 0, height: 1.5 },
                textShadowRadius: 3,
              }}
            >
              Angel Artic
            </T>
            {!narrow && (
              <T
                k="caption"
                numberOfLines={1}
                color="rgba(255, 255, 255, 0.95)"
                style={{
                  letterSpacing: 1.3,
                  fontSize: 10,
                  fontFamily: 'Nunito_800ExtraBold',
                  textShadowColor: 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                SPEAK • PLAY • SHINE
              </T>
            )}
          </View>
        </Pressable>

        {profile && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={() => go('DailyChallenge')}
              accessibilityRole="button"
              accessibilityLabel={`Streak: ${profile.streak} days. Tap to open Daily Challenge.`}
              style={statBadge}
            >
              <Text style={{ fontSize: 13 }}>🔥</Text>
              <T
                k="caption"
                color={colors.coral}
                style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12.5 }}
              >
                {profile.streak}{narrow ? 'd' : ` day${profile.streak === 1 ? '' : 's'}`}
              </T>
            </Pressable>

            <Pressable
              onPress={() => go('Rewards')}
              accessibilityRole="button"
              accessibilityLabel={`Stars: ${derived.stars}. Tap to open Rewards.`}
              style={statBadge}
            >
              <Text style={{ fontSize: 13 }}>⭐</Text>
              <T
                k="caption"
                color="#D98200"
                style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12.5 }}
              >
                {derived.stars}
              </T>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function Root() {
  const { s, profile } = useStore();
  const { tab, stack, switchTab, practiceSound, welcome } = useNav();
  if (!s.ready) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}><ActivityIndicator color={colors.violet} size="large" /></View>;
  const top = stack[stack.length - 1];
  const body = !s.onboarded && !top ? <Onboarding />
    : top ? React.createElement(SCREENS[top.name], { key: stack.length, params: top.params })
    : tab === 'Home' ? <Home />
    : tab === 'Practice' ? <Practice key={practiceSound} params={{ soundId: practiceSound }} />
    : tab === 'Play' ? <Rewards />
    : tab === 'Talk' ? <Talk />
    : <ParentHub />;
  if (welcome && s.onboarded && !top) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, width: '100%' }}>
        <Header />
        <View style={{ flex: 1, width: '100%', maxWidth: 1040, alignSelf: 'center' }}>
          <Welcome />
        </View>
      </View>
    );
  }
  const showTabs = s.onboarded;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, direction: isRtl(s.settings.lang) ? 'rtl' : 'ltr', width: '100%' }}>
      <Header />
      <View style={{ flex: 1, width: '100%' }}>{body}</View>
      {showTabs && (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, width: '100%' }}>
          <View style={{ flexDirection: 'row', paddingTop: 4, paddingBottom: 3, paddingHorizontal: 8, gap: 4, width: '100%', maxWidth: 1040, alignSelf: 'center' }}>
            {TABS.map((t) => (
              <Pressable
                key={t.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === t.key && !top }}
                onPress={() => switchTab(t.key)}
                style={{
                  flex: 1,
                  minHeight: 48,
                  height: 48,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  paddingHorizontal: 2,
                  backgroundColor: tab === t.key && !top ? soft.coral : 'transparent',
                  borderWidth: 1,
                  borderColor: tab === t.key && !top ? '#FFC5C5' : 'transparent',
                }}
              >
                <T style={{ fontSize: 18, lineHeight: 20 }}>{t.icon}</T>
                <T
                  k="caption"
                  numberOfLines={1}
                  color={tab === t.key && !top ? colors.coral : colors.muted}
                  style={{ fontSize: 10, lineHeight: 12, fontFamily: tab === t.key && !top ? 'Nunito_800ExtraBold' : 'Nunito_700Bold' }}
                >
                  {t.label}
                </T>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

installGlobalHandler();

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'angel-artic-custom-scrollbars';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #FFF9F2;
      }
      button, [role="button"], [role="tab"], [role="checkbox"] {
        cursor: pointer !important;
        user-select: none;
      }
      /* Modern, sleek custom scrollbars */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(140, 130, 160, 0.28);
        border-radius: 999px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(140, 130, 160, 0.55);
      }
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(140, 130, 160, 0.28) transparent;
      }
    `;
    document.head.appendChild(style);
  }
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Cairo_400Regular, Cairo_700Bold, Baloo2_700Bold, Baloo2_800ExtraBold, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });
  // Never sit on a blank screen: if fonts fail or take too long, start with the phone's own font.
  const [waited, setWaited] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setWaited(true), 4000); return () => clearTimeout(t); }, []);
  if (!fontsLoaded && !fontError && !waited) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <ActivityIndicator color={colors.violet} size="large" />
        <Text style={{ color: colors.muted, fontSize: 16 }}>Loading Angel Artic…</Text>
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavProvider>
          <StatusBar style="dark" />
          <ErrorBoundary><Root /></ErrorBoundary>
        </NavProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
