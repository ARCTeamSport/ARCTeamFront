import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';

interface Message {
    id: string;
    sender: string;
    avatar: keyof typeof Ionicons.glyphMap;
    message: string;
    time: string;
    unread: boolean;
}

const messages: Message[] = [
    {
        id: '1',
        sender: 'Koç Ahmet',
        avatar: 'person-circle',
        message: 'Bugünkü antrenman programını güncelledim, kontrol et 💪',
        time: '14:30',
        unread: true,
    },
    {
        id: '2',
        sender: 'Koç Ahmet',
        avatar: 'person-circle',
        message: 'Beslenme planına ara öğün ekledim.',
        time: 'Dün',
        unread: false,
    },
    {
        id: '3',
        sender: 'Koç Ahmet',
        avatar: 'person-circle',
        message: 'Harika ilerleme! Bu haftaki hedeflerini tutturmuşsun.',
        time: 'Pzt',
        unread: false,
    },
];

export default function MessagesScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mesajlar</Text>
            </View>

            {messages.map((msg) => (
                <TouchableOpacity key={msg.id} style={styles.messageRow} activeOpacity={0.7}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name={msg.avatar} size={44} color={AthleteTheme.accent} />
                        {msg.unread && <View style={styles.unreadDot} />}
                    </View>
                    <View style={styles.messageContent}>
                        <View style={styles.messageHeader}>
                            <Text style={[styles.senderName, msg.unread && styles.senderNameUnread]}>
                                {msg.sender}
                            </Text>
                            <Text style={styles.messageTime}>{msg.time}</Text>
                        </View>
                        <Text
                            style={[styles.messageText, msg.unread && styles.messageTextUnread]}
                            numberOfLines={2}
                        >
                            {msg.message}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: AthleteTheme.background,
    },
    content: {
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
    },
    headerTitle: {
        color: AthleteTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        padding: 14,
        marginBottom: 10,
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    unreadDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: AthleteTheme.accent,
        borderWidth: 2,
        borderColor: AthleteTheme.cardBg,
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    senderName: {
        color: AthleteTheme.text,
        fontSize: 15,
        fontWeight: '600',
    },
    senderNameUnread: {
        fontWeight: '700',
    },
    messageTime: {
        color: AthleteTheme.textMuted,
        fontSize: 12,
    },
    messageText: {
        color: AthleteTheme.textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    messageTextUnread: {
        color: AthleteTheme.text,
    },
});
