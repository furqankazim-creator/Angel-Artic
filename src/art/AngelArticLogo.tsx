import React from 'react';
import { Image, Platform, StyleProp, View, ViewStyle } from 'react-native';

const LOGO = require('../../assets/brand/navbar_logo.png');

export function AngelArticLogo({
  size = 46,
  style,
  borderRadius = 14,
}: {
  size?: number;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}) {
  const isCircle = borderRadius >= size / 2;
  const radius = isCircle ? Math.round(size / 2) : borderRadius;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (Platform.OS === 'web') {
    const src = typeof LOGO === 'string' ? LOGO : (LOGO as any)?.uri ?? LOGO;
    return (
      <View style={[containerStyle, style]}>
        <img
          src={src}
          style={{
            width: size,
            height: size,
            objectFit: 'cover',
            display: 'block',
            borderRadius: radius,
          }}
          alt="Angel Artic logo"
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Image
        source={LOGO}
        style={{ width: size, height: size, borderRadius: radius }}
        resizeMode="cover"
      />
    </View>
  );
}
