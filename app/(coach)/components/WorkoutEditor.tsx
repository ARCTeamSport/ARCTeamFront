import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

export interface WorkoutEntry {
    id: string;
    exerciseName: string;
    sets: string;
    reps: string;
    rpe: string;
    coachNotes: string;
}

interface Props {
    exercises: WorkoutEntry[];
    onUpdateExercise: (id: string, field: keyof WorkoutEntry, value: string) => void;
    onAddExercise: () => void;
    onRemoveExercise: (id: string) => void;
}

export default function WorkoutEditor({
    exercises,
    onUpdateExercise,
    onAddExercise,
    onRemoveExercise,
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Ionicons name="barbell" size={18} color={CoachTheme.accent} />
                <Text style={styles.sectionTitle}>Antrenman</Text>
            </View>

            {exercises.map((exercise, idx) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                        <Text style={styles.exerciseNumber}>#{idx + 1}</Text>
                        <TouchableOpacity
                            onPress={() => onRemoveExercise(exercise.id)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close-circle" size={20} color={CoachTheme.error} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.nameInput}
                        placeholder="Egzersiz adı ara..."
                        placeholderTextColor={CoachTheme.textMuted}
                        value={exercise.exerciseName}
                        onChangeText={(v) => onUpdateExercise(exercise.id, 'exerciseName', v)}
                    />

                    <View style={styles.metricsRow}>
                        <View style={styles.metricField}>
                            <Text style={styles.metricLabel}>Set</Text>
                            <TextInput
                                style={styles.metricInput}
                                keyboardType="numeric"
                                value={exercise.sets}
                                onChangeText={(v) => onUpdateExercise(exercise.id, 'sets', v)}
                                placeholder="0"
                                placeholderTextColor={CoachTheme.textMuted}
                            />
                        </View>
                        <View style={styles.metricField}>
                            <Text style={styles.metricLabel}>Tekrar</Text>
                            <TextInput
                                style={styles.metricInput}
                                keyboardType="numeric"
                                value={exercise.reps}
                                onChangeText={(v) => onUpdateExercise(exercise.id, 'reps', v)}
                                placeholder="0"
                                placeholderTextColor={CoachTheme.textMuted}
                            />
                        </View>
                        <View style={styles.metricField}>
                            <Text style={styles.metricLabel}>RPE</Text>
                            <TextInput
                                style={styles.metricInput}
                                keyboardType="numeric"
                                value={exercise.rpe}
                                onChangeText={(v) => onUpdateExercise(exercise.id, 'rpe', v)}
                                placeholder="0"
                                placeholderTextColor={CoachTheme.textMuted}
                            />
                        </View>
                    </View>

                    <TextInput
                        style={styles.notesInput}
                        placeholder="Koç notları..."
                        placeholderTextColor={CoachTheme.textMuted}
                        value={exercise.coachNotes}
                        onChangeText={(v) => onUpdateExercise(exercise.id, 'coachNotes', v)}
                        multiline
                        numberOfLines={2}
                    />
                </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={onAddExercise} activeOpacity={0.7}>
                <Ionicons name="add-circle" size={20} color={CoachTheme.accent} />
                <Text style={styles.addText}>Egzersiz Ekle</Text>
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
    exerciseCard: {
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 14,
        marginBottom: 10,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    exerciseNumber: {
        color: CoachTheme.accent,
        fontSize: 13,
        fontWeight: '800',
    },
    nameInput: {
        backgroundColor: CoachTheme.inputBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: CoachTheme.inputBorder,
        color: CoachTheme.text,
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10,
    },
    metricField: {
        flex: 1,
    },
    metricLabel: {
        color: CoachTheme.textSecondary,
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    metricInput: {
        backgroundColor: CoachTheme.inputBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: CoachTheme.inputBorder,
        color: CoachTheme.text,
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: 12,
        paddingVertical: 8,
        textAlign: 'center',
    },
    notesInput: {
        backgroundColor: CoachTheme.inputBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: CoachTheme.inputBorder,
        color: CoachTheme.text,
        fontSize: 13,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 48,
        textAlignVertical: 'top',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        backgroundColor: CoachTheme.accentDim,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.accent,
        borderStyle: 'dashed',
    },
    addText: {
        color: CoachTheme.accent,
        fontSize: 14,
        fontWeight: '700',
    },
});
