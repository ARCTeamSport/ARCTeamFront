import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import ConversationItem from './components/ConversationItem';

const MOCK_CONVERSATIONS = [
    {
        name: 'Ahmet Yılmaz',
        lastMessage: 'Bugünkü antrenmanı tamamladım, çok iyi hissediyorum!',
        time: '12:30',
        unread: 2,
        role: 'athlete' as const,
    },
    {
        name: 'Elif Kaya',
        lastMessage: 'Koçum yarışma diyetinde değişiklik yapabilir miyiz?',
        time: '11:45',
        unread: 1,
        role: 'competitor' as const,
    },
    {
        name: 'Mehmet Demir',
        lastMessage: 'Omzum biraz ağrıyor, yarın antrenman yapabilir miyim?',
        time: '10:20',
        unread: 0,
        role: 'athlete' as const,
    },
    {
        name: 'Zeynep Çelik',
        lastMessage: 'Kilo güncellendi: 58.2 kg, hedefe yaklaşıyoruz!',
        time: 'Dün',
        unread: 0,
        role: 'competitor' as const,
    },
    {
        name: 'Can Aksoy',
        lastMessage: 'Protein tozu önerisi var mı?',
        time: 'Dün',
        unread: 3,
        role: 'athlete' as const,
    },
    {
        name: 'Selin Öztürk',
        lastMessage: 'Teşekkürler, yeni programı uygulamaya başladım.',
        time: 'Pzt',
        unread: 0,
        role: 'athlete' as const,
    },
    {
        name: 'Burak Şahin',
        lastMessage: 'Yarışma 3 hafta sonra, hazırlık nasıl gidiyor?',
        time: 'Pzt',
        unread: 0,
        role: 'competitor' as const,
    },
];

export default function MessagesScreen() {
    const insets = useSafeAreaInsets();
    const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Mesajlar</Text>
                {totalUnread > 0 && (
                    <View style={styles.totalUnread}>
                        <Text style={styles.totalUnreadText}>{totalUnread} yeni</Text>
                    </View>
                )}
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={CoachTheme.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Mesajlarda ara..."
                    placeholderTextColor={CoachTheme.textMuted}
                />
            </View>

            {/* Conversation List */}
            <ScrollView
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {MOCK_CONVERSATIONS.map((conv, index) => (
                    <ConversationItem
                        key={index}
                        name={conv.name}
                        lastMessage={conv.lastMessage}
                        time={conv.time}
                        unread={conv.unread}
                        role={conv.role}
                        onPress={() => { }}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    totalUnread: {
        backgroundColor: CoachTheme.unreadBadge,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    totalUnreadText: {
        color: CoachTheme.text,
        fontSize: 12,
        fontWeight: '700',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        marginHorizontal: 20,
        paddingHorizontal: 14,
        gap: 10,
        marginBottom: 8,
    },
    searchInput: {
        flex: 1,
        color: CoachTheme.text,
        fontSize: 14,
        paddingVertical: 11,
    },
    listContent: {
        paddingBottom: 100,
    },
});
