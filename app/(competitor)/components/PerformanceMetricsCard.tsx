import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompetitorTheme } from '@/constants/theme';

interface MetricItem {
    label: string;
    value: string;
    unit: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    change: string;
    changePositive: boolean;
}

const metrics: MetricItem[] = [
    {
        label: 'Kişisel Rekor',
        value: '125',
        unit: 'kg',
        icon: 'trophy',
        color: CompetitorTheme.gold,
        change: '+5kg',
        changePositive: true,
    },
    {
        label: 'Güç Skoru',
        value: '87',
        unit: 'puan',
        icon: 'flash',
        color: CompetitorTheme.statPower,
        change: '+3',
        changePositive: true,
    },
    {
        label: 'Hız',
        value: '4.8',
        unit: 'km/s',
        icon: 'speedometer',
        color: CompetitorTheme.statSpeed,
        change: '-0.2s',
        changePositive: true,
    },
    {
        label: 'Dayanıklılık',
        value: '92',
        unit: '%',
        icon: 'heart',
        color: CompetitorTheme.statEndurance,
        change: '+5%',
        changePositive: true,
    },
];

export default function PerformanceMetricsCard() {
    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.titleRow}>
                    <Ionicons name="stats-chart" size={20} color={CompetitorTheme.accent} />
                    <Text style={styles.title}>Performans Metrikleri</Text>
                </View>
                <Text style={styles.weekLabel}>Bu Hafta</Text>
            </View>

            <View style={styles.metricsGrid}>
                {metrics.map((metric, index) => (
                    <View key={index} style={styles.metricBox}>
                        <View style={[styles.metricIcon, { backgroundColor: `${metric.color}15` }]}>
                            <Ionicons name={metric.icon} size={18} color={metric.color} />
                        </View>
                        <Text style={styles.metricLabel}>{metric.label}</Text>
                        <View style={styles.metricValueRow}>
                            <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
                            <Text style={styles.metricUnit}>{metric.unit}</Text>
                        </View>
                        <View style={[
                            styles.changeBadge,
                            { backgroundColor: metric.changePositive ? 'rgba(0, 229, 160, 0.12)' : 'rgba(255, 77, 106, 0.12)' }
                        ]}>
                            <Ionicons
                                name={metric.changePositive ? 'trending-up' : 'trending-down'}
                                size={12}
                                color={metric.changePositive ? CompetitorTheme.success : CompetitorTheme.error}
                            />
                            <Text style={[
                                styles.changeText,
                                { color: metric.changePositive ? CompetitorTheme.success : CompetitorTheme.error }
                            ]}>
                                {metric.change}
                            </Text>
                        </View>
                    </View>
                ))}
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
        alignItems: 'center',
        marginBottom: 18,
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
    weekLabel: {
        color: CompetitorTheme.textMuted,
        fontSize: 12,
        fontWeight: '600',
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    metricBox: {
        width: '47%',
        backgroundColor: CompetitorTheme.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
        padding: 14,
        gap: 4,
    },
    metricIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    metricLabel: {
        color: CompetitorTheme.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },
    metricValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    metricUnit: {
        color: CompetitorTheme.textMuted,
        fontSize: 12,
        fontWeight: '500',
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    changeText: {
        fontSize: 11,
        fontWeight: '700',
    },
});
