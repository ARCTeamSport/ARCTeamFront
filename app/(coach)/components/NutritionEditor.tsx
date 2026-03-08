import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

export type MealType = 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner';

export interface MealSlot {
    id: string;
    mealType: MealType;
    description: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
}

interface Props {
    meals: MealSlot[];
    onUpdateMeal: (id: string, field: keyof MealSlot, value: string) => void;
    onAddMeal: () => void;
    onRemoveMeal: (id: string) => void;
}

const mealLabels: Record<MealType, string> = {
    breakfast: 'Kahvaltı',
    snack1: 'Ara Öğün 1',
    lunch: 'Öğle Yemeği',
    snack2: 'Ara Öğün 2',
    dinner: 'Akşam Yemeği',
};

const mealIcons: Record<MealType, keyof typeof Ionicons.glyphMap> = {
    breakfast: 'sunny',
    snack1: 'cafe',
    lunch: 'restaurant',
    snack2: 'cafe',
    dinner: 'moon',
};

export default function NutritionEditor({
    meals,
    onUpdateMeal,
    onAddMeal,
    onRemoveMeal,
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Ionicons name="nutrition" size={18} color={CoachTheme.statCalorie} />
                <Text style={styles.sectionTitle}>Beslenme</Text>
            </View>

            {meals.map((meal) => (
                <View key={meal.id} style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealLabel}>
                            <Ionicons
                                name={mealIcons[meal.mealType]}
                                size={16}
                                color={CoachTheme.statCalorie}
                            />
                            <Text style={styles.mealType}>{mealLabels[meal.mealType]}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => onRemoveMeal(meal.id)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close-circle" size={18} color={CoachTheme.error} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.descInput}
                        placeholder="Yemek açıklaması..."
                        placeholderTextColor={CoachTheme.textMuted}
                        value={meal.description}
                        onChangeText={(v) => onUpdateMeal(meal.id, 'description', v)}
                    />

                    <View style={styles.macroRow}>
                        <View style={styles.macroField}>
                            <Text style={[styles.macroLabel, { color: CoachTheme.statCalorie }]}>Kcal</Text>
                            <TextInput
                                style={styles.macroInput}
                                keyboardType="numeric"
                                value={meal.calories}
                                onChangeText={(v) => onUpdateMeal(meal.id, 'calories', v)}
                                placeholder="0"
                                placeholderTextColor={CoachTheme.textMuted}
                            />
                        </View>
                        <View style={styles.macroField}>
                            <Text style={[styles.macroLabel, { color: CoachTheme.neonBlue }]}>P</Text>
                            <TextInput
                                style={styles.macroInput}
                                keyboardType="numeric"
                                value={meal.protein}
                                onChangeText={(v) => onUpdateMeal(meal.id, 'protein', v)}
                                placeholder="0"
                                placeholderTextColor={CoachTheme.textMuted}
                            />
                        </View>
                        <View style={styles.macroField}>
                            <Text style={[styles.macroLabel, { color: CoachTheme.warning }]}>K</Text>
                            <TextInput
                                style={styles.macroInput}
                                keyboardType="numeric"
                                value={meal.carbs}
                                onChangeText={(v) => onUpdateMeal(meal.id, 'carbs', v)}
                                placeholder="0"
                                placeholderTextColor={CoachTheme.textMuted}
                            />
                        </View>
                        <View style={styles.macroField}>
                            <Text style={[styles.macroLabel, { color: CoachTheme.error }]}>Y</Text>
                            <TextInput
                                style={styles.macroInput}
                                keyboardType="numeric"
                                value={meal.fat}
                                onChangeText={(v) => onUpdateMeal(meal.id, 'fat', v)}
                                placeholder="0"
                                placeholderTextColor={CoachTheme.textMuted}
                            />
                        </View>
                    </View>
                </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={onAddMeal} activeOpacity={0.7}>
                <Ionicons name="add-circle" size={20} color={CoachTheme.statCalorie} />
                <Text style={styles.addText}>Öğün Ekle</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        color: CoachTheme.text,
        fontSize: 16,
        fontWeight: '700',
    },
    mealCard: {
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 14,
        marginBottom: 10,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    mealType: {
        color: CoachTheme.text,
        fontSize: 13,
        fontWeight: '700',
    },
    descInput: {
        backgroundColor: CoachTheme.inputBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: CoachTheme.inputBorder,
        color: CoachTheme.text,
        fontSize: 13,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
    },
    macroRow: {
        flexDirection: 'row',
        gap: 6,
    },
    macroField: {
        flex: 1,
        alignItems: 'center',
    },
    macroLabel: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 4,
    },
    macroInput: {
        width: '100%',
        backgroundColor: CoachTheme.inputBg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: CoachTheme.inputBorder,
        color: CoachTheme.text,
        fontSize: 14,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 6,
        textAlign: 'center',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        backgroundColor: 'rgba(255, 107, 53, 0.08)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.statCalorie,
        borderStyle: 'dashed',
    },
    addText: {
        color: CoachTheme.statCalorie,
        fontSize: 14,
        fontWeight: '700',
    },
});
