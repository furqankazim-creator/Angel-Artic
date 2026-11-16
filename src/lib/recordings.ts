import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

/** Copies a recording or photo out of the cache so the system cannot delete it later. */
export async function persistFile(uri: string | undefined, prefix = 'rec'): Promise<string | undefined> {
  if (!uri) return undefined;
  if (Platform.OS === 'web') {
    if (uri.startsWith('blob:') && prefix === 'img') {
      try {
        const resp = await fetch(uri);
        const blob = await resp.blob();
        return await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve(uri);
          reader.readAsDataURL(blob);
        });
      } catch {
        return uri;
      }
    }
    return uri;
  }
  try {
    const src = new File(uri);
    const ext = src.extension || (prefix === 'img' ? '.jpg' : '.m4a');
    const dest = new File(Paths.document, `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`);
    src.copy(dest);
    return dest.uri;
  } catch {
    return uri;
  }
}
