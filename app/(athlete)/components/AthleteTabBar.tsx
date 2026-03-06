import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabConfig {
    name: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconActive: keyof typeof Ionicons.glyphMap;
}

const TABS: TabConfig[] = [
    { name: 'index', label: 'Ana Sayfa', icon: 'home-outline', iconActive: 'home' },
    { name: 'program', label: 'Programım', icon: 'barbell-outline', iconActive: 'barbell' },
    { name: 'messages', label: 'Mesajlar', icon: 'chatbubble-outline', iconActive: 'chatbubble' },
    { name: 'profile', label: 'Profil', icon: 'person-outline', iconActive: 'person' },
];

const TAB_COUNT = TABS.length;
const TAB_BAR_HORIZONTAL_PADDING = 16;
const USABLE_WIDTH = SCREEN_WIDTH - TAB_BAR_HORIZONTAL_PADDING * 2;
const TAB_WIDTH = USABLE_WIDTH / TAB_COUNT;
const INDICATOR_WIDTH = 44;
const INDICATOR_OFFSET = (TAB_WIDTH - INDICATOR_WIDTH) / 2;

export default function AthleteTabBar({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const translateX = useRef(new Animated.Value(0)).current;
    const scaleAnims = useRef(TABS.map(() => new Animated.Value(1))).current;

    useEffect(() => {
        const targetX = state.index * TAB_WIDTH + INDICATOR_OFFSET;
        Animated.spring(translateX, {
            toValue: targetX,
            useNativeDriver: true,
            speed: 20,
            bounciness: 6,
        }).start();

        scaleAnims.forEach((anim, i) => {
            Animated.spring(anim, {
                toValue: i === state.index ? 1.15 : 1,
                useNativeDriver: true,
                speed: 20,
                bounciness: 8,
            }).start();
        });
    }, [state.index]);

    const handlePress = (index: number, routeName: string) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
        });

        if (!event.defaultPrevented && state.index !== index) {
            navigation.navigate(routeName);
        }
    };

    return (
        <View style={[styles.wrapper, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.indicator,
                        { transform: [{ translateX }] },
                    ]}
                />

                {TABS.map((tab, index) => {
                    const isActive = state.index === index;
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tab}
                            onPress={() => handlePress(index, tab.name)}
                            activeOpacity={0.7}
                        >
                            <Animated.View
                                style={[
                                    styles.iconWrapper,
                                    { transform: [{ scale: scaleAnims[index] }] },
                                ]}
                            >
                                <Ionicons
                                    name={isActive ? tab.iconActive : tab.icon}
                                    size={22}
                                    color={isActive ? AthleteTheme.accent : AthleteTheme.textMuted}
                                />
                            </Animated.View>
                            <Text
                                style={[
                                    styles.label,
                                    isActive && styles.labelActive,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: AthleteTheme.background,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: AthleteTheme.tabBarBg,
        marginHorizontal: TAB_BAR_HORIZONTAL_PADDING,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: AthleteTheme.tabBarBorder,
        height: 64,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    indicator: {
        position: 'absolute',
        top: 6,
        left: 0,
        width: INDICATOR_WIDTH,
        height: 4,
        borderRadius: 2,
        backgroundColor: AthleteTheme.accent,
        shadowColor: AthleteTheme.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingTop: 6,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: AthleteTheme.textMuted,
        fontSize: 10,
        fontWeight: '600',
    },
    labelActive: {
        color: AthleteTheme.accent,
    },
});
