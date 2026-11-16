import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Button, Card, Chip, Muted, Pill, Row, T } from '../ui';
import { Mascot } from '../art/Mascot';
import { useStore } from '../store';
import { useNav } from '../nav';
import { useSpeak } from '../audio';
import { colors, layout, soft } from '../theme';
import { soundById } from '../data/sounds';
import { BANDS, bandFor } from '../data/curriculum';

export default function Welcome() {
  const { s, profile, set, addProfile, derived } = useStore();
  const { setWelcome, switchTab, go } = useNav();
  const speak = useSpeak();

  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(6);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning! ☀️' : hour < 17 ? 'Good afternoon! 🌤️' : 'Good evening! 🌙';

  const startPractising = () => {
    setWelcome(false);
    switchTab('Home');
  };

  const startDailyChallenge = () => {
    setWelcome(false);
    switchTab('Home');
    go('DailyChallenge');
  };

  const openTalkBoard = () => {
    setWelcome(false);
    switchTab('Talk');
  };

  const openParents = () => {
    setWelcome(false);
    switchTab('Parents');
  };

  const playVoiceGreeting = () => {
    if (profile?.name) {
      speak(`Hi ${profile.name}! Let's practise sounds together!`);
    } else {
      speak("Hi! I am Angel. Let's practise sounds together!");
    }
  };

  const handleCreateChild = () => {
    const trimmed = newChildName.trim();
    if (!trimmed) {
      return Alert.alert('Enter name', 'Please enter your child\'s first name.');
    }
    const focus = BANDS[bandFor(newChildAge)].focus.slice(0, 3);
    const newId = addProfile({
      name: trimmed,
      age: newChildAge,
      targetSounds: focus,
      dailyGoal: 10,
    });
    set((st) => ({ ...st, activeId: newId }));
    setNewChildName('');
    setAddingChild(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 20, paddingBottom: 48, gap: 16, alignItems: 'center' }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Greeting & Mascot */}
      <View style={{ alignItems: 'center', gap: 8, marginTop: 4 }}>
        <T k="caption" color={colors.coral} style={{ letterSpacing: 1.5, fontSize: 13, textTransform: 'uppercase' }}>
          {greeting}
        </T>
        <T k="title" style={{ textAlign: 'center', fontSize: 28 }}>
          {profile ? `Welcome, ${profile.name}!` : 'Welcome to Angel Artic!'}
        </T>

        {/* Mascot with interactive voice prompt */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Angel Mascot, tap to hear greeting"
          onPress={playVoiceGreeting}
          style={{ alignItems: 'center', marginVertical: 6 }}
        >
          <Mascot mood="happy" size={130} />
          <View style={{
            backgroundColor: soft.coral,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1.5,
            borderColor: colors.coral,
            marginTop: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}>
            <T style={{ fontSize: 14 }}>🔊</T>
            <T k="caption" color={colors.coral}>Tap me to say hello!</T>
          </View>
        </Pressable>
      </View>

      {/* 2. Active Child Profile Card */}
      {profile && (
        <Card accent="violet" style={{ width: '100%', maxWidth: 420, gap: 12, padding: 16 }}>
          <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, gap: 2 }}>
              <T k="heading">{profile.name}</T>
              <Muted k="caption">Age {profile.age} · Ready to speak & shine!</Muted>
            </View>
            <View style={{ backgroundColor: soft.violet, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
              <T k="caption" color={colors.violet}>Active Player ⭐</T>
            </View>
          </Row>

          {/* Stats Bar */}
          <Row style={{ gap: 8, flexWrap: 'wrap' }}>
            <Pill label={`🔥 ${profile.streak} Day streak`} color="coral" />
            <Pill label={`⭐ ${derived.stars} Stars`} color="sunny" />
            <Pill label={`✨ ${derived.xp} XP`} color="teal" />
            <Pill label={`🎯 ${profile.dailyGoal}/day`} color="pink" />
          </Row>

          {/* Focus Sounds */}
          {profile.targetSounds.length > 0 && (
            <View style={{ gap: 6 }}>
              <T k="caption" color={colors.muted}>FOCUS SOUNDS</T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {profile.targetSounds.map((sid) => {
                  const snd = soundById(sid, s.customSounds);
                  return (
                    <View
                      key={sid}
                      style={{
                        backgroundColor: soft[snd.accent] ?? soft.violet,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 999,
                        borderWidth: 1.5,
                        borderColor: colors[snd.accent] ?? colors.violet,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <T style={{ fontSize: 13 }}>{snd.emoji}</T>
                      <T k="caption" color={colors.ink}>{snd.label}</T>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </Card>
      )}

      {/* 3. Multiple Children Switcher */}
      {s.profiles.length > 1 && (
        <View style={{ width: '100%', maxWidth: 420, gap: 8 }}>
          <T k="heading" style={{ fontSize: 18 }}>Who is playing?</T>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {s.profiles.map((p) => {
              const isSelected = p.id === profile?.id;
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${p.name}`}
                  onPress={() => set((st) => ({ ...st, activeId: p.id }))}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 16,
                    backgroundColor: isSelected ? soft.teal : colors.white,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.teal : colors.border,
                    alignItems: 'center',
                    gap: 2,
                    minWidth: 100,
                  }}
                >
                  <T style={{ fontSize: 24 }}>{isSelected ? '⭐' : '🧒'}</T>
                  <T k="bodyBold" color={isSelected ? colors.teal : colors.ink}>{p.name}</T>
                  <T k="caption" color={colors.muted}>Age {p.age}</T>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Add another child expandable form */}
      {addingChild ? (
        <Card accent="teal" style={{ width: '100%', maxWidth: 420, gap: 10 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <T k="bodyBold" color={colors.teal}>+ Add Child Profile</T>
            <Pressable onPress={() => setAddingChild(false)}>
              <T k="caption" color={colors.muted}>✕ Cancel</T>
            </Pressable>
          </Row>
          <TextInput
            value={newChildName}
            onChangeText={setNewChildName}
            placeholder="Child's first name (e.g. Leo)"
            placeholderTextColor={colors.muted}
            style={{
              minHeight: layout.tap,
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: colors.border,
              backgroundColor: colors.white,
              paddingHorizontal: 16,
              fontSize: 16,
              color: colors.ink,
            }}
          />
          <T k="caption" color={colors.ink}>Select age:</T>
          <Row style={{ gap: 8 }}>
            {[[4, '3–4 yrs'], [6, '5–6 yrs'], [8, '7–8 yrs']].map(([a, l]) => (
              <Chip
                key={a}
                label={l as string}
                on={newChildAge === a}
                onPress={() => setNewChildAge(a as number)}
                color="teal"
              />
            ))}
          </Row>
          <Button label="Save Child Profile" color="teal" onPress={handleCreateChild} />
        </Card>
      ) : (
        <Pressable
          onPress={() => setAddingChild(true)}
          style={{ width: '100%', maxWidth: 420, alignItems: 'center', paddingVertical: 4 }}
        >
          <T k="caption" color={colors.teal} style={{ textDecorationLine: 'underline' }}>
            + Add another child profile
          </T>
        </Pressable>
      )}

      {/* 4. Main Quick Actions */}
      <View style={{ width: '100%', maxWidth: 420, gap: 12, marginTop: 4 }}>
        {/* Play / Practise */}
        <Button
          label="▶ Start Practising"
          onPress={startPractising}
          color="coral"
          style={{ minHeight: 62, borderRadius: 20 }}
        />

        {/* Daily Challenge Card */}
        <Card accent="sunny" onPress={startDailyChallenge}>
          <Row style={{ alignItems: 'center', gap: 12 }}>
            <T style={{ fontSize: 32 }}>🎯</T>
            <View style={{ flex: 1, gap: 2 }}>
              <T k="bodyBold">Today's Daily Challenge</T>
              <Muted k="caption">5 personalized words targeting tricky sounds</Muted>
            </View>
            <T k="title" color={colors.sunny}>›</T>
          </Row>
        </Card>

        {/* Talk Board AAC Card */}
        <Card accent="teal" onPress={openTalkBoard}>
          <Row style={{ alignItems: 'center', gap: 12 }}>
            <T style={{ fontSize: 32 }}>💬</T>
            <View style={{ flex: 1, gap: 2 }}>
              <T k="bodyBold">Talk Board (AAC)</T>
              <Muted k="caption">Tap picture words to communicate immediately</Muted>
            </View>
            <T k="title" color={colors.teal}>›</T>
          </Row>
        </Card>

        {/* Parent Hub Gated Access */}
        <Button
          label="🔒 Parents Hub & Settings"
          onPress={openParents}
          outline
          color="violet"
          style={{ minHeight: 52, borderRadius: 18 }}
        />
      </View>

      {/* 5. Safety & Trust Footer */}
      <View style={{ backgroundColor: soft.sunny, borderRadius: 14, padding: 12, width: '100%', maxWidth: 420 }}>
        <T k="caption" color={colors.muted} style={{ textAlign: 'center', fontSize: 12 }}>
          🔒 Child-safe: 100% offline, zero ads, no tracking. Grown-up tools and reports sit securely behind your Parent PIN.
        </T>
      </View>
    </ScrollView>
  );
}
