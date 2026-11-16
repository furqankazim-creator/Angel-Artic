import React from 'react';
import { Button, Card, Muted, Screen, T } from '../ui';
import { useNav } from '../nav';

export default function Legal() {
  const { go } = useNav();
  return (
    <Screen title="Privacy & Terms" onBack>
      <Card>
        <T k="heading">Privacy in one minute</T>
        {['Recordings and scores stay on this device.', 'No advertising and no tracking or analytics in child mode.', 'No chat and no child account.', 'The whole app is free. There are no purchases, subscriptions or ads.', 'Settings and reports sit behind the parent PIN. Links that leave the app ask a grown-up to type a number first.', 'Delete a child\'s data any time in Settings.']
          .map((t) => <T key={t} style={{ marginTop: 6 }}>• {t}</T>)}
      </Card>
      <Card>
        <T k="heading">Terms in one minute</T>
        {['Angel Artic is a practice tool, not a diagnosis.', 'It does not replace a speech-language pathologist or any professional help.', 'Scores are gentle practice feedback and may miss subtle errors, like a lisp or an almost-right /r/.']
          .map((t) => <T key={t} style={{ marginTop: 6 }}>• {t}</T>)}
      </Card>
      <Card>
        <T k="heading">About</T>
        <T style={{ marginTop: 6 }}>Angel Artic is made by Hope Bridge Digital, the team behind Angel Talk. Contact: hello@hopebridgedigital.com</T>
        <Button small label="Learn about Hope Bridge Digital ›" color="coral" onPress={() => go('HopeBridge')} style={{ marginTop: 10 }} />
      </Card>
      <Card>
        <T k="heading">Credits</T>
        {['Pictures: Fluent Emoji 3D by Microsoft Corporation, MIT License (github.com/microsoft/fluentui-emoji).', 'Fonts: Baloo 2, Nunito and Cairo, SIL Open Font License.']
          .map((t) => <T key={t} style={{ marginTop: 6 }}>• {t}</T>)}
      </Card>
      <Muted k="caption">Summary only. Have a lawyer review the full policy before a store launch.</Muted>
    </Screen>
  );
}
