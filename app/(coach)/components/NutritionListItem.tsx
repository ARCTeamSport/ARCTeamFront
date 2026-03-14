import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface Props {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    onPress: () => void;
}

export default function NutritionListItem({ name, calories, protein, carbs, fat, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name="nutrition" size={22} color={CoachTheme.statCalorie} />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.macros}>
                    <Text style={[styles.macro, { color: CoachTheme.statCalorie }]}>{calories} kcal</Text>
                    <Text style={styles.macroDot}>•</Text>
                    <Text style={[styles.macro, { color: CoachTheme.neonBlue }]}>{protein}g P</Text>
                    <Text style={styles.macroDot}>•</Text>
                    <Text style={[styles.macro, { color: CoachTheme.warning }]}>{carbs}g K</Text>
                    <Text style={styles.macroDot}>•</Text>
                    <Text style={[styles.macro, { color: CoachTheme.error }]}>{fat}g Y</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={CoachTheme.textMuted} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 12,
        marginHorizontal: 20,
        marginBottom: 8,
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    name: {
        color: CoachTheme.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    macros: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    macro: {
        fontSize: 11,
        fontWeight: '600',
    },
    macroDot: {
        color: CoachTheme.textMuted,
        fontSize: 8,
    },
});
