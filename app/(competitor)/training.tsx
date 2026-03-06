import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompetitorTheme } from '@/constants/theme';

interface TrainingDay {
    day: string;
    title: string;
    duration: string;
    exerciseCount: number;
    intensity: string;
    isToday: boolean;
    isCompleted: boolean;
}

const weeklyProgram: TrainingDay[] = [
    { day: 'Pazartesi', title: 'Güç & Patlayıcılık', duration: '75 dk', exerciseCount: 6, intensity: 'Yüksek', isToday: false, isCompleted: true },
    { day: 'Salı', title: 'Olimpik Kaldırışlar', duration: '80 dk', exerciseCount: 5, intensity: 'Çok Yüksek', isToday: false, isCompleted: true },
    { day: 'Çarşamba', title: 'Kardiyo & Dayanıklılık', duration: '60 dk', exerciseCount: 4, intensity: 'Orta', isToday: false, isCompleted: true },
    { day: 'Perşembe', title: 'Maksimal Güç', duration: '70 dk', exerciseCount: 6, intensity: 'Çok Yüksek', isToday: true, isCompleted: false },
    { day: 'Cuma', title: 'Teknik & Hız', duration: '65 dk', exerciseCount: 5, intensity: 'Yüksek', isToday: false, isCompleted: false },
    { day: 'Cumartesi', title: 'Yarışma Simülasyonu', duration: '90 dk', exerciseCount: 8, intensity: 'Maksimum', isToday: false, isCompleted: false },
    { day: 'Pazar', title: 'Aktif Dinlenme', duration: '30 dk', exerciseCount: 2, intensity: 'Düşük', isToday: false, isCompleted: false },
];

const getIntensityColor = (intensity: string) => {
    switch (intensity) {
        case 'Maksimum': return CompetitorTheme.statCalorie;
        case 'Çok Yüksek': return CompetitorTheme.accent;
        case 'Yüksek': return CompetitorTheme.statSpeed;
        case 'Orta': return CompetitorTheme.statEndurance;
        case 'Düşük': return CompetitorTheme.textMuted;
        default: return CompetitorTheme.textSecondary;
    }
};

export default function TrainingScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Antrenman Programı</Text>
                <Text style={styles.headerSubtitle}>Yarışma hazırlık programı · Hafta 6/12</Text>
            </View>

            {/* Program info card */}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={20} color={CompetitorTheme.accent} />
                        <Text style={styles.infoLabel}>Süre</Text>
                        <Text style={styles.infoValue}>12 Hafta</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Ionicons name="flame-outline" size={20} color={CompetitorTheme.statCalorie} />
                        <Text style={styles.infoLabel}>Seviye</Text>
                        <Text style={styles.infoValue}>İleri</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Ionicons name="trophy-outline" size={20} color={CompetitorTheme.gold} />
                        <Text style={styles.infoLabel}>Hedef</Text>
                        <Text style={styles.infoValue}>Şampiyona</Text>
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
                        <View style={styles.dayMetaRow}>
                            <Text style={styles.dayMeta}>
                                {workout.exerciseCount} egzersiz · {workout.duration}
                            </Text>
                            <View style={[styles.intensityTag, { backgroundColor: `${getIntensityColor(workout.intensity)}15` }]}>
                                <View style={[styles.intensityDot, { backgroundColor: getIntensityColor(workout.intensity) }]} />
                                <Text style={[styles.intensityText, { color: getIntensityColor(workout.intensity) }]}>
                                    {workout.intensity}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {workout.isCompleted ? (
                        <Ionicons name="checkmark-circle" size={22} color={CompetitorTheme.success} />
                    ) : workout.isToday ? (
                        <View style={styles.todayBadge}>
                            <Text style={styles.todayText}>Bugün</Text>
                        </View>
                    ) : (
                        <Ionicons name="chevron-forward" size={18} color={CompetitorTheme.textMuted} />
                    )}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CompetitorTheme.background,
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
        color: CompetitorTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    headerSubtitle: {
        color: CompetitorTheme.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    infoCard: {
        marginHorizontal: 20,
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
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
        backgroundColor: CompetitorTheme.cardBorder,
    },
    infoLabel: {
        color: CompetitorTheme.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },
    infoValue: {
        color: CompetitorTheme.text,
        fontSize: 14,
        fontWeight: '700',
    },
    sectionTitle: {
        color: CompetitorTheme.text,
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 20,
        marginBottom: 14,
    },
    dayCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
        padding: 14,
        marginBottom: 10,
        gap: 14,
    },
    dayIndicator: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: CompetitorTheme.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayIndicatorToday: {
        backgroundColor: CompetitorTheme.accentDim,
        borderWidth: 1.5,
        borderColor: CompetitorTheme.accent,
    },
    dayIndicatorCompleted: {
        backgroundColor: 'rgba(0, 229, 160, 0.12)',
    },
    dayText: {
        color: CompetitorTheme.textSecondary,
        fontSize: 12,
        fontWeight: '700',
    },
    dayTextToday: {
        color: CompetitorTheme.accent,
    },
    dayTextCompleted: {
        color: CompetitorTheme.success,
    },
    dayInfo: {
        flex: 1,
    },
    dayTitle: {
        color: CompetitorTheme.text,
        fontSize: 15,
        fontWeight: '600',
    },
    dayTitleToday: {
        color: CompetitorTheme.accent,
    },
    dayMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    dayMeta: {
        color: CompetitorTheme.textMuted,
        fontSize: 12,
    },
    intensityTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    intensityDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    intensityText: {
        fontSize: 10,
        fontWeight: '700',
    },
    todayBadge: {
        backgroundColor: CompetitorTheme.accentDim,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    todayText: {
        color: CompetitorTheme.accent,
        fontSize: 12,
        fontWeight: '700',
    },
});
