# Hope Bridge Digital Promotion in Angel Artic

## Purpose

Introduce Angel Artic users and their families to Hope Bridge Digital, identify the publisher, and provide simple ways to visit the website or contact the publisher. The promotion is kept brief in the app rather than showing a long product catalog.

## What Users See

The **About Hope Bridge Digital** screen has two cards:

1. **Publisher introduction:** Shows the Hope Bridge Digital name, star mark, tagline, and mission statement. It also displays four short labels: “100% Private & Offline,” “SLP Guided,” “Zero Ads or Tracking,” and “Bilingual (EN & AR).” Buttons open the publisher website or start an email.
2. **Closing invitation:** Says “Empowering Every Child's Unique Voice,” gives a short description of the publisher, and repeats the website and contact actions.

The screen no longer includes detailed cards for all five apps, the BloomLearn workflow, the company pillars, or the long safety-standards list. This keeps the publisher introduction short and easy to scan.

## Where the Promotion Appears

- **Home screen:** A Hope Bridge banner names the publisher and its apps, shows the family-first tagline, and opens the About screen.
- **Parent Hub:** An “About Hope Bridge Digital” button opens the About screen.
- **Settings:** An “About Hope Bridge Digital” button opens the About screen.
- **Legal screen:** Publisher attribution and contact information are shown with a link to the About screen.
- **Angel Talk promo:** A publisher-attribution button links to the About screen.

## What the Buttons Do

- Website buttons open [hopebirdgedigital.site](https://hopebirdgedigital.site/).
- Contact buttons open an email to [hello@hopebridgedigital.com](mailto:hello@hopebridgedigital.com) with the subject “Hope Bridge Digital Inquiry.”
- In-app promotion buttons navigate to the Hope Bridge About screen.

## Implementation Files

- Publisher name, tagline, mission, website, and email: [src/data/hopeBridge.ts](src/data/hopeBridge.ts)
- Home promotion banner: [src/components.tsx](src/components.tsx) and [src/screens/Home.tsx](src/screens/Home.tsx)
- Two-card About screen: [src/screens/HopeBridgePromo.tsx](src/screens/HopeBridgePromo.tsx)
- Other in-app entry points: [src/screens/ParentHub.tsx](src/screens/ParentHub.tsx), [src/screens/Settings.tsx](src/screens/Settings.tsx), [src/screens/Legal.tsx](src/screens/Legal.tsx), and [src/screens/AngelTalkPromo.tsx](src/screens/AngelTalkPromo.tsx)

## Accuracy Note

The short labels on the publisher card make privacy, therapy-guidance, and language-support claims. Confirm each claim is accurate for the current app before publishing or changing promotional copy.
