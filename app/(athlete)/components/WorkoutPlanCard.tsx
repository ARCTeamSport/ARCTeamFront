import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';

interface Exercise {
    name: string;
    detail: string;
    completed: boolean;
    icon: keyof typeof Ionicons.glyphMap;
}

const todayWorkout = {
    title: 'Üst Vücut - Güç',
    coach: 'Koç Ahmet',
    duration: '55 dk',
    exercises: [
        { name: 'Bench Press', detail: '4 × 8 · 60kg', completed: true, icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Shoulder Press', detail: '3 × 10 · 25kg', completed: true, icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Lat Pulldown', detail: '4 × 10 · 50kg', completed: false, icon: 'fitness-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Bicep Curl', detail: '3 × 12 · 14kg', completed: false, icon: 'body-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Tricep Dips', detail: '3 × 12', completed: false, icon: 'body-outline' as keyof typeof Ionicons.glyphMap },
    ] as Exercise[],
};

export default function WorkoutPlanCard() {
    const completedCount = todayWorkout.exercises.filter(e => e.completed).length;
    const totalCount = todayWorkout.exercises.length;
    const progress = completedCount / totalCount;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <View style={styles.titleRow}>
                        <Ionicons name="barbell" size={20} color={AthleteTheme.accent} />
                        <Text style={styles.title}>{todayWorkout.title}</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        {todayWorkout.coach} · {todayWorkout.duration}
                    </Text>
                </View>
                <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
                </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>

            {/* Exercises */}
            {todayWorkout.exercises.map((exercise, index) => (
                <View
                    key={index}
                    style={[styles.exerciseRow, index < todayWorkout.exercises.length - 1 && styles.exerciseBorder]}
                >
                    <View style={[styles.exerciseIcon, exercise.completed && styles.exerciseIconCompleted]}>
                        {exercise.completed ? (
                            <Ionicons name="checkmark" size={16} color={AthleteTheme.success} />
                        ) : (
                            <Ionicons name={exercise.icon} size={16} color={AthleteTheme.accent} />
                        )}
                    </View>
                    <View style={styles.exerciseInfo}>
                        <Text style={[styles.exerciseName, exercise.completed && styles.exerciseCompleted]}>
                            {exercise.name}
                        </Text>
                        <Text style={styles.exerciseDetail}>{exercise.detail}</Text>
                    </View>
                    {exercise.completed ? (
                        <View style={styles.doneBadge}>
                            <Text style={styles.doneText}>Tamam</Text>
                        </View>
                    ) : (
                        <Ionicons name="chevron-forward" size={18} color={AthleteTheme.textMuted} />
                    )}
                </View>
            ))}

            <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
                <Ionicons name="play" size={16} color={AthleteTheme.background} />
                <Text style={styles.startText}>Antrenmana Devam Et</Text>
            </TouchableOpacity>
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
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        color: AthleteTheme.text,
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        color: AthleteTheme.textSecondary,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 28,
    },
    progressBadge: {
        backgroundColor: AthleteTheme.accentDim,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    progressText: {
        color: AthleteTheme.accent,
        fontSize: 13,
        fontWeight: '700',
    },
    progressTrack: {
        height: 4,
        borderRadius: 2,
        backgroundColor: AthleteTheme.ringTrack,
        overflow: 'hidden',
        marginBottom: 14,
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
        backgroundColor: AthleteTheme.accent,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        gap: 12,
    },
    exerciseBorder: {
        borderBottomWidth: 1,
        borderBottomColor: AthleteTheme.cardBorder,
    },
    exerciseIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: AthleteTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseIconCompleted: {
        backgroundColor: 'rgba(0, 229, 160, 0.12)',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        color: AthleteTheme.text,
        fontSize: 14,
        fontWeight: '600',
    },
    exerciseCompleted: {
        color: AthleteTheme.textSecondary,
        textDecorationLine: 'line-through',
    },
    exerciseDetail: {
        color: AthleteTheme.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    doneBadge: {
        backgroundColor: 'rgba(0, 229, 160, 0.12)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    doneText: {
        color: AthleteTheme.success,
        fontSize: 11,
        fontWeight: '600',
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: AthleteTheme.accent,
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 14,
    },
    startText: {
        color: AthleteTheme.background,
        fontSize: 15,
        fontWeight: '700',
    },
});
