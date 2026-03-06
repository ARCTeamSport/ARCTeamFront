import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AthleteTheme } from '@/constants/theme';
import AthleteActivityRing from './AthleteActivityRing';
import AthleteStatCard from './AthleteStatCard';

interface AthleteActivitySectionProps {
    stepsProgress?: number;
    calories?: number;
    waterGlasses?: number;
    steps?: number;
}

export default function AthleteActivitySection({
    stepsProgress = 0.65,
    calories = 420,
    waterGlasses = 8,
    steps = 6500,
}: AthleteActivitySectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bugünkü Aktivite</Text>
            <View style={styles.content}>
                <View style={styles.ringArea}>
                    <AthleteActivityRing progress={stepsProgress} size={110} strokeWidth={10} />
                    <View style={styles.ringLabel}>
                        <Text style={styles.ringValue}>{steps}</Text>
                        <Text style={styles.ringUnit}>adım</Text>
                    </View>
                </View>
                <View style={styles.statsColumn}>
                    <AthleteStatCard
                        label="Yakılan"
                        value={calories.toString()}
                        unit="kcal"
                        icon="flame-outline"
                        color={AthleteTheme.statCalorie}
                    />
                    <AthleteStatCard
                        label="Su"
                        value={waterGlasses.toString()}
                        unit="bardak"
                        icon="water-outline"
                        color={AthleteTheme.statWater}
                    />
                </View>
            </View>
            {/* Steps bar */}
            <View style={styles.stepsBar}>
                <View style={styles.stepsInfo}>
                    <Text style={styles.stepsValue}>
                        <Text style={{ fontWeight: '800', color: AthleteTheme.text }}>{steps}</Text>
                        <Text style={{ color: AthleteTheme.textSecondary }}> adım</Text>
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
        color: AthleteTheme.text,
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
        gap: 10,
    },
    stepsBar: {
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
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
        color: AthleteTheme.textMuted,
        fontSize: 12,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: AthleteTheme.ringTrack,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: AthleteTheme.accent,
    },
});
