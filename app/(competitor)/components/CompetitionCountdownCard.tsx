import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompetitorTheme } from '@/constants/theme';

export default function CompetitionCountdownCard() {
    // Next competition date (example: 15 days from now)
    const competitionDate = new Date();
    competitionDate.setDate(competitionDate.getDate() + 15);

    const now = new Date();
    const diff = competitionDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const glowAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
                Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 0.3],
    });

    return (
        <View style={styles.card}>
            {/* Animated glow */}
            <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
            <Animated.View style={[styles.glowLeft, { opacity: glowOpacity }]} />

            <View style={styles.headerRow}>
                <View style={styles.titleRow}>
                    <Ionicons name="trophy" size={22} color={CompetitorTheme.gold} />
                    <Text style={styles.title}>Sonraki Yarışma</Text>
                </View>
                <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>AKTİF</Text>
                </View>
            </View>

            <Text style={styles.competitionName}>Türkiye Şampiyonası 2026</Text>
            <Text style={styles.competitionDate}>23 Mart 2026 · İstanbul</Text>

            {/* Countdown boxes */}
            <Animated.View style={[styles.countdownRow, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.countdownBox}>
                    <Text style={styles.countdownValue}>{days}</Text>
                    <Text style={styles.countdownLabel}>GÜN</Text>
                </View>
                <Text style={styles.countdownSeparator}>:</Text>
                <View style={styles.countdownBox}>
                    <Text style={styles.countdownValue}>{hours}</Text>
                    <Text style={styles.countdownLabel}>SAAT</Text>
                </View>
                <Text style={styles.countdownSeparator}>:</Text>
                <View style={styles.countdownBox}>
                    <Text style={styles.countdownValue}>{minutes}</Text>
                    <Text style={styles.countdownLabel}>DAKİKA</Text>
                </View>
            </Animated.View>

            {/* Preparation progress */}
            <View style={styles.prepSection}>
                <View style={styles.prepHeader}>
                    <Text style={styles.prepTitle}>Hazırlık Durumu</Text>
                    <Text style={styles.prepPercent}>72%</Text>
                </View>
                <View style={styles.prepTrack}>
                    <View style={[styles.prepFill, { width: '72%' }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    glow: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: CompetitorTheme.accent,
    },
    glowLeft: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: CompetitorTheme.gold,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        color: CompetitorTheme.text,
        fontSize: 18,
        fontWeight: '700',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 107, 44, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: CompetitorTheme.accent,
    },
    liveText: {
        color: CompetitorTheme.accent,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    competitionName: {
        color: CompetitorTheme.gold,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    competitionDate: {
        color: CompetitorTheme.textSecondary,
        fontSize: 13,
        marginBottom: 20,
    },
    countdownRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    countdownBox: {
        backgroundColor: CompetitorTheme.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CompetitorTheme.accent,
        paddingVertical: 12,
        paddingHorizontal: 18,
        alignItems: 'center',
        minWidth: 72,
    },
    countdownValue: {
        color: CompetitorTheme.accent,
        fontSize: 28,
        fontWeight: '900',
    },
    countdownLabel: {
        color: CompetitorTheme.textSecondary,
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: 2,
    },
    countdownSeparator: {
        color: CompetitorTheme.accent,
        fontSize: 28,
        fontWeight: '800',
    },
    prepSection: {
        borderTopWidth: 1,
        borderTopColor: CompetitorTheme.cardBorder,
        paddingTop: 14,
    },
    prepHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    prepTitle: {
        color: CompetitorTheme.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    prepPercent: {
        color: CompetitorTheme.accent,
        fontSize: 14,
        fontWeight: '800',
    },
    prepTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: CompetitorTheme.ringTrack,
        overflow: 'hidden',
    },
    prepFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: CompetitorTheme.accent,
    },
});
