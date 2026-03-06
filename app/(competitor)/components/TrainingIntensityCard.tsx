import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CompetitorTheme } from '@/constants/theme';

interface DayIntensity {
    day: string;
    intensity: number; // 0-1
    isToday: boolean;
}

const weekData: DayIntensity[] = [
    { day: 'Pzt', intensity: 0.9, isToday: false },
    { day: 'Sal', intensity: 0.75, isToday: false },
    { day: 'Çar', intensity: 0.6, isToday: false },
    { day: 'Per', intensity: 0.95, isToday: true },
    { day: 'Cum', intensity: 0, isToday: false },
    { day: 'Cmt', intensity: 0, isToday: false },
    { day: 'Paz', intensity: 0, isToday: false },
];

export default function TrainingIntensityCard() {
    const maxBarHeight = 80;

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Antrenman Yoğunluğu</Text>
                    <Text style={styles.subtitle}>Bu haftaki performansın</Text>
                </View>
                <View style={styles.avgBadge}>
                    <Text style={styles.avgValue}>82%</Text>
                    <Text style={styles.avgLabel}>ORT</Text>
                </View>
            </View>

            <View style={styles.chartRow}>
                {weekData.map((item, index) => (
                    <View key={index} style={styles.barColumn}>
                        <View style={styles.barContainer}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: Math.max(item.intensity * maxBarHeight, 4),
                                        backgroundColor: item.isToday
                                            ? CompetitorTheme.accent
                                            : item.intensity > 0
                                                ? CompetitorTheme.accentLight
                                                : CompetitorTheme.ringTrack,
                                    },
                                    item.isToday && styles.barToday,
                                ]}
                            />
                        </View>
                        <Text style={[
                            styles.dayLabel,
                            item.isToday && styles.dayLabelToday,
                        ]}>
                            {item.day}
                        </Text>
                        {item.intensity > 0 && (
                            <Text style={[
                                styles.percentLabel,
                                item.isToday && styles.percentToday,
                            ]}>
                                {Math.round(item.intensity * 100)}%
                            </Text>
                        )}
                    </View>
                ))}
            </View>

            {/* Week summary */}
            <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>4</Text>
                    <Text style={styles.summaryLabel}>Antrenman</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>5.2</Text>
                    <Text style={styles.summaryLabel}>Saat</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>2840</Text>
                    <Text style={styles.summaryLabel}>kcal</Text>
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
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        color: CompetitorTheme.text,
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        color: CompetitorTheme.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    avgBadge: {
        backgroundColor: CompetitorTheme.accentDim,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
    },
    avgValue: {
        color: CompetitorTheme.accent,
        fontSize: 16,
        fontWeight: '800',
    },
    avgLabel: {
        color: CompetitorTheme.textMuted,
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 18,
        paddingHorizontal: 4,
    },
    barColumn: {
        alignItems: 'center',
        flex: 1,
    },
    barContainer: {
        height: 80,
        justifyContent: 'flex-end',
        marginBottom: 6,
    },
    bar: {
        width: 22,
        borderRadius: 6,
    },
    barToday: {
        shadowColor: CompetitorTheme.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    dayLabel: {
        color: CompetitorTheme.textMuted,
        fontSize: 10,
        fontWeight: '600',
    },
    dayLabelToday: {
        color: CompetitorTheme.accent,
        fontWeight: '800',
    },
    percentLabel: {
        color: CompetitorTheme.textMuted,
        fontSize: 9,
        fontWeight: '600',
        marginTop: 2,
    },
    percentToday: {
        color: CompetitorTheme.accent,
    },
    summaryRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: CompetitorTheme.cardBorder,
        paddingTop: 14,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        color: CompetitorTheme.text,
        fontSize: 18,
        fontWeight: '800',
    },
    summaryLabel: {
        color: CompetitorTheme.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    summaryDivider: {
        width: 1,
        backgroundColor: CompetitorTheme.cardBorder,
    },
});
