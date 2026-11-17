# Apple App Store Release Kit — Angel Artic (iOS)
**Publisher:** Hope Bridge Digital ([hopebirdgedigital.site](https://hopebirdgedigital.site/))  
**Support Email:** hello@hopebridgedigital.com  
**Privacy Policy:** https://hopebirdgedigital.site/privacy  

---

## 1. App Store Connect Metadata

| Field | Content | Character Limit |
|---|---|---|
| **App Name** | `Angel Artic: Speech Sounds` | 27 / 30 |
| **Subtitle** | `Speech Therapy Practice & AAC` | 30 / 30 |
| **Primary Category** | `Education` | — |
| **Secondary Category** | `Medical` (or `Lifestyle`) | — |
| **Age Rating / Kids** | **Made for Kids (Ages 5 and Under, 6–8)** | — |
| **Bundle ID** | `com.angelartic.app` | — |
| **SKU** | `ANGEL-ARTIC-IOS` | — |

---

## 2. Keywords (App Store Search Optimization - ASO)
*(Max 100 characters, separated by commas, no spaces after commas)*
```text
speech therapy,articulation,apraxia,autism,speech delay,SLP,phonics,speech practice,AAC,pronunciation
```

---

## 3. Promotional Text & App Description

### Promotional Text (170 characters):
> Gentle, evidence-based speech sound practice for kids. Master 25+ target sounds through interactive adventures, audio scoring, and AAC support.

### Full Description (App Store):
```text
Say it. Hear it. Shine! 🌟

Angel Artic by Hope Bridge Digital makes speech therapy practice joyful, gentle, and empowering. Designed especially for children with speech delays, articulation challenges, childhood apraxia of speech, or autism, Angel Artic turns speech sound repetition into an interactive adventure.

Whether working alongside a Speech-Language Pathologist (SLP) or practicing at home with family, Angel Artic provides evidence-based articulation ladders from single sounds up to conversational sentences.

🎯 EVIDENCE-BASED ARTICULATION LADDERS
Master 25+ speech sounds across systematic difficulty steps:
• Isolation: Hear the pure phoneme and discover tongue & lip placement.
• Syllables: Combine sounds with vowels (CV, VC, VCV).
• Words: Practice sounds in Initial, Medial, and Final positions.
• Phrases & Sentences: Build fluency with fun, contextual phrases.
• Carryover Stories: Real mini-stories to practice natural conversational speech.

🎮 ENGAGING FOR KIDS, INSIGHTFUL FOR CAREGIVERS
• World Quest Adventure: Journey across 5 vibrant worlds with friendly animal companions.
• Instant Audio Feedback: Real-time on-device audio scoring celebrates every try.
• Daily Challenge: Gentle 5-word daily routines to build confidence and streaks.
• Reward Stickers & Badges: Celebrate effort and milestones without stressful timers.
• AAC Talk Board: Over 100 visual picture communication tiles with text-to-speech.

🔒 100% PRIVATE & SAFE — MADE FOR KIDS
• Offline-First: All voice recordings and progress data stay securely on your device.
• Zero Ads & Zero Tracking: No third-party advertisements or trackers ever.
• Strict Apple Kids Category Compliance: External links and settings protected behind a Parental Gate.
• COPPA & GDPR Compliant: Designed with child privacy as the first priority.

🤝 BUILT BY HOPE BRIDGE DIGITAL
Angel Artic is part of the Hope Bridge Digital ecosystem of accessible, neuro-affirming technologies:
• Angel Artic (Speech Sound Practice)
• Angel Talk (AAC Picture Communication)
• BloomLearn (AI Visual & Video Learning Platform)
• Bloom Focus (Attention & Cognitive Development)
• Nexia Bridge (Care Team Collaboration)

Visit us at: https://hopebirdgedigital.site/
Support & Clinical Feedback: hello@hopebridgedigital.com
```

---

## 4. App Store Kids Category & Privacy Review Compliance

Apple has strict guidelines for apps in the **Kids Category (App Store Review Guidelines 1.3 & 5.1.4)**:

1. **Parental Gate:**  
   Any external link (e.g. Hope Bridge website or email support) or settings must be behind a parental gate.  
   *Status in Angel Artic:* **COMPLIANT** — In-app math challenge gate is implemented in `ParentHub.tsx`.
2. **Third-Party Advertising & Analytics:**  
   Kids category apps must **NOT** include third-party advertising or analytics SDKs.  
   *Status in Angel Artic:* **COMPLIANT** — Zero third-party ad networks, trackers, or behavioral SDKs.
3. **App Privacy (Nutrition Label in App Store Connect):**  
   - Select **"Data Not Collected"** (or local audio only: Not linked to user identity, Not used for tracking).
4. **Microphone Usage Description (`NSMicrophoneUsageDescription`):**  
   Already configured in `app.json`:  
   *"Angel Artic listens to your child say practice words. Recordings stay on this device."*
5. **Encryption Declaration (`ITSAppUsesNonExemptEncryption`):**  
   Already configured as `false` in `app.json` (bypasses export compliance questionnaires).

---

## 5. Required iOS Screenshots & App Store Assets

| Asset | Size (Pixels) | Notes |
|---|---|---|
| **App Store Icon** | `1024 × 1024` PNG | Located at `assets/icon.png`. Must have **no alpha/transparency** and square corners. |
| **6.7" iPhone Display** | `1290 × 2796` or `1284 × 2778` | iPhone 15/16 Pro Max, 14 Pro Max |
| **6.5" iPhone Display** | `1242 × 2688` or `1284 × 2778` | iPhone 11 Pro Max, XS Max |
| **12.9" iPad Pro** | `2048 × 2732` | Required because `"supportsTablet": true` in `app.json` |

---

## 6. How to Build & Submit for iOS (EAS / TestFlight)

### Prerequisites:
1. An active [Apple Developer Account](https://developer.apple.com/) ($99/yr).
2. [EAS CLI](https://expo.dev/eas) installed (`npm install -g eas-cli`).

### Step 1: Login to Expo & Connect Apple Account
```bash
eas login
```

### Step 2: Build for iOS (TestFlight / App Store)
```bash
cd angel-artic
eas build --platform ios --profile production
```
*EAS automatically generates the Apple Distribution Certificate and Provisioning Profile via Apple Developer API.*

### Step 3: Submit to TestFlight / App Store
Once the build completes:
```bash
eas submit --platform ios
```
*Your `.ipa` will be delivered directly to App Store Connect. Within 10–15 minutes, it appears in TestFlight for internal & external testing.*
