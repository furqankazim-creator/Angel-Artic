# Angel Artic — Improvement Plan (Market-Level Banane Ka Plan)

Yeh file simple Roman Urdu mein hai. Isme likha hai app abhi kahan hai, kya kami hai, aur usay market-level kaise banana hai.

---

## 1. App abhi kahan hai (Sach-Sach)

**Jo kaam kar raha hai:**
- 17 sounds, 204 words, Practice screen (Start / Middle / End).
- Mic Check aur "voice gate": agar awaz na aaye to score nahi milta, "I didn't hear anything" aata hai.
- Score, stars, confetti, stickers, XP, streak, Daily Challenge, Daily Mission.
- Angel Talk (picture board), Parent PIN, Parent Hub, Settings, Privacy/Terms.
- Sab data phone mein save hota hai (internet ki zaroorat nahi).

**Jo abhi kamzor hai (yeh pehle theek karna hai):**
1. **Scoring asli nahi hai.** Phone par app sirf yeh janta hai ke "awaz aayi", yeh nahi ke bacha ne *kaunsa lafz* bola. Isliye score "practice score" hai, asli pronunciation score nahi.
2. **Payments nahi hain.** Pro khareedna abhi possible nahi.
3. **Parent PIN ka "5 + 6" wala raasta** 5-8 saal ka bacha bhi hal kar sakta hai. Yeh PIN ko kamzor karta hai.
4. **Phone par test nahi hua.** Sirf web par test hua hai. Asli iPhone/Android par mic aur permission check karna baaki hai.
5. **Store file (APK/IPA) nahi bani.** App abhi sirf Expo Go mein chalti hai.
6. **Icon aur splash screen placeholder hain.**
7. **Privacy policy ka link aur legal text** abhi sirf summary hai. Wakeel se check karwana zaroori hai.

---

## 2. Plan — 4 Phases

### Phase 1 — Pehle App Ko Sachi Banao (1–2 hafte)
Sab se zaroori. Iske baghair market mein jana theek nahi.

| Kaam | Kyun zaroori hai |
|---|---|
| **Asli speech scoring lagao** (SpeechSuper, ya Azure Pronunciation Assessment, ya Google Speech-to-Text) | Abhi score sirf "awaz aayi" par hai. Asli app ko pata hona chahiye bacha ne kya bola. |
| Real phone par test: iPhone + Android (chota aur bara) | Mic permission, awaz ka level, bluetooth headphones — sab alag chalte hain. |
| PIN se "5 + 6" wala raasta hatao ya mushkil banao | Bacha khud parent area khol sakta hai. |
| "PIN bhool gaya" ke liye email-based reset | Parent PIN bhool jaye to data kho na jaye. |
| Crash reporting lagao (Sentry) — **sirf parent mode mein, bacchon ka data nahi** | Bugs jaldi pakre jayen. |
| Automatic tests likho (gate, scoring, mastery, streak) | Naya change purani cheez na tore. |

### Phase 2 — Bacchon Ko Pasand Aane Wala Banao (2–3 hafte)
| Kaam | Detail |
|---|---|
| **Asli awaz (recorded voice)** | Abhi phone ki robot awaz hai. Ek achhi insaani awaz mein 204 words record karwao. Bacchon ke liye bohat farq padta hai. |
| **Mouth animation** | "Watch mouth" mein abhi sirf likha hua hai. Chhota animation/video dikhao (zubaan, hont, daant). |
| **Asli pictures** | Emoji ki jagah achhi illustrations. Kuch emoji alag phones par alag dikhte hain. |
| **Awaaz aur sound effects** | Sahi jawab par khushi ki awaz, mic button par halka sound. |
| **Mascot / character** | Ek pyara character (Angel) jo baat kare aur hausla barhaye. Bacchon ko character se lagao hota hai. |
| **Adventure map ko asli game banao** | Abhi sirf list hai. Map par safar, har world mein chhoti kahani. |
| **Avatar dress-up ko behtar banao** | Sirf emoji nahi, asli character jo kapre pehne. |
| **Bohat dheere chalne wale bacchon ke liye** | Zyada waqt do, "Hear it slowly" aur mushkil words par extra madad. |

### Phase 3 — Parents Aur SLP Ke Liye Taqat (2–3 hafte)
| Kaam | Detail |
|---|---|
| **PDF weekly report** | Abhi sirf CSV text share hota hai. Saaf PDF banao jo SLP ko bheja ja sake. |
| **Audio playback aur comparison** | Parent purani aur nayi recording sun kar farq dekh sake. |
| **SLP ka alag login (optional)** | Therapist apne kai bacchon ke progress dekh sake, homework bheje. |
| **Custom words mein apni tasveer aur awaz** | Ghar ke naam, khilone, family. |
| **Cloud backup (parent ki ijazat se)** | Phone badle to progress na jaye. Yeh optional rakho, default mein sab phone par. |
| **Urdu / Hindi / Arabic / Spanish interface** | Bohat bara market. Sound lists bhi har zubaan ke hisaab se. |

### Phase 4 — Market Mein Launch (2–4 hafte)
| Kaam | Detail |
|---|---|
| **Developer accounts** | Apple Developer ($99/saal) aur Google Play ($25 ek baar). |
| **Payments** | RevenueCat lagao. Free, Pro Monthly ($8.99), Pro Yearly ($59.99). 7-din free trial rakho. |
| **Store build** | `eas build` se APK/AAB aur IPA banao. |
| **App Store listing** | Naam, screenshots (6–8), 30-second video, description, keywords. |
| **Kids / Family category ki shartein** | Apple "Kids Category" aur Google "Designed for Families" ki policies bohat sakht hain. Pehle parhna zaroori hai. |
| **Privacy policy website par** | Alag link ho. Likho: recordings phone par rehti hain, koi ads nahi, koi tracking nahi. |
| **COPPA (USA) aur GDPR-K (Europe)** | Bacchon ke data ke qaanoon. Wakeel se check karwao. |
| **Beta testing** | TestFlight aur Google closed testing. 20–30 families + 2–3 SLP se feedback. |
| **Website + landing page** | Pehle wala presentation page yahan kaam aayega, par yeh app ka hissa nahi, alag website hogi. |

---

## 3. Sab Se Bari Competitive Taqat (Isay Marketing Mein Use Karo)

Doosri apps (Articulation Station, Speech Blubs) se farq:

1. **"Khamoshi ko kabhi score nahi milta."** Yeh sachi aur bohat qeemti baat hai.
2. **Bacha akela practice kar sakta hai**, parent har lafz par tick nahi lagata.
3. **Koi ads nahi, koi chat nahi, koi child account nahi.**
4. **Angel Talk (AAC)** — jo bacha abhi bol nahi sakta wo bhi tap karke baat kar sakta hai.
5. **SLP tools sasti qeemat par.**

> Yaad rakho: marketing mein kabhi yeh mat likho ke "diagnosis karta hai" ya "SLP ki jagah leta hai". Yeh jhoot hoga aur store reject kar sakta hai.

---

## 4. Kamai Ka Model (Money Plan)

- **Free:** 3 sounds (/p/, /s/, /r/), 1 bacha, rozana 10 scored tries.
- **Pro Monthly:** $8.99 mahina.
- **Pro Yearly:** $59.99 saal (sab se zyada bikne wala banao — "2 mahine free" dikhao).
- **Family / Clinic plan (baad mein):** SLP ke liye 10+ bacchon ka plan.
- **Free trial:** 7 din.
- Paywall hamesha **parent PIN ke peeche** rakho, bacha kabhi na dekhe.

---

## 5. Kaam Ki Tarteeb (Priority List)

**Abhi karo (is hafte):**
1. Asli phone par test.
2. Asli speech scoring ka faisla (SpeechSuper vs Azure vs Google).
3. PIN ka "5 + 6" raasta theek karo.
4. App icon aur splash banao.

**Phir (agle 2 hafte):**
5. Asli awaz recordings.
6. Mouth animation.
7. Tests aur crash reporting.

**Phir (1 mahina):**
8. PDF reports, Urdu zubaan, payments.

**Aakhir mein (launch):**
9. Beta testing, store listing, legal check, submit.

---

## 6. Kitna Time Lagega (Andaza)

| Phase | Waqt |
|---|---|
| Phase 1 | 1–2 hafte |
| Phase 2 | 2–3 hafte |
| Phase 3 | 2–3 hafte |
| Phase 4 | 2–4 hafte |
| **Total** | **Takriban 2–3 mahine** (akele developer ke liye) |

Andaza hai. Asli speech scoring aur store ki manzoori mein zyada waqt lag sakta hai.

---

## 7. Khatre (Risks) Aur Unka Hal

| Khatra | Hal |
|---|---|
| Speech scoring mehngi par sakti hai | Pehle free tier se shuru karo, har try ki qeemat check karo. |
| Store bacchon ki app reject kare | Kids policy pehle parho, koi third-party ads/analytics na lagao. |
| Parents ko "AI diagnosis" ka galat andaza ho | App mein har jagah likho: "practice tool hai, diagnosis nahi". |
| Bacchon ki awaz ka data | Sab phone par rakho. Cloud sirf parent ki ijazat se. |
| Sab bacche alag bolte hain (lisp, accent) | Pehle SLP ke saath test karo aur scoring ko "narmi" se rakho. |

---

## 8. Agla Qadam

Agar aap chahen to main yeh sab se pehle shuru karun:
1. Asli speech scoring ka plug-in (SpeechSuper) lagana.
2. PIN ka raasta theek karna.
3. Test files likhna.

Bas bata dein kaunsa pehle chahiye.
