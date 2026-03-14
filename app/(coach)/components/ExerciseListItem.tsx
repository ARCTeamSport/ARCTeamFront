import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface Props {
    name: string;
    category: string;
    hasVideo?: boolean;
    level?: string | null;
    goal?: string | null;
    intensityType?: string | null;
    onPress?: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
    Beginner: '#34C759',
    Intermediate: '#FF9F0A',
    Advanced: '#FF453A',
};

const LEVEL_TR: Record<string, string> = {
    Beginner: 'Başlangıç',
    Intermediate: 'Orta',
    Advanced: 'İleri',
};

const GOAL_COLORS: Record<string, string> = {
    Kutle: '#0A84FF',
    Definasyon: '#BF5AF2',
    Guc: '#FFD60A',
};

const GOAL_TR: Record<string, string> = {
    Kutle: 'Kütle',
    Definasyon: 'Definasyon',
    Guc: 'Güç',
};

const INTENSITY_COLORS: Record<string, string> = {
    Normal: '#8E8E93',
    Dropset: '#FF6B6B',
    Superset: '#5AC8FA',
    Pyramid: '#FF9F0A',
};

export default function ExerciseListItem({ name, category, hasVideo, level, goal, intensityType, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.thumbnail}>
                <Ionicons name="fitness" size={24} color={CoachTheme.accent} />
                {hasVideo && (
                    <View style={styles.videoBadge}>
                        <Ionicons name="play" size={10} color={CoachTheme.text} />
                    </View>
                )}
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.category}>{category}</Text>
                <View style={styles.badges}>
                    {level && LEVEL_COLORS[level] && (
                        <View style={[styles.badge, { backgroundColor: LEVEL_COLORS[level] + '22', borderColor: LEVEL_COLORS[level] }]}>
                            <Text style={[styles.badgeText, { color: LEVEL_COLORS[level] }]}>
                                {LEVEL_TR[level] ?? level}
                            </Text>
                        </View>
                    )}
                    {goal && GOAL_COLORS[goal] && (
                        <View style={[styles.badge, { backgroundColor: GOAL_COLORS[goal] + '22', borderColor: GOAL_COLORS[goal] }]}>
                            <Text style={[styles.badgeText, { color: GOAL_COLORS[goal] }]}>
                                {GOAL_TR[goal] ?? goal}
                            </Text>
                        </View>
                    )}
                    {intensityType && intensityType !== 'Normal' && INTENSITY_COLORS[intensityType] && (
                        <View style={[styles.badge, { backgroundColor: INTENSITY_COLORS[intensityType] + '22', borderColor: INTENSITY_COLORS[intensityType] }]}>
                            <Text style={[styles.badgeText, { color: INTENSITY_COLORS[intensityType] }]}>
                                {intensityType}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={CoachTheme.textMuted} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 12,
        marginHorizontal: 20,
        marginBottom: 8,
        gap: 12,
    },
    thumbnail: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: CoachTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: CoachTheme.accent,
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
        marginBottom: 2,
    },
    category: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        marginBottom: 4,
    },
    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
    },
});
