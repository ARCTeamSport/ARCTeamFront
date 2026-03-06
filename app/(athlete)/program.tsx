import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';

interface WorkoutDay {
    day: string;
    title: string;
    duration: string;
    exerciseCount: number;
    isToday: boolean;
    isCompleted: boolean;
}

const weeklyProgram: WorkoutDay[] = [
    { day: 'Pazartesi', title: 'Üst Vücut - Güç', duration: '55 dk', exerciseCount: 5, isToday: false, isCompleted: true },
    { day: 'Salı', title: 'Alt Vücut - Güç', duration: '50 dk', exerciseCount: 6, isToday: false, isCompleted: true },
    { day: 'Çarşamba', title: 'Kardiyo & Core', duration: '40 dk', exerciseCount: 4, isToday: false, isCompleted: true },
    { day: 'Perşembe', title: 'Push Day', duration: '50 dk', exerciseCount: 5, isToday: true, isCompleted: false },
    { day: 'Cuma', title: 'Pull Day', duration: '50 dk', exerciseCount: 5, isToday: false, isCompleted: false },
    { day: 'Cumartesi', title: 'Bacak & Core', duration: '55 dk', exerciseCount: 6, isToday: false, isCompleted: false },
    { day: 'Pazar', title: 'Dinlenme Günü', duration: '-', exerciseCount: 0, isToday: false, isCompleted: false },
];

export default function ProgramScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Programım</Text>
                <Text style={styles.headerSubtitle}>Haftalık antrenman programı</Text>
            </View>

            {/* Program info card */}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={20} color={AthleteTheme.accent} />
                        <Text style={styles.infoLabel}>Süre</Text>
                        <Text style={styles.infoValue}>8 Hafta</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Ionicons name="trending-up-outline" size={20} color={AthleteTheme.statCalorie} />
                        <Text style={styles.infoLabel}>Seviye</Text>
                        <Text style={styles.infoValue}>Orta</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Ionicons name="person-outline" size={20} color={AthleteTheme.success} />
                        <Text style={styles.infoLabel}>Koç</Text>
                        <Text style={styles.infoValue}>Koç Ahmet</Text>
                    </View>
                </View>
            </View>

            {/* Weekly schedule */}
            <Text style={styles.sectionTitle}>Bu Hafta</Text>
            {weeklyProgram.map((workout, index) => (
                <TouchableOpacity key={index} style={styles.dayCard} activeOpacity={0.7}>
                    <View style={[
                        styles.dayIndicator,
                        workout.isToday && styles.dayIndicatorToday,
                        workout.isCompleted && styles.dayIndicatorCompleted,
                    ]}>
                        <Text style={[
                            styles.dayText,
                            workout.isToday && styles.dayTextToday,
                            workout.isCompleted && styles.dayTextCompleted,
                        ]}>{workout.day.substring(0, 3)}</Text>
                    </View>
                    <View style={styles.dayInfo}>
                        <Text style={[styles.dayTitle, workout.isToday && styles.dayTitleToday]}>
                            {workout.title}
                        </Text>
                        {workout.exerciseCount > 0 && (
                            <Text style={styles.dayMeta}>
                                {workout.exerciseCount} egzersiz · {workout.duration}
                            </Text>
                        )}
                    </View>
                    {workout.isCompleted ? (
                        <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={22} color={AthleteTheme.success} />
                        </View>
                    ) : workout.isToday ? (
                        <View style={styles.todayBadge}>
                            <Text style={styles.todayText}>Bugün</Text>
                        </View>
                    ) : (
                        <Ionicons name="chevron-forward" size={18} color={AthleteTheme.textMuted} />
                    )}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: AthleteTheme.background,
    },
    content: {
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
    },
    headerTitle: {
        color: AthleteTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    headerSubtitle: {
        color: AthleteTheme.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    infoCard: {
        marginHorizontal: 20,
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        padding: 20,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    infoDivider: {
        width: 1,
        height: 40,
        backgroundColor: AthleteTheme.cardBorder,
    },
    infoLabel: {
        color: AthleteTheme.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },
    infoValue: {
        color: AthleteTheme.text,
        fontSize: 14,
        fontWeight: '700',
    },
    sectionTitle: {
        color: AthleteTheme.text,
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 20,
        marginBottom: 14,
    },
    dayCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        padding: 14,
        marginBottom: 10,
        gap: 14,
    },
    dayIndicator: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: AthleteTheme.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayIndicatorToday: {
        backgroundColor: AthleteTheme.accentDim,
        borderWidth: 1.5,
        borderColor: AthleteTheme.accent,
    },
    dayIndicatorCompleted: {
        backgroundColor: 'rgba(0, 229, 160, 0.12)',
    },
    dayText: {
        color: AthleteTheme.textSecondary,
        fontSize: 12,
        fontWeight: '700',
    },
    dayTextToday: {
        color: AthleteTheme.accent,
    },
    dayTextCompleted: {
        color: AthleteTheme.success,
    },
    dayInfo: {
        flex: 1,
    },
    dayTitle: {
        color: AthleteTheme.text,
        fontSize: 15,
        fontWeight: '600',
    },
    dayTitleToday: {
        color: AthleteTheme.accent,
    },
    dayMeta: {
        color: AthleteTheme.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    completedBadge: {},
    todayBadge: {
        backgroundColor: AthleteTheme.accentDim,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    todayText: {
        color: AthleteTheme.accent,
        fontSize: 12,
        fontWeight: '700',
    },
});
