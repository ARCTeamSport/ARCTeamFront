import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DaySelectorBar from './DaySelectorBar';
import WorkoutEditor, { WorkoutEntry } from './WorkoutEditor';
import NutritionEditor, { MealSlot, MealType } from './NutritionEditor';

interface Props {
    visible: boolean;
    athleteName: string;
    athleteRole: 'athlete' | 'competitor';
    onClose: () => void;
}

type DayProgram = {
    workouts: WorkoutEntry[];
    meals: MealSlot[];
};

const MEAL_CYCLE: MealType[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];

const generateId = () => Math.random().toString(36).slice(2, 9);

const createEmptyDay = (): DayProgram => ({
    workouts: [],
    meals: [],
});

export default function ProgramEditorScreen({ visible, athleteName, athleteRole, onClose }: Props) {
    const insets = useSafeAreaInsets();
    const [selectedDay, setSelectedDay] = useState(0);
    const [weekProgram, setWeekProgram] = useState<Record<number, DayProgram>>(() => {
        const init: Record<number, DayProgram> = {};
        for (let i = 0; i < 7; i++) init[i] = createEmptyDay();
        return init;
    });

    const currentDay = weekProgram[selectedDay];
    const isCompetitor = athleteRole === 'competitor';
    const badgeColor = isCompetitor ? CoachTheme.badgeCompetitor : CoachTheme.badgeAthlete;

    // Workout handlers
    const handleAddExercise = useCallback(() => {
        setWeekProgram((prev) => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                workouts: [
                    ...prev[selectedDay].workouts,
                    {
                        id: generateId(),
                        exerciseName: '',
                        sets: '',
                        reps: '',
                        rpe: '',
                        coachNotes: '',
                    },
                ],
            },
        }));
    }, [selectedDay]);

    const handleUpdateExercise = useCallback(
        (id: string, field: keyof WorkoutEntry, value: string) => {
            setWeekProgram((prev) => ({
                ...prev,
                [selectedDay]: {
                    ...prev[selectedDay],
                    workouts: prev[selectedDay].workouts.map((w) =>
                        w.id === id ? { ...w, [field]: value } : w
                    ),
                },
            }));
        },
        [selectedDay]
    );

    const handleRemoveExercise = useCallback(
        (id: string) => {
            setWeekProgram((prev) => ({
                ...prev,
                [selectedDay]: {
                    ...prev[selectedDay],
                    workouts: prev[selectedDay].workouts.filter((w) => w.id !== id),
                },
            }));
        },
        [selectedDay]
    );

    // Nutrition handlers
    const handleAddMeal = useCallback(() => {
        const current = weekProgram[selectedDay].meals;
        const usedTypes = current.map((m) => m.mealType);
        const nextType = MEAL_CYCLE.find((t) => !usedTypes.includes(t)) || 'breakfast';

        setWeekProgram((prev) => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                meals: [
                    ...prev[selectedDay].meals,
                    {
                        id: generateId(),
                        mealType: nextType,
                        description: '',
                        calories: '',
                        protein: '',
                        carbs: '',
                        fat: '',
                    },
                ],
            },
        }));
    }, [selectedDay, weekProgram]);

    const handleUpdateMeal = useCallback(
        (id: string, field: keyof MealSlot, value: string) => {
            setWeekProgram((prev) => ({
                ...prev,
                [selectedDay]: {
                    ...prev[selectedDay],
                    meals: prev[selectedDay].meals.map((m) =>
                        m.id === id ? { ...m, [field]: value } : m
                    ),
                },
            }));
        },
        [selectedDay]
    );

    const handleRemoveMeal = useCallback(
        (id: string) => {
            setWeekProgram((prev) => ({
                ...prev,
                [selectedDay]: {
                    ...prev[selectedDay],
                    meals: prev[selectedDay].meals.filter((m) => m.id !== id),
                },
            }));
        },
        [selectedDay]
    );

    const DAYS_FULL = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
            <View style={[styles.screen, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={CoachTheme.text} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>{athleteName}</Text>
                        <View style={[styles.roleBadge, { backgroundColor: `${badgeColor}20` }]}>
                            <Text style={[styles.roleBadgeText, { color: badgeColor }]}>
                                {isCompetitor ? 'Yarışmacı' : 'Sporcu'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.saveBtn} activeOpacity={0.7}>
                        <Text style={styles.saveBtnText}>Kaydet</Text>
                    </TouchableOpacity>
                </View>

                {/* Day Selector */}
                <DaySelectorBar selectedDay={selectedDay} onDayChange={setSelectedDay} />

                <Text style={styles.dayLabel}>{DAYS_FULL[selectedDay]}</Text>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <WorkoutEditor
                        exercises={currentDay.workouts}
                        onUpdateExercise={handleUpdateExercise}
                        onAddExercise={handleAddExercise}
                        onRemoveExercise={handleRemoveExercise}
                    />

                    <NutritionEditor
                        meals={currentDay.meals}
                        onUpdateMeal={handleUpdateMeal}
                        onAddMeal={handleAddMeal}
                        onRemoveMeal={handleRemoveMeal}
                    />

                    {/* Day summary */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Gün Özeti</Text>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryValue}>
                                    {currentDay.workouts.length}
                                </Text>
                                <Text style={styles.summaryLabel}>Egzersiz</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryValue}>
                                    {currentDay.meals.length}
                                </Text>
                                <Text style={styles.summaryLabel}>Öğün</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryValue}>
                                    {currentDay.meals.reduce(
                                        (sum, m) => sum + (parseInt(m.calories) || 0),
                                        0
                                    )}
                                </Text>
                                <Text style={styles.summaryLabel}>Kcal</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        alignItems: 'center',
        gap: 4,
    },
    headerTitle: {
        color: CoachTheme.text,
        fontSize: 17,
        fontWeight: '700',
    },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
    },
    roleBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    saveBtn: {
        backgroundColor: CoachTheme.accent,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    saveBtnText: {
        color: CoachTheme.background,
        fontSize: 13,
        fontWeight: '700',
    },
    dayLabel: {
        color: CoachTheme.text,
        fontSize: 20,
        fontWeight: '800',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    summaryCard: {
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 8,
    },
    summaryTitle: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        color: CoachTheme.accent,
        fontSize: 22,
        fontWeight: '800',
    },
    summaryLabel: {
        color: CoachTheme.textMuted,
        fontSize: 11,
        marginTop: 4,
    },
    summaryDivider: {
        width: 1,
        height: 30,
        backgroundColor: CoachTheme.divider,
    },
});
