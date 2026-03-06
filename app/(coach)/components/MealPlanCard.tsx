import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface MealItem {
    time: string;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const meals: MealItem[] = [
    { time: '08:00', name: 'Kahvaltı • Yulaf Ezmesi', icon: 'cafe-outline' },
    { time: '13:00', name: 'Öğle • Tavuk Salata', icon: 'restaurant-outline' },
    { time: '19:00', name: 'Akşam • Izgara Somon', icon: 'fish-outline' },
];

export default function MealPlanCard() {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Öğün Planı</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>Tümünü Gör</Text>
                </TouchableOpacity>
            </View>
            {meals.map((meal, index) => (
                <View
                    key={index}
                    style={[styles.mealRow, index < meals.length - 1 && styles.mealRowBorder]}
                >
                    <View style={styles.mealIcon}>
                        <Ionicons name={meal.icon} size={20} color={CoachTheme.accent} />
                    </View>
                    <View style={styles.mealInfo}>
                        <Text style={styles.mealTime}>{meal.time}</Text>
                        <Text style={styles.mealName}>{meal.name}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={CoachTheme.textMuted} />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 18,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 18,
        fontWeight: '700',
    },
    seeAll: {
        color: CoachTheme.accent,
        fontSize: 13,
        fontWeight: '600',
    },
    mealRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    mealRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: CoachTheme.cardBorder,
    },
    mealIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: CoachTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealInfo: {
        flex: 1,
    },
    mealTime: {
        color: CoachTheme.textMuted,
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    mealName: {
        color: CoachTheme.text,
        fontSize: 14,
        fontWeight: '600',
    },
});
