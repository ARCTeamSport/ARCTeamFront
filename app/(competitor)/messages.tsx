import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompetitorTheme } from '@/constants/theme';

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
        sender: 'Koç Mehmet',
        avatar: 'person-circle',
        message: 'Yarışma hazırlık programını güncelledim, yeni ağırlıkları kontrol et 🔥',
        time: '14:30',
        unread: true,
    },
    {
        id: '2',
        sender: 'Koç Mehmet',
        avatar: 'person-circle',
        message: 'Bugünkü Clean & Jerk tekniğin çok iyiydi, böyle devam!',
        time: 'Dün',
        unread: false,
    },
    {
        id: '3',
        sender: 'Diyetisyen Ayşe',
        avatar: 'person-circle',
        message: 'Yarışma öncesi beslenme planını hazırladım.',
        time: 'Pzt',
        unread: true,
    },
    {
        id: '4',
        sender: 'Koç Mehmet',
        avatar: 'person-circle',
        message: 'Kişisel rekoru kırdın! 125kg bench press 💪',
        time: 'Paz',
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
                        <Ionicons name={msg.avatar} size={44} color={CompetitorTheme.accent} />
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
        backgroundColor: CompetitorTheme.background,
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
        color: CompetitorTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
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
        backgroundColor: CompetitorTheme.accent,
        borderWidth: 2,
        borderColor: CompetitorTheme.cardBg,
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
        color: CompetitorTheme.text,
        fontSize: 15,
        fontWeight: '600',
    },
    senderNameUnread: {
        fontWeight: '700',
    },
    messageTime: {
        color: CompetitorTheme.textMuted,
        fontSize: 12,
    },
    messageText: {
        color: CompetitorTheme.textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    messageTextUnread: {
        color: CompetitorTheme.text,
    },
});
