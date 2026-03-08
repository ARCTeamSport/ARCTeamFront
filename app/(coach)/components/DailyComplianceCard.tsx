import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CoachTheme } from '@/constants/theme';

interface Props {
    completed: number;
    total: number;
}

export default function DailyComplianceCard({ completed, total }: Props) {
    const animValue = useRef(new Animated.Value(0)).current;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    useEffect(() => {
        Animated.timing(animValue, {
            toValue: percentage,
            duration: 1200,
            useNativeDriver: false,
        }).start();
    }, [percentage]);

    const progressWidth = animValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.label}>GÜNLÜK UYUM</Text>
                <View style={styles.percentBadge}>
                    <Text style={styles.percentText}>%{percentage}</Text>
                </View>
            </View>

            <View style={styles.mainRow}>
                <View style={styles.ringWrapper}>
                    <View style={styles.ringOuter}>
                        <View style={styles.ringInner}>
                            <Text style={styles.ringValue}>{completed}</Text>
                            <Text style={styles.ringDivider}>/{total}</Text>
                        </View>
                    </View>
                    {/* Glow effect */}
                    <View style={styles.glow} />
                </View>

                <View style={styles.detailSection}>
                    <Text style={styles.detailTitle}>sporcu antrenmanını tamamladı</Text>

                    {/* Progress bar */}
                    <View style={styles.progressBar}>
                        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                    </View>

                    <View style={styles.statusRow}>
                        <View style={styles.statusItem}>
                            <View style={[styles.dot, { backgroundColor: CoachTheme.accent }]} />
                            <Text style={styles.statusText}>Tamamlanan</Text>
                        </View>
                        <View style={styles.statusItem}>
                            <View style={[styles.dot, { backgroundColor: CoachTheme.textMuted }]} />
                            <Text style={styles.statusText}>Bekleyen</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 18,
        marginHorizontal: 20,
        marginBottom: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    label: {
        color: CoachTheme.textSecondary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },
    percentBadge: {
        backgroundColor: CoachTheme.accentDim,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    percentText: {
        color: CoachTheme.accent,
        fontSize: 13,
        fontWeight: '800',
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    ringWrapper: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 5,
        borderColor: CoachTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    ringInner: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    ringValue: {
        color: CoachTheme.accent,
        fontSize: 26,
        fontWeight: '900',
    },
    ringDivider: {
        color: CoachTheme.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    glow: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: CoachTheme.accentGlow,
        opacity: 0.3,
        zIndex: -1,
    },
    detailSection: {
        flex: 1,
    },
    detailTitle: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        marginBottom: 12,
        lineHeight: 18,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: CoachTheme.progressBg,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: CoachTheme.progressFill,
    },
    statusRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        color: CoachTheme.textMuted,
        fontSize: 11,
    },
});
