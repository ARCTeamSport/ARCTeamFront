import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';

interface ExerciseDto {
    id: number;
    name: string;
    description: string | null;
    targetMuscle: string;
    equipment: string;
    subRegion: string | null;
    level: string | null;
    type: string | null;
    setsAndReps: string | null;
    tempo: string | null;
    restSeconds: number | null;
    intensityType: string | null;
    goal: string | null;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    isCustom: boolean;
}

const MUSCLE_TRANSLATIONS: Record<string, string> = {
    Chest: 'Göğüs', Back: 'Sırt', Shoulders: 'Omuz', Biceps: 'Ön Kol', Triceps: 'Arka Kol',
    Quads: 'Ön Bacak', Hamstrings: 'Arka Bacak', Calves: 'Kalf', Core: 'Karın', FullBody: 'Tüm Vücut'
};

const EQUIPMENT_TRANSLATIONS: Record<string, string> = {
    Bodyweight: 'Vücut Ağırlığı', Dumbbell: 'Dumbbell', Barbell: 'Barbell', Machine: 'Makine',
    Cable: 'Kablo', Kettlebell: 'Kettlebell', Band: 'Direnç Bandı', MedicineBall: 'Sağlık Topu', Other: 'Diğer'
};

const LEVEL_TRANSLATIONS: Record<string, string> = {
    Beginner: 'Başlangıç', Intermediate: 'Orta', Advanced: 'İleri'
};

const LEVEL_COLORS: Record<string, string> = {
    Beginner: '#4CAF50',
    Intermediate: '#FF9800',
    Advanced: '#F44336',
};

const STAT_ICONS: Record<string, string> = {
    'Set / Tekrar': 'repeat-outline',
    'Tempo': 'timer-outline',
    'Dinlenme': 'bed-outline',
    'Yoğunluk Tipi': 'pulse-outline',
};

export default function ExerciseDetailModal() {
    const { id } = useLocalSearchParams();
    const [exercise, setExercise] = useState<ExerciseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchExercise = async () => {
            try {
                const token = await getToken();
                if (!token) { setError('Oturum bulunamadı.'); return; }

                const res = await fetch(API_ENDPOINTS.EXERCISE.GET_BY_ID(Number(id)), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    setExercise(await res.json());
                } else if (res.status === 403) {
                    setError('Bu egzersizi görüntüleme yetkiniz yok.');
                } else {
                    setError('Egzersiz bulunamadı.');
                }
            } catch (err) {
                console.error(err);
                setError('Bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={CoachTheme.accent} />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    if (error || !exercise) {
        return (
            <View style={styles.centerContainer}>
                <View style={styles.errorIconWrap}>
                    <Ionicons name="alert-circle-outline" size={40} color={CoachTheme.error} />
                </View>
                <Text style={styles.errorText}>{error || 'Egzersiz bulunamadı.'}</Text>
            </View>
        );
    }

    const levelColor = exercise.level ? (LEVEL_COLORS[exercise.level] ?? CoachTheme.accent) : CoachTheme.accent;

    const stats = [
        exercise.setsAndReps ? { label: 'Set / Tekrar', value: exercise.setsAndReps } : null,
        exercise.tempo ? { label: 'Tempo', value: exercise.tempo } : null,
        exercise.restSeconds != null ? { label: 'Dinlenme', value: `${exercise.restSeconds}s` } : null,
        exercise.intensityType ? { label: 'Yoğunluk Tipi', value: exercise.intensityType } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Media ── */}
            <View style={styles.mediaContainer}>
                {exercise.videoUrl ? (
                    <Video
                        source={{ uri: exercise.videoUrl }}
                        style={styles.media}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        isLooping
                    />
                ) : exercise.thumbnailUrl ? (
                    <Image source={{ uri: exercise.thumbnailUrl }} style={styles.media} resizeMode="cover" />
                ) : (
                    <View style={[styles.media, styles.placeholderMedia]}>
                        <View style={styles.placeholderIconWrap}>
                            <Ionicons name="barbell-outline" size={52} color={CoachTheme.accent} />
                        </View>
                    </View>
                )}

                {/* Level pill floating over media */}
                {exercise.level && (
                    <View style={[styles.levelPill, { backgroundColor: levelColor + '22', borderColor: levelColor + '66' }]}>
                        <View style={[styles.levelDot, { backgroundColor: levelColor }]} />
                        <Text style={[styles.levelPillText, { color: levelColor }]}>
                            {LEVEL_TRANSLATIONS[exercise.level] || exercise.level}
                        </Text>
                    </View>
                )}
            </View>

            {/* ── Header ── */}
            <View style={styles.headerSection}>
                <Text style={styles.title}>{exercise.name}</Text>
                {exercise.goal && (
                    <View style={styles.goalRow}>
                        <Ionicons name="flag-outline" size={14} color={CoachTheme.accent} />
                        <Text style={styles.goalText}>{exercise.goal}</Text>
                    </View>
                )}
            </View>

            {/* ── Quick-info chips ── */}
            <View style={styles.chipsRow}>
                <Chip icon="body-outline" label={MUSCLE_TRANSLATIONS[exercise.targetMuscle] || exercise.targetMuscle} />
                <Chip icon="barbell-outline" label={EQUIPMENT_TRANSLATIONS[exercise.equipment] || exercise.equipment} />
                {exercise.type && <Chip icon="flash-outline" label={exercise.type} />}
                {exercise.subRegion && <Chip icon="locate-outline" label={exercise.subRegion} />}
            </View>

            {/* ── Stats ── */}
            {stats.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Antrenman Detayları</Text>
                    <View style={styles.statsGrid}>
                        {stats.map((s) => (
                            <StatCard key={s.label} label={s.label} value={s.value} />
                        ))}
                    </View>
                </View>
            )}

            {/* ── Description ── */}
            {exercise.description && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Açıklama & Notlar</Text>
                    <View style={styles.descriptionCard}>
                        <Ionicons name="document-text-outline" size={16} color={CoachTheme.accent} style={{ marginTop: 2 }} />
                        <Text style={styles.descriptionText}>{exercise.description}</Text>
                    </View>
                </View>
            )}

            <View style={{ height: 48 }} />
        </ScrollView>
    );
}

/* ─── Sub-components ─────────────────────────────────────── */

function Chip({ icon, label }: { icon: any; label: string }) {
    return (
        <View style={chipStyles.wrap}>
            <Ionicons name={icon} size={13} color={CoachTheme.accent} />
            <Text style={chipStyles.text}>{label}</Text>
        </View>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    const icon = STAT_ICONS[label] ?? 'stats-chart-outline';
    return (
        <View style={statStyles.card}>
            <View style={statStyles.iconWrap}>
                <Ionicons name={icon as any} size={18} color={CoachTheme.accent} />
            </View>
            <Text style={statStyles.label}>{label}</Text>
            <Text style={statStyles.value}>{value}</Text>
        </View>
    );
}

/* ─── Styles ─────────────────────────────────────────────── */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CoachTheme.background },
    content: { paddingBottom: 24 },

    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: CoachTheme.background },
    loadingText: { color: CoachTheme.textMuted, fontSize: 14, fontWeight: '500' },
    errorIconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: CoachTheme.cardBg, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
    errorText: { color: CoachTheme.textSecondary, fontSize: 15, fontWeight: '500', textAlign: 'center', paddingHorizontal: 32 },

    /* Media */
    mediaContainer: { width: '100%', height: 280, backgroundColor: CoachTheme.cardBg },
    media: { width: '100%', height: '100%' },
    placeholderMedia: { justifyContent: 'center', alignItems: 'center' },
    placeholderIconWrap: { width: 96, height: 96, borderRadius: 48, backgroundColor: CoachTheme.sectionBg, justifyContent: 'center', alignItems: 'center' },

    levelPill: {
        position: 'absolute', top: 16, right: 16,
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 5, paddingHorizontal: 12,
        borderRadius: 20, borderWidth: 1,
    },
    levelDot: { width: 7, height: 7, borderRadius: 4 },
    levelPillText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },

    /* Header */
    headerSection: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 14 },
    title: { color: CoachTheme.text, fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 8 },
    goalRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    goalText: { color: CoachTheme.textSecondary, fontSize: 14, fontWeight: '500' },

    /* Chips */
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginBottom: 28 },

    /* Sections */
    section: { paddingHorizontal: 20, marginBottom: 28 },
    sectionTitle: {
        color: CoachTheme.textMuted, fontSize: 11, fontWeight: '700',
        letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14,
    },

    /* Stats grid */
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

    /* Description */
    descriptionCard: {
        flexDirection: 'row', gap: 12,
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16, padding: 18,
        borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    descriptionText: { flex: 1, color: CoachTheme.textSecondary, fontSize: 15, lineHeight: 24 },
});

const chipStyles = StyleSheet.create({
    wrap: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: CoachTheme.sectionBg,
        paddingVertical: 6, paddingHorizontal: 12,
        borderRadius: 20, borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    text: { color: CoachTheme.text, fontSize: 13, fontWeight: '600' },
});

const statStyles = StyleSheet.create({
    card: {
        flex: 1, minWidth: '44%',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 18, padding: 18,
        borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    iconWrap: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: CoachTheme.sectionBg,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        color: CoachTheme.textMuted, fontSize: 11, fontWeight: '700',
        letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4,
    },
    value: { color: CoachTheme.text, fontSize: 17, fontWeight: '800' },
});
