# Launch checklist: the work that only you can do

Each step says why, how long, and exactly what to do. Do them in order.

## 1. Test on a real phone  (today, 30 min)
Why: everything so far was tested in a desktop browser only.
1. Install **Expo Go** from the App Store or Google Play.
2. Put the phone on the same Wi‑Fi as the Mac.
3. In Terminal: `cd "/Users/imac/Desktop/Autism Angel Antic/angel-artic"` then `npx expo start -c`.
4. iPhone: open the Camera app and scan the QR code. Android: scan it inside Expo Go.
5. Walk through the test list at the bottom of this file and write down anything wrong.
Send me the list and I will fix it.

## 2. Pronunciation scoring key (Azure)  (1 hour, small cost)
Why: without it the app only knows a voice was heard, not which word.
1. Make a free Microsoft Azure account (portal.azure.com).
2. Create a resource: **Speech service**. Pick the free tier (F0) and a region near you.
3. Open it, then **Keys and Endpoint**. Copy **Key 1** and the **Region** (like `westeurope`).
4. In the app: Parents tab, enter your PIN, Settings, paste both under Azure.
5. Test on an **iPhone**. Say the word clearly. The result should say "verified".
Android and the key-on-phone problem are solved by the scoring server in `server/` (see `server/README.md`): it holds the Azure key, converts Android audio to WAV, and the app talks to it (Settings, Scoring server). Host it on Render/Fly/Railway with HTTPS before launch, and add Apple App Attest / Play Integrity so the token cannot be abused. Update the privacy policy to say recordings go to your server and Azure when scoring is on. Not yet tested against a real Azure key or a real Android phone.

## 3. Choose your own PIN  (2 min)
Onboarding asks for a PIN and a recovery word. Pick your own and keep the recovery word safe. Do not leave it as 1234.

## 4. Real voice recordings  (1 to 2 weeks)
Why: the computer voice is the biggest "not professional" signal for children.
Everything is ready. You only need a voice actor.
1. Give them `store/briefs/VOICE_BRIEF.md` and `store/briefs/voice-script.csv` (2,048 clips, about 80 minutes). Ask for a 30-clip test batch first.
2. Put the finished WAV files in one folder. Run: `node scripts/import-voice.mjs /path/to/folder`
3. Then run: `node scripts/build-assets.mjs`. The app now plays the real voice for every clip you imported, and still uses the computer voice for the rest, so you can add recordings in stages.
4. `assets/voice/HUMAN.txt` lists which clips are real so you can see the coverage.

## 4b. Real illustrations  (2 to 4 weeks)
1. Give an illustrator `store/briefs/ILLUSTRATION_BRIEF.md` and `store/briefs/illustration-list.csv` (458 pictures). Ask for a 12-picture style test first.
2. Put their PNGs in `assets/art/` named like the list (`pig.png`). Run: `node scripts/import-art.mjs`
3. The app uses an illustration when one exists and the emoji when it does not.

## 4c. Therapist review  (1 week)
Send `store/briefs/therapist-review-words.csv` and `therapist-review-sounds.csv` to 2 or 3 speech therapists. Send me their corrections.

## 5. Accounts  (1–3 days; Apple can take longer)
- Apple Developer Program: developer.apple.com/programs, $99 a year. Needs an Apple ID and ID checks. Choose Individual or Organization (Organization needs a D‑U‑N‑S number, takes days).
- Google Play Console: play.google.com/console, $25 once. Needs ID verification.
- Expo account (free): expo.dev, then in Terminal `npx eas-cli login`.

## 6. Legal and privacy  (a few days, about $200–600)
1. Open `store/privacy-policy.html` and `store/terms.html`. The company name, support email and date are filled in. Add your postal address where it says [POSTAL ADDRESS].
2. Ask a lawyer who knows COPPA and GDPR-K to review both and the app's behaviour.
3. Host the privacy policy on a public web page (a simple site on Netlify, GitHub Pages or your own domain works). Paste its link into both store forms and into the app's Legal screen later.
4. Put a real support email address in all of it.

## 7. Payments  (not needed)
The whole app is free. There are no purchases, so there is nothing to set up. You skip RevenueCat and the store subscriptions. In the store forms answer: no in-app purchases, no ads.

## 8. Build the real app  (half a day)
1. `cd` into the project, then `npx eas-cli login`.
2. `npx eas-cli build:configure` (the `eas.json` file is already prepared).
3. Test build for your phone: `npx eas-cli build --profile preview --platform android` (installs as an APK) or `--platform ios` (needs the Apple account and registered device).
4. Store build: `npx eas-cli build --profile production --platform all`.
5. Upload: `npx eas-cli submit --platform ios` and `--platform android`.
The app ids are `com.angelartic.app`. Change them in `app.json` before the first store build if you want a different name. They cannot change after.

## 9. Crash reporting  (1 hour)
The app saves a local problem report (Settings, Problem report). For automatic reports:
1. Create a Sentry account (sentry.io), project type React Native.
2. Send me the DSN. I will add it with all child data and recordings switched off. Note: this must be mentioned in the privacy policy and the Kids rules must allow it. Many kids apps skip third-party analytics entirely. Your call.

## 10. Store pages  (1–2 days)
Use `store/STORE_LISTING.md`. Take final screenshots from a real build. Record a 20–30 second video if you want one. Answer the privacy and age questionnaires truthfully.

## 11. Beta test  (2–3 weeks)
1. iOS: TestFlight. Android: Google Play closed testing. Google requires 12 testers for 14 days before a new personal developer account can go live.
2. Recruit 20–30 families and 2–3 speech therapists to look at the sound lists and word difficulty (they are reviewers only, not users of the app).
3. Ask: did the child understand it, did the mic work, did anything crash, was the scoring fair.

## 12. Content review  (1 week)
- Arabic: a native speaker reads every screen and corrects the translations. Tell me the corrections.
- Custom illustrations: optional. Emoji pictures work but look generic. An illustrator can make a 204-picture set.

## 13. Submit
Submit for review. Apple usually takes 1–3 days, Google 1–7. If rejected, send me the message and I will help fix it.

---
## Real-phone test list
- First launch: onboarding, Mic Check asks for permission, volume bar moves when you talk
- Say a word: you hear the real voice, result shows, stars appear
- Stay silent: it says "I didn't hear anything" and no stars
- Practice: Listen, Watch mouth, Quiz, Say the sentence
- Home, Practice, Play, Talk, Parents tabs all work, back arrow works
- Parents: PIN works, wrong PIN locks after 5 tries
- Custom word with a photo and your own voice recording
- Weekly report: Share PDF opens the share sheet
- Settings: Export backup, Arabic switch flips the layout
- Bluetooth headphones and speaker volume
- Rotate the phone, big text on, silent switch on (can you still hear the voice?)
- Small phone and large phone

## Languages
Spanish and Urdu interfaces were added next to Arabic (Settings, Language). All three are first drafts: have a native speaker review each before launch.

---
## Beta test
Use `store/briefs/BETA_PLAN.md`: who to invite, the messages to send, and the feedback form questions.

## Added since the first version
- Links that leave the app (Angel Talk website and email) now ask a grown-up to type a number written in words. Stores want this in children's apps.
- After the setup screen, the child goes straight into the first sound, so practice starts in about a minute.
- Scoring server: deploy files are in `server/` (Dockerfile and Render blueprint). Follow `server/README.md`.
- Draft store screenshots at the exact store sizes: `store/screenshots/final/`.
- Not done: crash reporting needs your Sentry account (see step 9), and daily reminders need a test on a real phone build because they use a phone feature Expo Go limits.
