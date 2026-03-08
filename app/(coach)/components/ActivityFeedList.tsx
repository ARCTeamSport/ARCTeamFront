import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CoachTheme } from '@/constants/theme';
import ActivityFeedItem from './ActivityFeedItem';

const MOCK_ACTIVITIES = [
    {
        type: 'workout' as const,
        athleteName: 'Ahmet Yılmaz',
        description: 'Bacak Günü antrenmanını tamamladı',
        time: '12 dk önce',
    },
    {
        type: 'weight' as const,
        athleteName: 'Elif Kaya',
        description: 'kilosunu güncelledi: 62.5 kg',
        time: '34 dk önce',
    },
    {
        type: 'nutrition' as const,
        athleteName: 'Mehmet Demir',
        description: 'öğle yemeğini kaydetti — 680 kcal',
        time: '1 saat önce',
    },
    {
        type: 'workout' as const,
        athleteName: 'Zeynep Çelik',
        description: 'Göğüs & Triceps antrenmanını tamamladı',
        time: '2 saat önce',
    },
    {
        type: 'message' as const,
        athleteName: 'Can Aksoy',
        description: 'size mesaj gönderdi',
        time: '3 saat önce',
    },
];

export default function ActivityFeedList() {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Son Aktiviteler</Text>
                <Text style={styles.seeAll}>Tümü</Text>
            </View>
            {MOCK_ACTIVITIES.map((activity, index) => (
                <ActivityFeedItem key={index} {...activity} />
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
        paddingBottom: 8,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 16,
        fontWeight: '700',
    },
    seeAll: {
        color: CoachTheme.accent,
        fontSize: 13,
        fontWeight: '600',
    },
});
