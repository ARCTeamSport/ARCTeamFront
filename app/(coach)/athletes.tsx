import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

export default function AthletesScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Sporcularım</Text>
            </View>
            <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                    <Ionicons name="people-outline" size={48} color={CoachTheme.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>Henüz sporcu eklenmedi</Text>
                <Text style={styles.emptyDesc}>Sporcularınızı buradan yönetebilirsiniz</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        color: CoachTheme.text,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    emptyDesc: {
        color: CoachTheme.textSecondary,
        fontSize: 14,
    },
});
