import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface StatCardProps {
    label: string;
    value: string;
    unit: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

export default function StatCard({ label, value, unit, icon, color }: StatCardProps) {
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
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 14,
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    label: {
        color: CoachTheme.textSecondary,
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
        color: CoachTheme.textSecondary,
        fontSize: 13,
        fontWeight: '500',
    },
});
