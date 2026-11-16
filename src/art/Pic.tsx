import React from 'react';
import { Image, Platform, Text, View } from 'react-native';
import { EMOJI } from '../data/emojiMap';
import { ART } from '../data/artMap';
import { slug } from '../lib/slug';

/**
 * A picture. If an illustration named after `name` is bundled it is used, otherwise the bundled
 * 3D picture (Microsoft Fluent Emoji, same on every phone, works offline), otherwise the emoji text.
 */
export function Pic({ emoji, size = 48, name }: { emoji: string; size?: number; name?: string }) {
  const art = name ? ART[slug(name)] : undefined;
  const src = art ?? EMOJI[emoji];
  if (!src) return <Text style={{ fontSize: size * 0.8, lineHeight: size * 1.05 }}>{emoji}</Text>;
  // Equalized scaling for all 3D pictures and illustrations so every icon has the exact same visual size
  const draw = Math.round(size * 1.15);
  const off = Math.round((size - draw) / 2);
  if (Platform.OS === 'web') {
    return (
      <div style={{ width: size, height: size, position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={typeof src === 'string' ? src : (src as any)?.uri ?? src}
          style={{ width: draw, height: draw, objectFit: 'contain' }}
          alt={name ?? emoji}
        />
      </div>
    );
  }
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }} accessibilityElementsHidden>
      <Image source={src} style={{ width: draw, height: draw }} resizeMode="contain" />
    </View>
  );
}
