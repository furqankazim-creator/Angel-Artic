# Beta test plan (20 to 30 families and 2 to 3 therapists)

**Goal:** find out, before the public launch, whether children understand the app, whether it works on real phones, whether anything crashes, and whether the scoring feels fair.

## Who
- **20 to 30 families** with a child aged 3 to 8. Mix of iPhone and Android, small and large phones, and some with slow internet. Ask for at least 2 children who have a speech delay, with the parent's permission.
- **2 to 3 speech-language therapists** as reviewers (not as users). They fill in the two sheets `therapist-review-words.csv` and `therapist-review-sounds.csv`.

## How long
- 2 weeks of use, with a 5-minute form after day 3 and after day 14.
- Google Play needs 12 testers for 14 days in a row before a new developer account can publish, so these families can count as those 12.

## How to install
- **iPhone:** TestFlight (up to 10,000 testers). You send an invite link.
- **Android:** Google Play closed testing. Add testers' Google emails, send the opt-in link.

## Message to families (copy and edit)
> Hello! We are building Angel Artic, a gentle app that helps children practise speech sounds. It is free, has no ads, and keeps recordings on your phone. Would your family try it for two weeks and tell us what you think? It takes about 10 minutes a day. We will send you a link. Thank you!

## Message to therapists (copy and edit)
> We are building a speech-sound practice app for ages 3 to 8 and want an expert to check it. It would take about 2 hours: please read the word lists and the sound information in the two attached sheets and mark anything that is wrong, too hard or too easy for the age, or has a poor picture. We would be glad to credit you in the app if you wish.

## Feedback form (put these in a Google Form)
After day 3 and after day 14:
1. Your phone and its model.
2. How old is your child?
3. Did your child understand what to do without help? (yes / mostly / no)
4. Did your child enjoy it? (1 to 5)
5. Did the microphone work the first time? (yes / no, what happened)
6. Did the app ever freeze or close by itself? When?
7. Was the scoring fair? Was it ever too hard on your child, or too easy? Give an example word.
8. Was any word, picture or sentence confusing or wrong? Which one?
9. Was the voice clear and pleasant? (1 to 5)
10. What did you like most? What is the one thing to change?
11. Would you recommend it to another parent? (0 to 10)

## What to measure
- Share of families still using it on day 14.
- Share of children who can start a practice with no help.
- Crashes per family (from the problem report in Settings).
- Average score for "fair scoring" and "voice" questions.

## Before you start
- Fix everything in `LAUNCH_CHECKLIST.md` steps 1 to 6 that you can.
- Use the real-phone test list at the bottom of that file yourself first.
