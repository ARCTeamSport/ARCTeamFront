import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

export default function RecommendationCard() {
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
                Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.15, 0.4],
    });

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <Text style={styles.label}>AI Önerileri</Text>
                <Text style={styles.title}>Antrenman planınızı{'\n'}başlatın.</Text>
                <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
                    <Ionicons name="play" size={14} color={CoachTheme.background} />
                    <Text style={styles.startText}>Başla</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.iconArea}>
                <Animated.View style={[styles.glowCircle, { opacity: glowOpacity }]} />
                <View style={styles.brainCircle}>
                    <Ionicons name="hardware-chip-outline" size={36} color={CoachTheme.accent} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 24,
        marginBottom: 16,
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        backgroundColor: CoachTheme.accent,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 25,
    },
    startText: {
        color: CoachTheme.background,
        fontSize: 14,
        fontWeight: '700',
    },
    iconArea: {
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowCircle: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: CoachTheme.accent,
    },
    brainCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: CoachTheme.accentDim,
        borderWidth: 1.5,
        borderColor: CoachTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
