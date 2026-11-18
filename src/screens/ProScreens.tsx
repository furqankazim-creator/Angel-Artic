import React, { useState } from 'react';
import { Alert, Platform, Pressable, Share, TextInput, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { buildReportHtml } from '../lib/report';
import { persistFile } from '../lib/recordings';
import { playUri } from '../audio';
import { WordPic } from '../art/WordPic';
import { Button, Card, Chip, Muted, Pill, Row, Screen, T } from '../ui';
import { POSITIONS, Position, SOUNDS, createCustomSound, soundById } from '../data/sounds';
import { masteryFor } from '../lib/mastery';
import { daysAgo } from '../lib/date';
import { uid, useStore } from '../store';
import { useNav } from '../nav';
import { Accent, colors, layout, soft } from '../theme';
import { withPin } from './PinGate';

const input = { minHeight: layout.tap, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: 16, fontSize: 17, color: colors.ink } as const;

function CustomWordsInner() {
  const { s, profile, set, allSounds, addCustomSound, deleteCustomSound } = useStore();
  const { go } = useNav();
  const [soundId, setSoundId] = useState('s');
  const [position, setPosition] = useState<Position>('initial');
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [sentence, setSentence] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [image, setImage] = useState<string | undefined>();
  const [voice, setVoice] = useState<string | undefined>();
  const [rec, setRec] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // New Custom Sound state
  const [showAddSound, setShowAddSound] = useState(false);
  const [newSoundSymbol, setNewSoundSymbol] = useState('');
  const [newSoundEmoji, setNewSoundEmoji] = useState('⭐');
  const [newSoundCue, setNewSoundCue] = useState('');
  const [newSoundAccent, setNewSoundAccent] = useState<Accent>('coral');

  const pickPhoto = async () => {
    try {
      const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [1, 1] });
      if (!r.canceled && r.assets[0]) setImage(await persistFile(r.assets[0].uri, 'img'));
    } catch {}
  };

  const takePhoto = async () => {
    try {
      const p = await ImagePicker.requestCameraPermissionsAsync();
      if (!p.granted) return Alert.alert('Camera permission', 'Allow camera access to snap a photo.');
      const r = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
      if (!r.canceled && r.assets[0]) setImage(await persistFile(r.assets[0].uri, 'img'));
    } catch {}
  };

  const toggleVoice = async () => {
    if (rec) {
      setRec(false);
      try {
        await recorder.stop();
        if (recorder.uri) setVoice(await persistFile(recorder.uri, 'voice'));
      } catch {}
      return;
    }
    try {
      const p = await requestRecordingPermissionsAsync();
      if (!p.granted) return Alert.alert('Microphone is off', 'Allow the microphone in Settings to record your voice.');
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRec(true);
    } catch {}
  };

  const mine = s.custom.filter((c) => c.profileId === profile?.id);

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setWord(c.word);
    setEmoji(c.emoji || '⭐');
    setSoundId(c.soundId);
    setPosition(c.position);
    setImage(c.imageUri);
    setVoice(c.voiceUri);
    setSentence(c.sentence && !c.sentence.startsWith('Say "') ? c.sentence : '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setWord('');
    setEmoji('⭐');
    setSentence('');
    setImage(undefined);
    setVoice(undefined);
  };

  const saveWord = () => {
    if (!word.trim() || !profile) return;
    const w = word.trim().toLowerCase();
    const cleanSent = sentence.trim() || `Say "${w}".`;

    if (editingId) {
      set((st) => ({
        ...st,
        custom: st.custom.map((item) =>
          item.id === editingId
            ? {
                ...item,
                word: w,
                soundId,
                position,
                emoji: emoji.trim() || '⭐',
                sentence: cleanSent,
                imageUri: image,
                voiceUri: voice,
              }
            : item
        ),
      }));
      cancelEdit();
      return;
    }

    set((st) => ({
      ...st,
      custom: [
        ...st.custom,
        {
          id: `c-${uid()}`,
          profileId: profile.id,
          soundId,
          position,
          word: w,
          emoji: emoji.trim() || '⭐',
          sentence: cleanSent,
          custom: true,
          imageUri: image,
          voiceUri: voice,
        },
      ],
    }));
    cancelEdit();
  };

  const confirmDelete = (id: string, wordName: string) => {
    Alert.alert(
      'Delete Custom Word?',
      `Remove "${wordName}" and its recordings?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (editingId === id) cancelEdit();
            set((st) => ({ ...st, custom: st.custom.filter((x) => x.id !== id) }));
          },
        },
      ]
    );
  };

  return (
    <Screen title={editingId ? 'Edit Custom Word' : 'Custom Words'} onBack>
      <Muted>Add your family words, pets, or names with real photos and your own voice!</Muted>

      {/* Editing Banner */}
      {editingId && (
        <Row style={{ alignItems: 'center', justifyContent: 'space-between', backgroundColor: soft.violet, padding: 12, borderRadius: 16 }}>
          <T k="bodyBold" color={colors.violet}>✏️ Editing "{word}"</T>
          <Button small outline label="✕ Cancel Edit" onPress={cancelEdit} color="coral" />
        </Row>
      )}

      {/* Quick Idea Starters */}
      <View style={{ gap: 6, marginTop: 4 }}>
        <T k="caption" color={colors.muted} style={{ letterSpacing: 0.8, fontFamily: 'Nunito_800ExtraBold' }}>
          💡 QUICK IDEAS (TAP TO PRE-FILL):
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {[
            { label: '🐶 Pet: Bella', word: 'Bella', emoji: '🐶', sound: 'b', pos: 'initial', sent: 'Bella is a happy puppy.' },
            { label: '👩 Mommy', word: 'Mommy', emoji: '👩', sound: 'm', pos: 'initial', sent: 'I love Mommy.' },
            { label: '👨 Daddy', word: 'Daddy', emoji: '👨', sound: 'd', pos: 'initial', sent: 'Daddy reads with me.' },
            { label: '🍪 Cookie', word: 'Cookie', emoji: '🍪', sound: 'k', pos: 'initial', sent: 'I want a yummy cookie.' },
            { label: '🧸 Teddy', word: 'Teddy', emoji: '🧸', sound: 't', pos: 'initial', sent: 'My soft teddy bear.' },
          ].map((preset) => (
            <Chip
              key={preset.label}
              label={preset.label}
              on={false}
              onPress={() => {
                setWord(preset.word);
                setEmoji(preset.emoji);
                setSoundId(preset.sound);
                setPosition(preset.pos as Position);
                setSentence(preset.sent);
              }}
              color="violet"
            />
          ))}
        </View>
      </View>

      {/* Target Sound Selector */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
        <T k="heading" style={{ flexShrink: 1 }}>1. Choose target sound</T>
        <Button
          small
          outline={!showAddSound}
          label={showAddSound ? '✕ Close Form' : '+ Add Custom Sound'}
          color="coral"
          onPress={() => setShowAddSound((v) => !v)}
          style={{ minHeight: 40, paddingHorizontal: 14 }}
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {allSounds.map((x) => (
          <Chip
            key={x.id}
            label={`${x.label}${x.group === 'Custom' ? ' ' + x.emoji : ''}`}
            on={soundId === x.id}
            onPress={() => setSoundId(x.id)}
            color={x.accent}
          />
        ))}
      </View>

      {/* Inline Create Custom Sound Form */}
      {showAddSound && (
        <Card accent="coral" style={{ gap: 10, marginTop: 4 }}>
          <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <T k="bodyBold" color={colors.coral}>✨ Create Custom Sound or Blend</T>
            <Button small outline label="✕ Close" color="coral" onPress={() => setShowAddSound(false)} />
          </Row>
          <Muted k="caption">Add target blends like /tr/, /bl/, /sp/, /cl/, /dr/ or any speech target you want to practice.</Muted>

          <T k="caption" color={colors.ink}>Sound symbol (letters):</T>
          <TextInput
            value={newSoundSymbol}
            onChangeText={setNewSoundSymbol}
            placeholder="e.g. tr, bl, sp, cl, dr..."
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            style={input}
          />

          <Row style={{ gap: 8 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <T k="caption" color={colors.ink}>Emoji icon:</T>
              <TextInput
                value={newSoundEmoji}
                onChangeText={setNewSoundEmoji}
                placeholder="⭐ or 🚂 or 🌟"
                placeholderTextColor={colors.muted}
                style={input}
              />
            </View>
          </Row>

          <T k="caption" color={colors.ink}>Accent Color:</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {(['coral', 'teal', 'violet', 'sunny', 'pink', 'sky', 'green'] as Accent[]).map((c) => (
              <Chip key={c} label={c} on={newSoundAccent === c} onPress={() => setNewSoundAccent(c)} color={c} />
            ))}
          </View>

          <T k="caption" color={colors.ink}>Parent tip / cue for child (optional):</T>
          <TextInput
            value={newSoundCue}
            onChangeText={setNewSoundCue}
            placeholder="e.g. Slide tongue back, then round lips"
            placeholderTextColor={colors.muted}
            style={input}
          />

          <Button
            label="Save & Use This Sound"
            color="coral"
            onPress={() => {
              const clean = newSoundSymbol.toLowerCase().replace(/[^a-z0-9_]/g, '');
              if (!clean) {
                return Alert.alert('Missing sound symbol', 'Please enter a sound symbol, like "tr" or "bl".');
              }
              if (allSounds.some((x) => x.id === clean)) {
                setSoundId(clean);
                setShowAddSound(false);
                return Alert.alert('Sound exists', `/${clean}/ is already in your sounds list!`);
              }
              const created = createCustomSound(clean, newSoundEmoji, newSoundCue, newSoundAccent);
              addCustomSound(created);
              setSoundId(clean);
              setNewSoundSymbol('');
              setNewSoundCue('');
              setShowAddSound(false);
            }}
          />
        </Card>
      )}

      {/* Delete button if current sound is a custom sound */}
      {s.customSounds?.some((x) => x.id === soundId) && (
        <Row style={{ alignItems: 'center', justifyContent: 'space-between', backgroundColor: soft.coral, padding: 10, borderRadius: 14 }}>
          <T k="caption" color={colors.coral}>Custom Sound /{soundId}/ is selected</T>
          <Button
            small
            outline
            label="🗑️ Delete Sound"
            color="coral"
            onPress={() => {
              Alert.alert(
                'Delete Custom Sound?',
                `Remove custom sound /${soundId}/? Words targeting this sound will stay in your custom words.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      deleteCustomSound(soundId);
                      setSoundId('s');
                    },
                  },
                ],
              );
            }}
          />
        </Row>
      )}

      {/* Word Position */}
      <T k="heading" style={{ marginTop: 4 }}>2. Sound position in word</T>
      <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
        {POSITIONS.map((p) => {
          const short = p === 'initial' ? 'Start' : p === 'medial' ? 'Middle' : 'End';
          const sub = p === 'initial' ? 'Initial' : p === 'medial' ? 'Medial' : 'Final';
          const on = position === p;
          return (
            <Pressable
              key={p}
              onPress={() => setPosition(p)}
              style={{
                flex: 1,
                minHeight: 48,
                paddingVertical: 6,
                paddingHorizontal: 4,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? colors.violet : colors.white,
                borderWidth: 2,
                borderColor: colors.violet,
              }}
            >
              <T k="bodyBold" color={on ? colors.white : colors.ink} style={{ textAlign: 'center', fontSize: 13 }}>
                {short}
              </T>
              <T k="caption" color={on ? 'rgba(255,255,255,0.85)' : colors.muted} style={{ fontSize: 10, textAlign: 'center' }}>
                ({sub})
              </T>
            </Pressable>
          );
        })}
      </View>

      {/* Word and Emoji Input */}
      <T k="heading" style={{ marginTop: 4 }}>3. Word & picture</T>
      <TextInput value={word} onChangeText={setWord} placeholder="Word name (e.g. Bella, Daddy, Oreo)" placeholderTextColor={colors.muted} style={input} />
      <TextInput value={emoji} onChangeText={setEmoji} placeholder="Emoji icon (fallback if no photo: e.g. 🐶)" placeholderTextColor={colors.muted} style={input} />
      <TextInput
        value={sentence}
        onChangeText={setSentence}
        placeholder={`Practice sentence (e.g. ${word.trim() ? `${word.trim()} is so sweet!` : 'Bella is a good puppy'})`}
        placeholderTextColor={colors.muted}
        style={input}
      />

      {/* Photo Attachment & Preview */}
      {image ? (
        <Row style={{ alignItems: 'center', gap: 12, backgroundColor: soft.teal, padding: 10, borderRadius: 16 }}>
          <WordPic w={{ emoji: '⭐', imageUri: image }} size={64} />
          <View style={{ flex: 1 }}>
            <T k="bodyBold" color={colors.teal}>Photo attached ✓</T>
            <Muted k="caption">Will be shown on the main page & during practice</Muted>
          </View>
          <Button small outline label="✕ Remove" onPress={() => setImage(undefined)} color="coral" />
        </Row>
      ) : (
        <Row style={{ gap: 8 }}>
          <Button small outline label="📷 Gallery Photo" onPress={pickPhoto} color="teal" style={{ flex: 1 }} />
          <Button small outline label="📸 Take Photo" onPress={takePhoto} color="teal" style={{ flex: 1 }} />
        </Row>
      )}

      {/* Voice Recording Attachment & Preview */}
      <T k="heading" style={{ marginTop: 4 }}>4. Parent voice recording</T>
      {rec ? (
        <Card accent="coral" style={{ alignItems: 'center', gap: 8 }}>
          <T k="heading" color={colors.coral}>🔴 Recording your voice...</T>
          <Muted>Say "{word.trim() || 'the word'}" clearly into the microphone</Muted>
          <Button label="⏹ Stop Recording" onPress={toggleVoice} color="coral" />
        </Card>
      ) : voice ? (
        <Row style={{ alignItems: 'center', gap: 12, backgroundColor: soft.sky, padding: 10, borderRadius: 16 }}>
          <T style={{ fontSize: 26 }}>🎙️</T>
          <View style={{ flex: 1 }}>
            <T k="bodyBold" color={colors.sky}>Voice recorded ✓</T>
            <Muted k="caption">Plays when your child listens to this word</Muted>
          </View>
          <Button small label="▶ Listen" onPress={() => playUri(voice)} color="sky" />
          <Button small outline label="✕ Change" onPress={() => setVoice(undefined)} color="coral" />
        </Row>
      ) : (
        <Button small outline label="🎙️ Record pronunciation" onPress={toggleVoice} color="coral" />
      )}

      <Button
        label={editingId ? '💾 Update Custom Word' : '✨ Save & Add Custom Word'}
        onPress={saveWord}
        disabled={!word.trim()}
        color="coral"
        style={{ marginTop: 8 }}
      />

      {/* List of saved custom words */}
      <T k="heading" style={{ marginTop: 16 }}>My Custom Words ({mine.length})</T>
      {mine.length === 0 && <Muted>No custom words added yet. Add one above to see it here and on the main page!</Muted>}
      {mine.map((c) => {
        const attempts = (profile?.attempts || []).filter((a) => a.wordId === c.id && a.status === 'scored');
        const tries = attempts.length;
        const avg = tries > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / tries) : null;
        return (
          <Card key={c.id}>
            <Row style={{ alignItems: 'center', gap: 12 }}>
              <WordPic w={c} size={54} />
              <View style={{ flex: 1, gap: 4 }}>
                <Row style={{ alignItems: 'center', gap: 6 }}>
                  <T k="heading">{c.word}</T>
                  {tries > 0 ? (
                    <Pill
                      label={`🎯 ${tries} tries · ${avg}%`}
                      color={avg! >= 80 ? 'green' : avg! >= 60 ? 'sunny' : 'coral'}
                    />
                  ) : (
                    <Pill label="New ⭐" color="teal" />
                  )}
                </Row>
                <Muted k="caption">Sound /{c.soundId}/ · {c.position}</Muted>
              </View>
              {c.voiceUri && <Button small label="▶" onPress={() => playUri(c.voiceUri!)} color="sky" />}
              <Button small label="Practise" onPress={() => (s.micChecked ? go('Record', { wordId: c.id, mode: 'custom' }) : go('MicCheck'))} color="teal" />
              <Button small outline label="✏️" onPress={() => startEdit(c)} color="violet" />
              <Button small outline label="🗑️" onPress={() => confirmDelete(c.id, c.word)} color="coral" />
            </Row>
          </Card>
        );
      })}
    </Screen>
  );
}

function WeeklyInner() {
  const { s, profile } = useStore();
  const week = new Set(Array.from({ length: 7 }, (_, i) => daysAgo(i)));
  const att = (profile?.attempts ?? []).filter((a) => week.has(a.day));
  const rows = SOUNDS.map((x) => {
    const mine = att.filter((a) => a.soundId === x.id);
    const sc = mine.filter((a) => a.status === 'scored');
    return { x, scored: sc.length, acc: sc.length ? Math.round(sc.reduce((n, a) => n + a.score, 0) / sc.length) : 0, noSound: mine.length - sc.length, mastery: masteryFor(profile?.attempts ?? [], x.id).level };
  }).filter((r) => r.scored || r.noSound);
  const pdf = async () => {
    const from = [...week].sort()[0], to = [...week].sort().slice(-1)[0];
    const html = buildReportHtml({ name: profile?.name ?? '', from, to, attempts: att as any, mastery: Object.fromEntries(rows.map((r) => [r.x.id, r.mastery])) });
    try {
      if (Platform.OS === 'web') return await Print.printAsync({ html });
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    } catch { Alert.alert('Could not make the PDF', 'Please try again.'); }
  };
  const csv = ['sound,scored_attempts,accuracy,no_sound_heard,mastery', ...rows.map((r) => `${r.x.label},${r.scored},${r.acc},${r.noSound},${r.mastery}`)].join('\n');
  return (
    <Screen title="Weekly Report" onBack>
      <Muted>{profile?.name} · last 7 days · accuracy counts scored tries only. Practice scores, not a clinical assessment.</Muted>
      {rows.length === 0 && <Muted>No tries this week yet.</Muted>}
      {rows.map((r) => (
        <Card key={r.x.id} accent={r.x.accent}>
          <T k="heading">{r.x.label} · {r.mastery}</T>
          <Muted>{r.scored} scored · {r.acc}% accuracy · {r.noSound} no sound heard</Muted>
        </Card>
      ))}
      <Button label="📄 Share PDF report" onPress={pdf} disabled={!rows.length} color="coral" />
      <Button label="Share report (CSV)" outline onPress={() => Share.share({ message: csv, title: 'Angel Artic weekly report' })} disabled={!rows.length} />
    </Screen>
  );
}

export const CustomWords = withPin(CustomWordsInner, 'Custom Words');
export const WeeklyReport = withPin(WeeklyInner, 'Weekly Report');
