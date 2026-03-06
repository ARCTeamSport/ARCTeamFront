import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';

interface AthleteStatCardProps {
    label: string;
    value: string;
    unit: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

export default function AthleteStatCard({ label, value, unit, icon, color }: AthleteStatCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Ionicons name={icon} size={16} color={color} />
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.valueRow}>
                <Text style={[styles.value, { color }]}>{value}</Text>
                <Text style={styles.unit}>{unit}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        padding: 14,
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    label: {
        color: AthleteTheme.textSecondary,
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    value: {
        fontSize: 26,
        fontWeight: '800',
    },
    unit: {
        color: AthleteTheme.textSecondary,
        fontSize: 13,
        fontWeight: '500',
    },
});
