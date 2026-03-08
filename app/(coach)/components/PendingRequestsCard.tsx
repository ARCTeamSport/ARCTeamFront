import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface PendingAthlete {
    name: string;
    type: 'program' | 'nutrition' | 'review';
    daysWaiting: number;
}

const MOCK_PENDING: PendingAthlete[] = [
    { name: 'Elif Kaya', type: 'program', daysWaiting: 3 },
    { name: 'Can Aksoy', type: 'nutrition', daysWaiting: 1 },
    { name: 'Selin Öztürk', type: 'review', daysWaiting: 5 },
];

const typeLabels: Record<string, string> = {
    program: 'Program Güncelleme',
    nutrition: 'Beslenme Planı',
    review: 'Performans İnceleme',
};

const typeColors: Record<string, string> = {
    program: CoachTheme.accent,
    nutrition: CoachTheme.statCalorie,
    review: CoachTheme.neonBlue,
};

export default function PendingRequestsCard() {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.alertDot} />
                    <Text style={styles.title}>Bekleyen İstekler</Text>
                </View>
                <Text style={styles.count}>{MOCK_PENDING.length}</Text>
            </View>

            {MOCK_PENDING.map((item, index) => (
                <TouchableOpacity key={index} style={styles.row} activeOpacity={0.7}>
                    <View style={styles.avatarSmall}>
                        <Ionicons name="person" size={16} color={CoachTheme.textSecondary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.badgeRow}>
                            <View
                                style={[
                                    styles.badge,
                                    { backgroundColor: `${typeColors[item.type]}15` },
                                ]}
                            >
                                <Text
                                    style={[styles.badgeText, { color: typeColors[item.type] }]}
                                >
                                    {typeLabels[item.type]}
                                </Text>
                            </View>
                            <Text style={styles.waiting}>{item.daysWaiting} gün</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={CoachTheme.textMuted} />
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        marginHorizontal: 20,
        marginBottom: 16,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    alertDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: CoachTheme.error,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 16,
        fontWeight: '700',
    },
    count: {
        color: CoachTheme.error,
        fontSize: 14,
        fontWeight: '800',
        backgroundColor: 'rgba(255, 77, 106, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: CoachTheme.divider,
    },
    avatarSmall: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: CoachTheme.surface,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    name: {
        color: CoachTheme.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    waiting: {
        color: CoachTheme.textMuted,
        fontSize: 11,
    },
});
