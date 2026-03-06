import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompetitorTheme } from '@/constants/theme';

interface MealItem {
    time: string;
    name: string;
    calories: number;
    protein: number;
    icon: keyof typeof Ionicons.glyphMap;
}

const meals: MealItem[] = [
    { time: '06:30', name: 'Kahvaltı • Yumurta & Yulaf', calories: 520, protein: 35, icon: 'cafe-outline' },
    { time: '09:30', name: 'Ara Öğün • Protein Shake', calories: 280, protein: 40, icon: 'nutrition-outline' },
    { time: '12:30', name: 'Öğle • Tavuk & Bulgur', calories: 680, protein: 55, icon: 'restaurant-outline' },
    { time: '15:30', name: 'Pre-Workout • Muz & Fıstık Ezmesi', calories: 320, protein: 12, icon: 'leaf-outline' },
    { time: '18:30', name: 'Post-Workout • Protein & Pirinç', calories: 550, protein: 45, icon: 'barbell-outline' },
    { time: '21:00', name: 'Akşam • Somon & Tatlı Patates', calories: 480, protein: 38, icon: 'fish-outline' },
];

export default function CompetitorNutritionCard() {
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Beslenme Planı</Text>
                    <Text style={styles.subtitle}>
                        {totalCalories} kcal · {totalProtein}g protein
                    </Text>
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
                        <Ionicons name={meal.icon} size={20} color={CompetitorTheme.accent} />
                    </View>
                    <View style={styles.mealInfo}>
                        <Text style={styles.mealTime}>{meal.time}</Text>
                        <Text style={styles.mealName}>{meal.name}</Text>
                    </View>
                    <View style={styles.mealStats}>
                        <Text style={styles.calorieText}>{meal.calories}</Text>
                        <Text style={styles.calorieUnit}>kcal</Text>
                        <Text style={styles.proteinText}>{meal.protein}g P</Text>
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
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
        padding: 18,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    title: {
        color: CompetitorTheme.text,
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        color: CompetitorTheme.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    seeAll: {
        color: CompetitorTheme.accent,
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
        borderBottomColor: CompetitorTheme.cardBorder,
    },
    mealIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: CompetitorTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealInfo: {
        flex: 1,
    },
    mealTime: {
        color: CompetitorTheme.textMuted,
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    mealName: {
        color: CompetitorTheme.text,
        fontSize: 14,
        fontWeight: '600',
    },
    mealStats: {
        alignItems: 'flex-end',
    },
    calorieText: {
        color: CompetitorTheme.statCalorie,
        fontSize: 15,
        fontWeight: '700',
    },
    calorieUnit: {
        color: CompetitorTheme.textMuted,
        fontSize: 10,
        fontWeight: '500',
    },
    proteinText: {
        color: CompetitorTheme.statPower,
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
});
