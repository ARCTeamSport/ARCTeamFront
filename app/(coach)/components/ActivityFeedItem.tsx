import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

type ActivityType = 'workout' | 'weight' | 'nutrition' | 'message';

interface Props {
    type: ActivityType;
    athleteName: string;
    description: string;
    time: string;
}

const iconMap: Record<ActivityType, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
    workout: { name: 'barbell', color: CoachTheme.accent },
    weight: { name: 'scale', color: CoachTheme.neonBlue },
    nutrition: { name: 'nutrition', color: CoachTheme.statCalorie },
    message: { name: 'chatbubble', color: CoachTheme.warning },
};

export default function ActivityFeedItem({ type, athleteName, description, time }: Props) {
    const icon = iconMap[type];

    return (
        <View style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: `${icon.color}15` }]}>
                <Ionicons name={icon.name} size={18} color={icon.color} />
            </View>
            <View style={styles.content}>
                <Text style={styles.text}>
                    <Text style={styles.name}>{athleteName}</Text> {description}
                </Text>
                <Text style={styles.time}>{time}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: CoachTheme.divider,
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    text: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    name: {
        color: CoachTheme.text,
        fontWeight: '700',
    },
    time: {
        color: CoachTheme.textMuted,
        fontSize: 11,
        marginTop: 3,
    },
});
