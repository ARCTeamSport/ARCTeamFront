/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const AuthTheme = {
  background: '#0A0E10',
  cardBg: '#141A1E',
  cardBorder: '#1E2A30',
  accent: '#00E5A0',
  accentDim: 'rgba(0, 229, 160, 0.12)',
  accentGlow: 'rgba(0, 229, 160, 0.25)',
  text: '#FFFFFF',
  textSecondary: '#7A8A94',
  error: '#FF4D6A',
  inputBg: '#0F1418',
  divider: '#1A2228',
};

export const CoachTheme = {
  background: '#0A0E10',
  surface: '#111518',
  cardBg: '#141A1E',
  cardBorder: '#1E2A30',
  accent: '#00E5A0',
  accentDim: 'rgba(0, 229, 160, 0.12)',
  accentGlow: 'rgba(0, 229, 160, 0.25)',
  text: '#FFFFFF',
  textSecondary: '#7A8A94',
  textMuted: '#4A5660',
  ringTrack: '#1A2228',
  ringStroke: '#00E5A0',
  statCalorie: '#FF6B35',
  statWater: '#00D1FF',
  error: '#FF4D6A',
  tabBarBg: '#0D1114',
  tabBarBorder: '#1A2228',
};

export const AthleteTheme = {
  background: '#0A0E10',
  surface: '#111518',
  cardBg: '#141A1E',
  cardBorder: '#1E2A30',
  accent: '#00B4FF',
  accentDim: 'rgba(0, 180, 255, 0.12)',
  accentGlow: 'rgba(0, 180, 255, 0.25)',
  text: '#FFFFFF',
  textSecondary: '#7A8A94',
  textMuted: '#4A5660',
  ringTrack: '#1A2228',
  ringStroke: '#00B4FF',
  statCalorie: '#FF6B35',
  statWater: '#00D1FF',
  statProtein: '#A78BFA',
  statCarbs: '#FBBF24',
  statFat: '#F472B6',
  error: '#FF4D6A',
  tabBarBg: '#0D1114',
  tabBarBorder: '#1A2228',
  success: '#00E5A0',
  warning: '#FBBF24',
};

export const CompetitorTheme = {
  background: '#0A0E10',
  surface: '#111518',
  cardBg: '#141A1E',
  cardBorder: '#1E2A30',
  accent: '#FF6B2C',
  accentDim: 'rgba(255, 107, 44, 0.12)',
  accentGlow: 'rgba(255, 107, 44, 0.25)',
  accentLight: '#FF8F5E',
  text: '#FFFFFF',
  textSecondary: '#7A8A94',
  textMuted: '#4A5660',
  ringTrack: '#1A2228',
  ringStroke: '#FF6B2C',
  statCalorie: '#FF4D6A',
  statWater: '#00D1FF',
  statPower: '#A78BFA',
  statSpeed: '#FBBF24',
  statEndurance: '#34D399',
  error: '#FF4D6A',
  tabBarBg: '#0D1114',
  tabBarBorder: '#1A2228',
  success: '#00E5A0',
  warning: '#FBBF24',
  gold: '#FFD700',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
