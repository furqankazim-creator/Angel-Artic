# Google Play Store Release Kit — Angel Artic
**Publisher:** Hope Bridge Digital ([hopebirdgedigital.site](https://hopebirdgedigital.site/))  
**Support Email:** hello@hopebridgedigital.com  
**Privacy Policy:** https://hopebirdgedigital.site/privacy  

---

## 1. Store Listing Metadata

| Field | Content | Character Limit |
|---|---|---|
| **App Title** | `Angel Artic: Speech Sounds` | 27 / 30 |
| **Short Description** | `Gentle speech sound practice & AAC articulation games for children.` | 68 / 80 |
| **Category** | Education / Special Needs | — |
| **Content Rating** | Everyone (Families Policy: Ages 5 & under, 6–8) | — |

---

## 2. Full Description (Google Play Store)

```markdown
Say it. Hear it. Shine! 🌟

Angel Artic by Hope Bridge Digital makes speech therapy practice joyful, gentle, and empowering. Designed especially for children with speech delays, articulation challenges, apraxia, or autism, Angel Artic turns speech sound repetition into an interactive adventure.

Whether working with a Speech-Language Pathologist (SLP) or practicing at home with family, Angel Artic provides evidence-based articulation ladders from single sounds up to conversational sentences.

---

### 🎯 EVIDENCE-BASED ARTICULATION LADDERS
Master 25+ target speech sounds across systematic difficulty steps:
• Isolation: Hear the pure phoneme and discover tongue & lip placement.
• Syllables: Combine sounds with vowels (CV, VC, VCV).
• Words: Practice sounds in Initial, Medial, and Final positions.
• Phrases & Sentences: Build fluency with fun, contextual phrases.
• Carryover Stories: Real mini-stories to practice natural conversational speech.

### 🎮 ENGAGING FOR KIDS, INSIGHTFUL FOR PARENTS & SLPs
• World Quest Adventure: Journey across 5 vibrant worlds with friendly animal companions.
• Instant Audio Feedback: Real-time on-device audio scoring celebrates every try.
• Daily Challenge: Gentle 5-word daily routines to build confidence and streaks.
• Reward Stickers & Badges: Celebrate effort and milestones without stressful timers.
• AAC Talk Board: Over 100 visual picture communication tiles with text-to-speech.

### 🔒 100% PRIVATE & SAFE FOR FAMILIES
• Offline-First: All voice recordings and progress data stay securely on your device.
• Zero Ads & Zero Tracking: No third-party advertisements or invasive trackers ever.
• COPPA & GDPR Compliant: Built strictly in accordance with Google Play's Families Policy.
• Safe Parent Gate: Settings, data backup, and clinician controls protected by math gates.

### 🤝 BUILT BY HOPE BRIDGE DIGITAL
Angel Artic is part of the Hope Bridge Digital ecosystem of accessible, neuro-affirming technologies for communication and learning:
• Angel Artic (Speech Sound Practice)
• Angel Talk (AAC Picture Communication)
• BloomLearn (AI Visual & Video Learning Platform)
• Bloom Focus (Attention & Cognitive Development)
• Nexia Bridge (Care Team Collaboration)

Visit us at: https://hopebirdgedigital.site/
Support & Feedback: hello@hopebridgedigital.com
```

---

## 3. Google Play Console Policy & Safety Declarations

### A. Target Audience & Content (Families Policy)
- **Target Age Groups:** Check **`5 and under`** and **`6–8`**.
- **Appeal to Children:** Yes.
- **Ads:** Select **`No, my app does not contain ads`**.
- **Apps for Children:** Complies with Google Play Families Policy (no behavioral ads, no unauthorized SDKs).

### B. Data Safety Questionnaire
- **Does your app collect or share any user data?**
  - Select **`No`** (or if declaring local audio):
    - Data type: **Voice or sound recordings**.
    - **Collected:** Yes (recorded strictly for temporary scoring on device).
    - **Shared:** **No** (never transmitted to third parties).
    - **Processed Ephemerally:** **Yes** (used only in real-time to analyze sound, stored locally on device only).
    - **User Account / Profiling:** No accounts required.
- **Security Practices:**
  - Data is not encrypted in transit because it **never leaves the device**.
  - Users can delete their data at any time via in-app Settings (`Reset Profile & Progress`).

### C. App Permissions Declaration
- `android.permission.RECORD_AUDIO`:
  - **Purpose:** Microphone input to listen to the child's pronunciation and score speech sound attempts.
  - **Prominent Disclosure:** App presents an in-app permission primer before requesting mic access: *"Angel Artic listens to your child say practice words. Recordings stay on this device."*

---

## 4. Android App Configuration (`app.json`)

```json
{
  "expo": {
    "name": "Angel Artic",
    "slug": "angel-artic",
    "version": "1.0.0",
    "android": {
      "package": "com.angelartic.app",
      "versionCode": 1,
      "permissions": ["RECORD_AUDIO"],
      "adaptiveIcon": {
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundColor": "#B655D0"
      }
    }
  }
}
```

---

## 5. Building the Android App Bundle (`.aab`) for Google Play

Google Play requires an `.aab` (Android App Bundle).

### Step 1: Install EAS CLI (if not installed)
```bash
npm install -g eas-cli
```

### Step 2: Log in to Expo
```bash
eas login
```

### Step 3: Run Production Build
```bash
cd angel-artic
eas build --platform android --profile production
```
*(EAS automatically signs the bundle and provides the downloadable `.aab` file ready to drag-and-drop into Google Play Console Internal/Closed testing or Production).*

### For Local APK Testing (to test directly on an Android device or emulator):
```bash
eas build --platform android --profile preview
```
*(Generates a direct installable `.apk` file).*
