import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';

interface MealItem {
    time: string;
    name: string;
    calories: number;
    icon: keyof typeof Ionicons.glyphMap;
}

const meals: MealItem[] = [
    { time: '08:00', name: 'Kahvaltı • Yulaf & Meyve', calories: 380, icon: 'cafe-outline' },
    { time: '10:30', name: 'Ara Öğün • Protein Bar', calories: 210, icon: 'nutrition-outline' },
    { time: '13:00', name: 'Öğle • Tavuk & Pirinç', calories: 520, icon: 'restaurant-outline' },
    { time: '16:00', name: 'Ara Öğün • Yoğurt & Muz', calories: 180, icon: 'leaf-outline' },
    { time: '19:30', name: 'Akşam • Somon & Sebze', calories: 460, icon: 'fish-outline' },
];

export default function DailyNutritionCard() {
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Beslenme Planı</Text>
                    <Text style={styles.subtitle}>Toplam: {totalCalories} kcal</Text>
                </View>
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
                        <Ionicons name={meal.icon} size={20} color={AthleteTheme.accent} />
                    </View>
                    <View style={styles.mealInfo}>
                        <Text style={styles.mealTime}>{meal.time}</Text>
                        <Text style={styles.mealName}>{meal.name}</Text>
                    </View>
                    <View style={styles.calorieTag}>
                        <Text style={styles.calorieText}>{meal.calories}</Text>
                        <Text style={styles.calorieUnit}>kcal</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        padding: 18,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    title: {
        color: AthleteTheme.text,
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        color: AthleteTheme.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    seeAll: {
        color: AthleteTheme.accent,
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
        borderBottomColor: AthleteTheme.cardBorder,
    },
    mealIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: AthleteTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealInfo: {
        flex: 1,
    },
    mealTime: {
        color: AthleteTheme.textMuted,
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    mealName: {
        color: AthleteTheme.text,
        fontSize: 14,
        fontWeight: '600',
    },
    calorieTag: {
        alignItems: 'flex-end',
    },
    calorieText: {
        color: AthleteTheme.statCalorie,
        fontSize: 15,
        fontWeight: '700',
    },
    calorieUnit: {
        color: AthleteTheme.textMuted,
        fontSize: 10,
        fontWeight: '500',
    },
});
