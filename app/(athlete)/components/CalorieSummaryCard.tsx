import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';
import AthleteActivityRing from './AthleteActivityRing';

interface MacroBarProps {
    label: string;
    current: number;
    target: number;
    color: string;
    unit?: string;
}

function MacroBar({ label, current, target, color, unit = 'g' }: MacroBarProps) {
    const progress = Math.min(current / target, 1);
    return (
        <View style={macroStyles.container}>
            <View style={macroStyles.header}>
                <Text style={macroStyles.label}>{label}</Text>
                <Text style={macroStyles.value}>
                    <Text style={{ color, fontWeight: '700' }}>{current}</Text>
                    <Text style={{ color: AthleteTheme.textMuted }}>/{target}{unit}</Text>
                </Text>
            </View>
            <View style={macroStyles.track}>
                <View style={[macroStyles.fill, { width: `${progress * 100}%`, backgroundColor: color }]} />
            </View>
        </View>
    );
}

const macroStyles = StyleSheet.create({
    container: {
        gap: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: AthleteTheme.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    value: {
        fontSize: 12,
    },
    track: {
        height: 6,
        borderRadius: 3,
        backgroundColor: AthleteTheme.ringTrack,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 3,
    },
});

export default function CalorieSummaryCard() {
    const consumed = 1650;
    const burned = 420;
    const target = 2200;
    const remaining = target - consumed + burned;
    const progress = Math.min(consumed / target, 1);

    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
                Animated.timing(glowAnim, { toValue: 0, duration: 2500, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.08, 0.2],
    });

    return (
        <View style={styles.card}>
            {/* Glow effect */}
            <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

            <Text style={styles.title}>Kalori Özeti</Text>

            <View style={styles.ringRow}>
                <View style={styles.ringArea}>
                    <AthleteActivityRing
                        progress={progress}
                        size={100}
                        strokeWidth={9}
                        color={AthleteTheme.accent}
                    />
                    <View style={styles.ringLabel}>
                        <Text style={styles.ringValue}>{remaining}</Text>
                        <Text style={styles.ringUnit}>kalan</Text>
                    </View>
                </View>

                <View style={styles.statsColumn}>
                    <View style={styles.statRow}>
                        <View style={[styles.statDot, { backgroundColor: AthleteTheme.accent }]} />
                        <View>
                            <Text style={styles.statLabel}>Alınan</Text>
                            <Text style={styles.statValue}>{consumed} <Text style={styles.statUnit}>kcal</Text></Text>
                        </View>
                    </View>
                    <View style={styles.statRow}>
                        <View style={[styles.statDot, { backgroundColor: AthleteTheme.statCalorie }]} />
                        <View>
                            <Text style={styles.statLabel}>Yakılan</Text>
                            <Text style={styles.statValue}>{burned} <Text style={styles.statUnit}>kcal</Text></Text>
                        </View>
                    </View>
                    <View style={styles.statRow}>
                        <View style={[styles.statDot, { backgroundColor: AthleteTheme.textMuted }]} />
                        <View>
                            <Text style={styles.statLabel}>Hedef</Text>
                            <Text style={styles.statValue}>{target} <Text style={styles.statUnit}>kcal</Text></Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Macro bars */}
            <View style={styles.macroSection}>
                <Text style={styles.macroTitle}>Makro Besinler</Text>
                <MacroBar label="Protein" current={95} target={140} color={AthleteTheme.statProtein} />
                <MacroBar label="Karbonhidrat" current={180} target={260} color={AthleteTheme.statCarbs} />
                <MacroBar label="Yağ" current={45} target={70} color={AthleteTheme.statFat} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    glow: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: AthleteTheme.accent,
    },
    title: {
        color: AthleteTheme.text,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    ringRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 20,
    },
    ringArea: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringLabel: {
        position: 'absolute',
        alignItems: 'center',
    },
    ringValue: {
        color: AthleteTheme.text,
        fontSize: 20,
        fontWeight: '800',
    },
    ringUnit: {
        color: AthleteTheme.textSecondary,
        fontSize: 11,
        marginTop: -2,
    },
    statsColumn: {
        flex: 1,
        gap: 12,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    statLabel: {
        color: AthleteTheme.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },
    statValue: {
        color: AthleteTheme.text,
        fontSize: 15,
        fontWeight: '700',
    },
    statUnit: {
        color: AthleteTheme.textSecondary,
        fontSize: 12,
        fontWeight: '500',
    },
    macroSection: {
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: AthleteTheme.cardBorder,
        paddingTop: 16,
    },
    macroTitle: {
        color: AthleteTheme.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
});
