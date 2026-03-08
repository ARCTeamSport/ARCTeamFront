import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface Props {
    name: string;
    role: 'athlete' | 'competitor';
    lastActive: string;
    completionRate: number;
    onPress: () => void;
}

export default function AthleteCard({ name, role, lastActive, completionRate, onPress }: Props) {
    const isCompetitor = role === 'competitor';
    const badgeColor = isCompetitor ? CoachTheme.badgeCompetitor : CoachTheme.badgeAthlete;
    const badgeBg = isCompetitor ? CoachTheme.badgeCompetitorDim : CoachTheme.badgeAthleteDim;
    const roleLabel = isCompetitor ? 'Yarışmacı' : 'Sporcu';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.leftSection}>
                <View style={[styles.avatar, { borderColor: badgeColor }]}>
                    <Ionicons name="person" size={20} color={badgeColor} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <View style={styles.metaRow}>
                        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                            <Text style={[styles.badgeLabel, { color: badgeColor }]}>{roleLabel}</Text>
                        </View>
                        <Text style={styles.lastActive}>{lastActive}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.rightSection}>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${completionRate}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>%{completionRate}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={CoachTheme.textMuted} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 14,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: CoachTheme.surface,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    name: {
        color: CoachTheme.text,
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    lastActive: {
        color: CoachTheme.textMuted,
        fontSize: 11,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    progressContainer: {
        alignItems: 'center',
        gap: 4,
    },
    progressBarBg: {
        width: 48,
        height: 4,
        borderRadius: 2,
        backgroundColor: CoachTheme.progressBg,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
        backgroundColor: CoachTheme.progressFill,
    },
    progressText: {
        color: CoachTheme.textSecondary,
        fontSize: 10,
        fontWeight: '600',
    },
});
