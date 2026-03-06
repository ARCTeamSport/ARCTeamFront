import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CoachTheme } from '@/constants/theme';
import ActivityRing from './ActivityRing';
import StatCard from './StatCard';

interface ActivitySectionProps {
    stepsProgress?: number;
    calories?: number;
    waterGlasses?: number;
    steps?: number;
}

export default function ActivitySection({
    stepsProgress = 0.6,
    calories = 480,
    waterGlasses = 12,
    steps = 6000,
}: ActivitySectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bugünkü Aktivite</Text>
            <View style={styles.content}>
                <View style={styles.ringArea}>
                    <ActivityRing progress={stepsProgress} size={110} strokeWidth={10} />
                    <View style={styles.ringLabel}>
                        <Text style={styles.ringValue}>{steps}</Text>
                        <Text style={styles.ringUnit}>adım</Text>
                    </View>
                </View>
                <View style={styles.statsColumn}>
                    <StatCard
                        label="Kalori"
                        value={calories.toString()}
                        unit="kcal"
                        icon="flame-outline"
                        color={CoachTheme.statCalorie}
                    />
                    <StatCard
                        label="Su"
                        value={waterGlasses.toString()}
                        unit="bardak"
                        icon="water-outline"
                        color={CoachTheme.statWater}
                    />
                </View>
            </View>
            {/* Steps bar */}
            <View style={styles.stepsBar}>
                <View style={styles.stepsInfo}>
                    <Text style={styles.stepsValue}>
                        <Text style={{ fontWeight: '800', color: CoachTheme.text }}>{steps}</Text>
                        <Text style={{ color: CoachTheme.textSecondary }}> adım</Text>
                    </Text>
                    <Text style={styles.stepsGoal}>Hedef: 10.000</Text>
                </View>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.min(stepsProgress * 100, 100)}%` }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    content: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 16,
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
        color: CoachTheme.text,
        fontSize: 20,
        fontWeight: '800',
    },
    ringUnit: {
        color: CoachTheme.textSecondary,
        fontSize: 11,
        marginTop: -2,
    },
    statsColumn: {
        flex: 1,
        gap: 10,
    },
    stepsBar: {
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 14,
    },
    stepsInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    stepsValue: {
        fontSize: 15,
    },
    stepsGoal: {
        color: CoachTheme.textMuted,
        fontSize: 12,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: CoachTheme.ringTrack,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: CoachTheme.accent,
    },
});
