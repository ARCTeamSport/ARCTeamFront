import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface Props {
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    role: 'athlete' | 'competitor';
    onPress: () => void;
}

export default function ConversationItem({
    name,
    lastMessage,
    time,
    unread,
    role,
    onPress,
}: Props) {
    const badgeColor = role === 'competitor' ? CoachTheme.badgeCompetitor : CoachTheme.badgeAthlete;

    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.avatar, { borderColor: badgeColor }]}>
                <Ionicons name="person" size={18} color={badgeColor} />
            </View>
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.message} numberOfLines={1}>{lastMessage}</Text>
                    {unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: CoachTheme.divider,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: CoachTheme.surface,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        color: CoachTheme.text,
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
    },
    time: {
        color: CoachTheme.textMuted,
        fontSize: 11,
        marginLeft: 8,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        flex: 1,
    },
    unreadBadge: {
        backgroundColor: CoachTheme.unreadBadge,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 8,
    },
    unreadText: {
        color: CoachTheme.text,
        fontSize: 11,
        fontWeight: '800',
    },
});
