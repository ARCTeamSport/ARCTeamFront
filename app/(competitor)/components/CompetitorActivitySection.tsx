import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CompetitorTheme } from '@/constants/theme';
import CompetitorActivityRing from './CompetitorActivityRing';
import CompetitorStatCard from './CompetitorStatCard';

interface CompetitorActivitySectionProps {
    stepsProgress?: number;
    calories?: number;
    trainingMin?: number;
    heartRate?: number;
}

export default function CompetitorActivitySection({
    stepsProgress = 0.78,
    calories = 680,
    trainingMin = 95,
    heartRate = 142,
}: CompetitorActivitySectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bugünkü Aktivite</Text>
            <View style={styles.content}>
                <View style={styles.ringArea}>
                    <CompetitorActivityRing progress={stepsProgress} size={110} strokeWidth={10} />
                    <View style={styles.ringLabel}>
                        <Text style={styles.ringValue}>{Math.round(stepsProgress * 100)}%</Text>
                        <Text style={styles.ringUnit}>tamamlandı</Text>
                    </View>
                </View>
                <View style={styles.statsColumn}>
                    <CompetitorStatCard
                        label="Yakılan"
                        value={calories.toString()}
                        unit="kcal"
                        icon="flame-outline"
                        color={CompetitorTheme.statCalorie}
                    />
                    <CompetitorStatCard
                        label="Antrenman"
                        value={trainingMin.toString()}
                        unit="dk"
                        icon="timer-outline"
                        color={CompetitorTheme.accent}
                    />
                </View>
            </View>
            {/* Heart rate bar */}
            <View style={styles.heartBar}>
                <View style={styles.heartInfo}>
                    <Text style={styles.heartLabel}>
                        <Text style={{ fontWeight: '800', color: CompetitorTheme.statCalorie }}>❤️ {heartRate}</Text>
                        <Text style={{ color: CompetitorTheme.textSecondary }}> bpm</Text>
                    </Text>
                    <Text style={styles.heartZone}>Yüksek Yoğunluk</Text>
                </View>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.min((heartRate / 200) * 100, 100)}%` }]} />
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
        color: CompetitorTheme.text,
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
        color: CompetitorTheme.text,
        fontSize: 20,
        fontWeight: '800',
    },
    ringUnit: {
        color: CompetitorTheme.textSecondary,
        fontSize: 10,
        marginTop: -2,
    },
    statsColumn: {
        flex: 1,
        gap: 10,
    },
    heartBar: {
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
        padding: 14,
    },
    heartInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    heartLabel: {
        fontSize: 15,
    },
    heartZone: {
        color: CompetitorTheme.accent,
        fontSize: 12,
        fontWeight: '700',
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: CompetitorTheme.ringTrack,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: CompetitorTheme.statCalorie,
    },
});
