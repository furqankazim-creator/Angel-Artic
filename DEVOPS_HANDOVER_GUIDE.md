# DevOps Handover Guide — Angel Artic (Android & iOS)
**Repository:** https://github.com/furqankazim-creator/Angel-Artic.git  
**Framework:** Expo SDK 58 / React Native 0.88 / TypeScript  
**Single Codebase Targets:** Google Play Store (`.aab`), Apple App Store (`.ipa`), Web (`dist/`)  

---

## 1. Prerequisites & Environment

| Tool | Recommended Version | Install Command |
|---|---|---|
| **Node.js** | `>= 20.x LTS` (or 22.x) | `brew install node` / nvm |
| **EAS CLI** | `>= 12.0.0` | `npm install -g eas-cli` |
| **Expo CLI** | Bundled via npx | `npx expo --version` |

---

## 2. Credentials & Accounts Required

DevOps requires access to three developer consoles:

1. **Expo Organization / Account ([expo.dev](https://expo.dev)):**
   - Role needed: Admin or Developer to generate build credentials and manage project secrets.
   - Generate an **Expo Access Token** for CI/CD: [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens).
2. **Google Play Console:**
   - Package Name: `com.angelartic.app`
   - Google Cloud Service Account with `Service Account User` and Google Play Console `Admin` or `Release Manager` permissions.
   - Generate Service Account `.json` key (used by EAS for automated uploads).
3. **Apple Developer Portal & App Store Connect:**
   - Bundle Identifier: `com.angelartic.app`
   - App Store Connect API Key (`.p8` private key file, `Key ID`, and `Issuer ID`).

---

## 3. Project Configuration Files

The repository already contains pre-configured build & store definitions:
* **App Config:** [`app.json`](./app.json) (Bundle ID, package name, permissions, icons, splash screens)
* **Build Profiles:** [`eas.json`](./eas.json) (Build types: development, preview APK, production AAB & IPA)
* **Web Deploy:** [`vercel.json`](./vercel.json) (Auto-deploys web version on Vercel)
* **Google Play Kit:** [`GOOGLE_PLAY_STORE_LISTING.md`](./GOOGLE_PLAY_STORE_LISTING.md)
* **App Store Kit:** [`APPLE_APP_STORE_RELEASE_KIT.md`](./APPLE_APP_STORE_RELEASE_KIT.md)

---

## 4. Manual CLI Build Commands

Run all commands from the project root (`angel-artic/`):

```bash
# 1. Clone & install dependencies
git clone https://github.com/furqankazim-creator/Angel-Artic.git
cd Angel-Artic/angel-artic
npm install

# 2. Login to Expo
eas login

# 3. Configure credentials on first run (automatic interactive wizard)
eas credentials

# -----------------------------------------------------------------
# ANDROID BUILDS
# -----------------------------------------------------------------
# QA / Tester APK (Direct install on Android phones)
eas build --platform android --profile preview

# Production Google Play App Bundle (.aab)
eas build --platform android --profile production

# -----------------------------------------------------------------
# IOS BUILDS
# -----------------------------------------------------------------
# Production Apple App Store / TestFlight Archive (.ipa)
eas build --platform ios --profile production

# -----------------------------------------------------------------
# BUILD BOTH AT THE SAME TIME
# -----------------------------------------------------------------
eas build --platform all --profile production
```

---

## 5. Automated Store Submissions via EAS

Once builds complete, submit directly to the stores without downloading files:

```bash
# Submit latest Android build to Google Play Console (Internal / Closed Track)
eas submit --platform android

# Submit latest iOS build to TestFlight / App Store Connect
eas submit --platform ios
```

---

## 6. Automated CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml` to trigger cloud builds automatically on Git release tags:

```yaml
name: EAS Build & Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    name: Build Android & iOS
    runs-on: ubuntu-latest
    steps:
      - name: 🏗 Checkout repository
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: angel-artic/package-lock.json

      - name: 📦 Setup Expo & EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: 📥 Install dependencies
        working-directory: ./angel-artic
        run: npm ci

      - name: 🚀 Build Production (Android .aab & iOS .ipa)
        working-directory: ./angel-artic
        run: eas build --platform all --profile production --non-interactive --auto-submit
```

---

## 7. App Store Graphics Checklist for DevOps / Release Manager

* **Android High-Res Icon (512x512):** `assets/google-play-icon-512.png`
* **iOS App Store Icon (1024x1024, No Alpha):** `assets/app-store-icon-1024.png`
* **Adaptive Android Icons:** `assets/android-icon-foreground.png`, `assets/android-icon-background.png`
* **Privacy Policy URL:** `https://hopebirdgedigital.site/privacy`
* **Support Email:** `hello@hopebridgedigital.com`
