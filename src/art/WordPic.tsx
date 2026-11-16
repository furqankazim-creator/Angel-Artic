import React from 'react';
import { Image, Platform } from 'react-native';
import type { Word } from '../data/sounds';
import { Pic } from './Pic';

/** A word's picture: the parent's own photo for custom words, otherwise the bundled illustration. */
export function WordPic({ w, size = 48 }: { w: Pick<Word, 'emoji' | 'imageUri'> & { word?: string }; size?: number }) {
  if (w.imageUri) {
    if (Platform.OS === 'web') {
      return <img src={w.imageUri} style={{ width: size, height: size, borderRadius: size / 5, objectFit: 'cover' }} alt="word" />;
    }
    return <Image source={{ uri: w.imageUri }} style={{ width: size, height: size, borderRadius: size / 5 }} resizeMode="cover" />;
  }
  return <Pic emoji={w.emoji} size={size} name={w.word} />;
}
