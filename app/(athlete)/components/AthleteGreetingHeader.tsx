import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';

export default function AthleteGreetingHeader() {
    const now = new Date();
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]}`;

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.avatar}>
                    <Ionicons name="fitness" size={22} color={AthleteTheme.accent} />
                </View>
                <View>
                    <Text style={styles.greeting}>Merhaba, Sporcu 💪</Text>
                    <Text style={styles.date}>{dateStr}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
                <Ionicons name="notifications-outline" size={24} color={AthleteTheme.text} />
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
        backgroundColor: AthleteTheme.accentDim,
        borderWidth: 2,
        borderColor: AthleteTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        color: AthleteTheme.text,
        fontSize: 20,
        fontWeight: '700',
    },
    date: {
        color: AthleteTheme.textSecondary,
        fontSize: 13,
        marginTop: 2,
    },
    notifBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: AthleteTheme.cardBg,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
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
        backgroundColor: AthleteTheme.accent,
    },
});
