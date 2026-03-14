import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';

interface NutritionDto {
    id: number;
    name: string;
    category: string;
    system: string;
    subSystem: string | null;
    level: string | null;
    foodCategory: string | null;
    portion: string | null;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    timing: string | null;
    mainBenefit: string | null;
    combination: string | null;
    criticalNote: string | null;
    imageUrl: string | null;
    isCustom: boolean;
}

/* ─── Translations ─────────────────────────────────────────── */

const CATEGORY_TRANSLATIONS: Record<string, string> = {
    Protein: 'Protein', Carbohydrate: 'Karbonhidrat', Fat: 'Yağ',
    Vegetable: 'Sebze', Fruit: 'Meyve', Dairy: 'Süt Ürünleri',
    Supplement: 'Takviye', Beverage: 'İçecek', Other: 'Diğer',
};

const LEVEL_TRANSLATIONS: Record<string, string> = {
    Beginner: 'Başlangıç', Intermediate: 'Orta', Advanced: 'İleri',
};

const LEVEL_COLORS: Record<string, string> = {
    Beginner: '#4CAF50', Intermediate: '#FF9800', Advanced: '#F44336',
};

/* ─── Macro config ─────────────────────────────────────────── */

interface MacroDef {
    key: keyof Pick<NutritionDto, 'calories' | 'protein' | 'carbohydrates' | 'fat' | 'fiber'>;
    label: string;
    unit: string;
    icon: string;
    color: string;
}

const MACROS: MacroDef[] = [
    { key: 'calories', label: 'Kalori', unit: 'kcal', icon: 'flame-outline', color: '#FF6B35' },
    { key: 'protein', label: 'Protein', unit: 'g', icon: 'fish-outline', color: '#4FC3F7' },
    { key: 'carbohydrates', label: 'Karbonhidrat', unit: 'g', icon: 'leaf-outline', color: '#81C784' },
    { key: 'fat', label: 'Yağ', unit: 'g', icon: 'water-outline', color: '#FFD54F' },
    { key: 'fiber', label: 'Lif', unit: 'g', icon: 'layers-outline', color: '#CE93D8' },
];

/* ─── Component ────────────────────────────────────────────── */

export default function NutritionDetailModal() {
    const { id } = useLocalSearchParams();
    const [nutrition, setNutrition] = useState<NutritionDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchNutrition = async () => {
            try {
                const token = await getToken();
                if (!token) { setError('Oturum bulunamadı.'); return; }

                const res = await fetch(API_ENDPOINTS.NUTRITION.GET_BY_ID(Number(id)), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    setNutrition(await res.json());
                } else if (res.status === 403) {
                    setError('Bu besini görüntüleme yetkiniz yok.');
                } else {
                    setError('Besin bulunamadı.');
                }
            } catch (err) {
                console.error(err);
                setError('Bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchNutrition();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={CoachTheme.accent} />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    if (error || !nutrition) {
        return (
            <View style={styles.centerContainer}>
                <View style={styles.errorIconWrap}>
                    <Ionicons name="alert-circle-outline" size={40} color={CoachTheme.error} />
                </View>
                <Text style={styles.errorText}>{error || 'Besin bulunamadı.'}</Text>
            </View>
        );
    }

    const levelColor = nutrition.level
        ? (LEVEL_COLORS[nutrition.level] ?? CoachTheme.accent)
        : CoachTheme.accent;

    // Toplam makrodan yüzde hesapla (kalori hariç)
    const totalMacroG = nutrition.protein + nutrition.carbohydrates + nutrition.fat;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Media ── */}
            <View style={styles.mediaContainer}>
                {nutrition.imageUrl ? (
                    <Image source={{ uri: nutrition.imageUrl }} style={styles.media} resizeMode="cover" />
                ) : (
                    <View style={[styles.media, styles.placeholderMedia]}>
                        <View style={styles.placeholderIconWrap}>
                            <Ionicons name="nutrition-outline" size={52} color={CoachTheme.accent} />
                        </View>
                    </View>
                )}

                {/* Category pill */}
                <View style={styles.categoryPill}>
                    <Ionicons name="pricetag-outline" size={12} color={CoachTheme.accent} />
                    <Text style={styles.categoryPillText}>
                        {CATEGORY_TRANSLATIONS[nutrition.category] || nutrition.category}
                    </Text>
                </View>

                {/* Level pill */}
                {nutrition.level && (
                    <View style={[styles.levelPill, { backgroundColor: levelColor + '22', borderColor: levelColor + '66' }]}>
                        <View style={[styles.levelDot, { backgroundColor: levelColor }]} />
                        <Text style={[styles.levelPillText, { color: levelColor }]}>
                            {LEVEL_TRANSLATIONS[nutrition.level] || nutrition.level}
                        </Text>
                    </View>
                )}
            </View>

            {/* ── Header ── */}
            <View style={styles.headerSection}>
                <Text style={styles.title}>{nutrition.name}</Text>
                {nutrition.mainBenefit && (
                    <View style={styles.benefitRow}>
                        <Ionicons name="star-outline" size={14} color={CoachTheme.accent} />
                        <Text style={styles.benefitText}>{nutrition.mainBenefit}</Text>
                    </View>
                )}
            </View>

            {/* ── Quick chips ── */}
            <View style={styles.chipsRow}>
                <Chip icon="grid-outline" label={nutrition.system} />
                {nutrition.foodCategory && <Chip icon="restaurant-outline" label={nutrition.foodCategory} />}
                {nutrition.subSystem && <Chip icon="git-branch-outline" label={nutrition.subSystem} />}
                {nutrition.portion && <Chip icon="scale-outline" label={nutrition.portion} />}
            </View>

            {/* ── Macro ring area ── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Makro Değerler</Text>

                {/* Kalori featured card */}
                <View style={styles.calorieCard}>
                    <View style={styles.calorieIconWrap}>
                        <Ionicons name="flame-outline" size={24} color="#FF6B35" />
                    </View>
                    <View>
                        <Text style={styles.calorieLabel}>Toplam Kalori</Text>
                        <View style={styles.calorieValueRow}>
                            <Text style={styles.calorieValue}>{nutrition.calories}</Text>
                            <Text style={styles.calorieUnit}>kcal</Text>
                        </View>
                    </View>
                    {nutrition.portion && (
                        <View style={styles.portionBadge}>
                            <Text style={styles.portionBadgeText}>{nutrition.portion}</Text>
                        </View>
                    )}
                </View>

                {/* Macro bar */}
                {totalMacroG > 0 && (
                    <View style={styles.macroBarContainer}>
                        <View style={styles.macroBar}>
                            <View style={[styles.macroBarSegment, {
                                flex: nutrition.protein,
                                backgroundColor: '#4FC3F7',
                                borderTopLeftRadius: 4,
                                borderBottomLeftRadius: 4,
                            }]} />
                            <View style={[styles.macroBarSegment, {
                                flex: nutrition.carbohydrates,
                                backgroundColor: '#81C784',
                            }]} />
                            <View style={[styles.macroBarSegment, {
                                flex: nutrition.fat,
                                backgroundColor: '#FFD54F',
                                borderTopRightRadius: 4,
                                borderBottomRightRadius: 4,
                            }]} />
                        </View>
                        <View style={styles.macroBarLegend}>
                            <MacroLegendDot color="#4FC3F7" label="Protein" />
                            <MacroLegendDot color="#81C784" label="Karb." />
                            <MacroLegendDot color="#FFD54F" label="Yağ" />
                        </View>
                    </View>
                )}

                {/* Macro cards grid (protein, carbs, fat, fiber) */}
                <View style={styles.macroGrid}>
                    {MACROS.filter(m => m.key !== 'calories').map((m) => (
                        <MacroCard
                            key={m.key}
                            label={m.label}
                            value={nutrition[m.key] as number}
                            unit={m.unit}
                            icon={m.icon}
                            color={m.color}
                            total={m.key !== 'fiber' ? totalMacroG : undefined}
                        />
                    ))}
                </View>
            </View>

            {/* ── Timing ── */}
            {nutrition.timing && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tüketim Zamanlaması</Text>
                    <View style={styles.infoCard}>
                        <View style={[styles.infoIconWrap, { backgroundColor: '#4FC3F7' + '22' }]}>
                            <Ionicons name="time-outline" size={18} color="#4FC3F7" />
                        </View>
                        <Text style={styles.infoText}>{nutrition.timing}</Text>
                    </View>
                </View>
            )}

            {/* ── Combination ── */}
            {nutrition.combination && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kombinasyon Önerisi</Text>
                    <View style={styles.infoCard}>
                        <View style={[styles.infoIconWrap, { backgroundColor: '#81C784' + '22' }]}>
                            <Ionicons name="git-merge-outline" size={18} color="#81C784" />
                        </View>
                        <Text style={styles.infoText}>{nutrition.combination}</Text>
                    </View>
                </View>
            )}

            {/* ── Critical Note ── */}
            {nutrition.criticalNote && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kritik Not</Text>
                    <View style={[styles.infoCard, styles.criticalCard]}>
                        <View style={[styles.infoIconWrap, { backgroundColor: '#FF6B3522' }]}>
                            <Ionicons name="warning-outline" size={18} color="#FF6B35" />
                        </View>
                        <Text style={[styles.infoText, { color: CoachTheme.text }]}>{nutrition.criticalNote}</Text>
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

function MacroCard({
    label, value, unit, icon, color, total
}: {
    label: string; value: number; unit: string;
    icon: string; color: string; total?: number;
}) {
    const pct = total && total > 0 ? Math.round((value / total) * 100) : null;

    return (
        <View style={macroCardStyles.card}>
            <View style={[macroCardStyles.iconWrap, { backgroundColor: color + '22' }]}>
                <Ionicons name={icon as any} size={18} color={color} />
            </View>
            <Text style={macroCardStyles.label}>{label}</Text>
            <View style={macroCardStyles.valueRow}>
                <Text style={macroCardStyles.value}>{value}</Text>
                <Text style={macroCardStyles.unit}>{unit}</Text>
            </View>
            {pct !== null && (
                <View style={macroCardStyles.pctBarBg}>
                    <View style={[macroCardStyles.pctBarFill, { width: `${pct}%` as any, backgroundColor: color }]} />
                </View>
            )}
        </View>
    );
}

function MacroLegendDot({ color, label }: { color: string; label: string }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
            <Text style={{ color: CoachTheme.textMuted, fontSize: 11, fontWeight: '600' }}>{label}</Text>
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

    categoryPill: {
        position: 'absolute', top: 16, left: 16,
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: CoachTheme.cardBg + 'CC',
        paddingVertical: 5, paddingHorizontal: 12,
        borderRadius: 20, borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    categoryPillText: { color: CoachTheme.text, fontSize: 12, fontWeight: '700' },

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
    benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    benefitText: { color: CoachTheme.textSecondary, fontSize: 14, fontWeight: '500', flex: 1 },

    /* Chips */
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginBottom: 28 },

    /* Sections */
    section: { paddingHorizontal: 20, marginBottom: 28 },
    sectionTitle: {
        color: CoachTheme.textMuted, fontSize: 11, fontWeight: '700',
        letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14,
    },

    /* Calorie featured card */
    calorieCard: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 20, padding: 20, marginBottom: 16,
        borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    calorieIconWrap: {
        width: 48, height: 48, borderRadius: 14,
        backgroundColor: '#FF6B35' + '22',
        justifyContent: 'center', alignItems: 'center',
    },
    calorieLabel: { color: CoachTheme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 },
    calorieValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    calorieValue: { color: CoachTheme.text, fontSize: 28, fontWeight: '800' },
    calorieUnit: { color: CoachTheme.textMuted, fontSize: 14, fontWeight: '600' },
    portionBadge: {
        marginLeft: 'auto' as any,
        backgroundColor: CoachTheme.sectionBg,
        paddingVertical: 4, paddingHorizontal: 10,
        borderRadius: 10, borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    portionBadgeText: { color: CoachTheme.textSecondary, fontSize: 12, fontWeight: '600' },

    /* Macro bar */
    macroBarContainer: { marginBottom: 16 },
    macroBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
    macroBarSegment: { height: '100%' },
    macroBarLegend: { flexDirection: 'row', gap: 16 },

    /* Macro grid */
    macroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

    /* Info cards */
    infoCard: {
        flexDirection: 'row', gap: 14, alignItems: 'flex-start',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    criticalCard: { borderColor: '#FF6B35' + '44' },
    infoIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    infoText: { flex: 1, color: CoachTheme.textSecondary, fontSize: 15, lineHeight: 24, paddingTop: 6 },
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

const macroCardStyles = StyleSheet.create({
    card: {
        flex: 1, minWidth: '44%',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 18, padding: 16,
        borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    iconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    label: { color: CoachTheme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
    valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3, marginBottom: 10 },
    value: { color: CoachTheme.text, fontSize: 20, fontWeight: '800' },
    unit: { color: CoachTheme.textMuted, fontSize: 12, fontWeight: '600' },
    pctBarBg: { height: 4, backgroundColor: CoachTheme.sectionBg, borderRadius: 2, overflow: 'hidden' },
    pctBarFill: { height: '100%', borderRadius: 2 },
});
