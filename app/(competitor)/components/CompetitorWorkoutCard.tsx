import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompetitorTheme } from '@/constants/theme';

interface Exercise {
    name: string;
    detail: string;
    completed: boolean;
    icon: keyof typeof Ionicons.glyphMap;
}

const todayWorkout = {
    title: 'Yarışma Hazırlık - Güç & Patlayıcılık',
    coach: 'Koç Mehmet',
    duration: '75 dk',
    intensity: 'Yüksek',
    exercises: [
        { name: 'Clean & Jerk', detail: '5 × 3 · 80kg', completed: true, icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Snatch', detail: '5 × 2 · 65kg', completed: true, icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Back Squat', detail: '4 × 5 · 100kg', completed: true, icon: 'fitness-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Box Jump', detail: '4 × 8 · 90cm', completed: false, icon: 'arrow-up-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Deadlift', detail: '4 × 4 · 120kg', completed: false, icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap },
        { name: 'Sprint İnterval', detail: '8 × 200m', completed: false, icon: 'flash-outline' as keyof typeof Ionicons.glyphMap },
    ] as Exercise[],
};

export default function CompetitorWorkoutCard() {
    const completedCount = todayWorkout.exercises.filter(e => e.completed).length;
    const totalCount = todayWorkout.exercises.length;
    const progress = completedCount / totalCount;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <View style={styles.titleRow}>
                        <Ionicons name="barbell" size={20} color={CompetitorTheme.accent} />
                        <Text style={styles.title}>{todayWorkout.title}</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        {todayWorkout.coach} · {todayWorkout.duration}
                    </Text>
                </View>
                <View style={styles.intensityBadge}>
                    <Ionicons name="flame" size={12} color={CompetitorTheme.accent} />
                    <Text style={styles.intensityText}>{todayWorkout.intensity}</Text>
                </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
            </View>

            {/* Exercises */}
            {todayWorkout.exercises.map((exercise, index) => (
                <View
                    key={index}
                    style={[styles.exerciseRow, index < todayWorkout.exercises.length - 1 && styles.exerciseBorder]}
                >
                    <View style={[styles.exerciseIcon, exercise.completed && styles.exerciseIconCompleted]}>
                        {exercise.completed ? (
                            <Ionicons name="checkmark" size={16} color={CompetitorTheme.success} />
                        ) : (
                            <Ionicons name={exercise.icon} size={16} color={CompetitorTheme.accent} />
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
                        <Ionicons name="chevron-forward" size={18} color={CompetitorTheme.textMuted} />
                    )}
                </View>
            ))}

            <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
                <Ionicons name="flash" size={16} color={CompetitorTheme.background} />
                <Text style={styles.startText}>Antrenmana Devam Et</Text>
            </TouchableOpacity>
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
        color: CompetitorTheme.text,
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    subtitle: {
        color: CompetitorTheme.textSecondary,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 28,
    },
    intensityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: CompetitorTheme.accentDim,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    intensityText: {
        color: CompetitorTheme.accent,
        fontSize: 11,
        fontWeight: '700',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    progressTrack: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: CompetitorTheme.ringTrack,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
        backgroundColor: CompetitorTheme.accent,
    },
    progressText: {
        color: CompetitorTheme.accent,
        fontSize: 13,
        fontWeight: '700',
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        gap: 12,
    },
    exerciseBorder: {
        borderBottomWidth: 1,
        borderBottomColor: CompetitorTheme.cardBorder,
    },
    exerciseIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: CompetitorTheme.accentDim,
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
        color: CompetitorTheme.text,
        fontSize: 14,
        fontWeight: '600',
    },
    exerciseCompleted: {
        color: CompetitorTheme.textSecondary,
        textDecorationLine: 'line-through',
    },
    exerciseDetail: {
        color: CompetitorTheme.textMuted,
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
        color: CompetitorTheme.success,
        fontSize: 11,
        fontWeight: '600',
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: CompetitorTheme.accent,
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 14,
    },
    startText: {
        color: CompetitorTheme.background,
        fontSize: 15,
        fontWeight: '700',
    },
});
