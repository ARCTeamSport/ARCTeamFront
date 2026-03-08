import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface Props {
    name: string;
    category: string;
    hasVideo?: boolean;
}

export default function ExerciseListItem({ name, category, hasVideo }: Props) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
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
    },
});
