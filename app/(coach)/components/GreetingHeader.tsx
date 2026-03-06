import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

export default function GreetingHeader() {
    const now = new Date();
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]}`;

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={22} color={CoachTheme.accent} />
                </View>
                <View>
                    <Text style={styles.greeting}>Merhaba, Koç 👋</Text>
                    <Text style={styles.date}>{dateStr}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
                <Ionicons name="notifications-outline" size={24} color={CoachTheme.text} />
                <View style={styles.notifDot} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: CoachTheme.accentDim,
        borderWidth: 2,
        borderColor: CoachTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        color: CoachTheme.text,
        fontSize: 20,
        fontWeight: '700',
    },
    date: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        marginTop: 2,
    },
    notifBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifDot: {
        position: 'absolute',
        top: 10,
        right: 11,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: CoachTheme.accent,
    },
});
