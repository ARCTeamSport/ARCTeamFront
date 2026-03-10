import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import ExerciseListItem from './components/ExerciseListItem';
import NutritionListItem from './components/NutritionListItem';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';

type Tab = 'exercises' | 'nutrition' | 'supplements';

interface ExerciseDto {
    id: number;
    name: string;
    description: string | null;
    targetMuscle: string;
    equipment: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    isCustom: boolean;
}

const NUTRITION_ITEMS = [
    { name: 'Tavuklu Pilav', calories: 520, protein: 42, carbs: 55, fat: 12 },
    { name: 'Yulaf Ezmesi & Muz', calories: 380, protein: 14, carbs: 62, fat: 8 },
    { name: 'Ton Balıklı Salata', calories: 320, protein: 35, carbs: 15, fat: 14 },
    { name: 'Protein Shake', calories: 280, protein: 40, carbs: 18, fat: 6 },
    { name: 'Yumurta & Avokado Tost', calories: 450, protein: 22, carbs: 35, fat: 25 },
    { name: 'Kıymalı Makarna', calories: 580, protein: 32, carbs: 68, fat: 16 },
    { name: 'Somon & Sebze', calories: 420, protein: 38, carbs: 22, fat: 18 },
];

interface SupplementItem {
    name: string;
    dose: string;
    timing: string;
    category: string;
    icon: string;
    description: string;
}

const SUPPLEMENT_CATEGORIES: Record<string, SupplementItem[]> = {
    'Protein & Amino Asitler': [
        { name: 'Whey Protein', dose: '25–30g', timing: 'Antrenman sonrası', category: 'Protein', icon: 'beaker-outline', description: 'Kas gelişimi ve toparlanma için hızlı emilen protein kaynağı.' },
        { name: 'Kazein Protein', dose: '30g', timing: 'Yatmadan önce', category: 'Protein', icon: 'moon-outline', description: 'Yavaş sindirilen protein. Gece kas yıkımını önler.' },
        { name: 'BCAA', dose: '5–10g', timing: 'Antrenman sırası / sonrası', category: 'Amino Asit', icon: 'git-branch-outline', description: 'Dallı zincirli amino asitler. Kas koruması ve toparlanmayı destekler.' },
        { name: 'Glutamin', dose: '5g', timing: 'Antrenman sonrası', category: 'Amino Asit', icon: 'shield-checkmark-outline', description: 'Bağışıklık sistemini güçlendirir, toparlanmayı hızlandırır.' },
    ],
    'Performans': [
        { name: 'Kreatin Monohidrat', dose: '3–5g', timing: 'Her gün (zamansız)', category: 'Performans', icon: 'flash-outline', description: 'Güç ve patlayıcı performansı artırır. En çok araştırılmış supplement.' },
        { name: 'Pre-Workout', dose: '1 porsiyon', timing: '30dk önce', category: 'Performans', icon: 'thunderstorm-outline', description: 'Enerji, odaklanma ve pompayı artırır. Kafein bazlı formül.' },
        { name: 'Beta-Alanin', dose: '3.2g', timing: 'Antrenman öncesi', category: 'Performans', icon: 'trending-up-outline', description: 'Kas yorgunluğunu geciktirir, dayanıklılığı artırır.' },
        { name: 'Kafein', dose: '150–200mg', timing: '30–45dk önce', category: 'Performans', icon: 'cafe-outline', description: 'Zihinsel odak ve fiziksel performansı geçici olarak artırır.' },
    ],
    'Vitamin & Mineral': [
        { name: 'Vitamin D3', dose: '1000–2000 IU', timing: 'Sabah (yemekle)', category: 'Vitamin', icon: 'sunny-outline', description: 'Kemik sağlığı, hormon dengesi ve bağışıklık için kritik.' },
        { name: 'Omega-3 (Balık Yağı)', dose: '1–3g EPA+DHA', timing: 'Yemekle', category: 'Yağ Asidi', icon: 'water-outline', description: 'Eklem sağlığı, kalp ve anti-inflamatuar etki.' },
        { name: 'Magnezyum', dose: '200–400mg', timing: 'Yatmadan önce', category: 'Mineral', icon: 'planet-outline', description: 'Kas gevşemesi, uyku kalitesi ve sinir sistemi sağlığı.' },
        { name: 'Çinko', dose: '15–30mg', timing: 'Yemekle', category: 'Mineral', icon: 'nuclear-outline', description: 'Testosteron üretimi ve bağışıklık sistemini destekler.' },
    ],
};

const MUSCLE_TRANSLATIONS: Record<string, string> = {
    Chest: 'Göğüs', Back: 'Sırt', Shoulders: 'Omuz', Biceps: 'Ön Kol', Triceps: 'Arka Kol',
    Quads: 'Ön Bacak', Hamstrings: 'Arka Bacak', Calves: 'Kalf', Core: 'Karın', FullBody: 'Tüm Vücut'
};

const SUPPLEMENT_ACCENT = '#F5C518';

function SupplementCard({ item }: { item: SupplementItem }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <TouchableOpacity
            style={suppStyles.card}
            onPress={() => setExpanded(p => !p)}
            activeOpacity={0.8}
        >
            <View style={suppStyles.row}>
                <View style={suppStyles.iconWrap}>
                    <Ionicons name={item.icon as any} size={20} color={SUPPLEMENT_ACCENT} />
                </View>
                <View style={suppStyles.info}>
                    <Text style={suppStyles.name}>{item.name}</Text>
                    <Text style={suppStyles.timing}>
                        <Ionicons name="time-outline" size={11} color={CoachTheme.textMuted} /> {item.timing}
                    </Text>
                </View>
                <View style={suppStyles.doseBadge}>
                    <Text style={suppStyles.doseText}>{item.dose}</Text>
                </View>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={CoachTheme.textMuted}
                    style={{ marginLeft: 8 }}
                />
            </View>
            {expanded && (
                <Text style={suppStyles.description}>{item.description}</Text>
            )}
        </TouchableOpacity>
    );
}

export default function LibraryScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('exercises');
    const [search, setSearch] = useState('');

    const [exercises, setExercises] = useState<ExerciseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchExercises = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const token = await getToken();
            if (!token) return;

            const res = await fetch(API_ENDPOINTS.EXERCISE.GET_LIST, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setExercises(data);
            } else {
                Alert.alert("Hata", "Egzersizler yüklenirken bir sorun oluştu.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Hata", "Sunucu bağlantı hatası.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchExercises();
        }, [])
    );

    const handleDelete = async (id: number) => {
        Alert.alert("Sil", "Bu egzersizi silmek istediğinize emin misiniz?", [
            { text: "İptal", style: "cancel" },
            {
                text: "Sil", style: "destructive", onPress: async () => {
                    const token = await getToken();
                    const res = await fetch(API_ENDPOINTS.EXERCISE.DELETE(id), {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        setExercises(prev => prev.filter(e => e.id !== id));
                    } else {
                        Alert.alert("Hata", "Silinemedi.");
                    }
                }
            }
        ]);
    };

    const groupedExercises = exercises.reduce((acc, ex) => {
        const cat = MUSCLE_TRANSLATIONS[ex.targetMuscle] || ex.targetMuscle;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(ex);
        return acc;
    }, {} as Record<string, ExerciseDto[]>);

    // Supplement search filter
    const filteredSupplements = Object.entries(SUPPLEMENT_CATEGORIES).reduce((acc, [cat, items]) => {
        const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
        if (filtered.length > 0) acc[cat] = filtered;
        return acc;
    }, {} as Record<string, SupplementItem[]>);

    const getTabColor = (t: Tab) => {
        if (t === 'exercises') return CoachTheme.accent;
        if (t === 'nutrition') return CoachTheme.statCalorie;
        return SUPPLEMENT_ACCENT;
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Kütüphane</Text>
            </View>

            {/* Tab Switcher — 3 tabs */}
            <View style={styles.tabContainer}>
                {([
                    { key: 'exercises', label: 'Egzersizler', icon: 'barbell' },
                    { key: 'nutrition', label: 'Beslenme', icon: 'nutrition' },
                    { key: 'supplements', label: 'Destek', icon: 'flask' },
                ] as { key: Tab; label: string; icon: string }[]).map(t => {
                    const active = tab === t.key;
                    const color = getTabColor(t.key);
                    return (
                        <TouchableOpacity
                            key={t.key}
                            style={[styles.tab, active && styles.tabActive]}
                            onPress={() => { setTab(t.key); setSearch(''); }}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={t.icon as any}
                                size={15}
                                color={active ? color : CoachTheme.textMuted}
                            />
                            <Text style={[styles.tabText, active && { color }]}>
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={CoachTheme.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={
                        tab === 'exercises' ? 'Egzersiz ara...' :
                            tab === 'nutrition' ? 'Yemek ara...' : 'Supplement ara...'
                    }
                    placeholderTextColor={CoachTheme.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={18} color={CoachTheme.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Content */}
            {loading && tab === 'exercises' && exercises.length === 0 ? (
                <View style={styles.loaderArea}>
                    <ActivityIndicator size="large" color={CoachTheme.accent} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchExercises(true)}
                            tintColor={CoachTheme.accent}
                        />
                    }
                >
                    {tab === 'exercises' && (
                        Object.keys(groupedExercises).map((catName) => {
                            const filtered = groupedExercises[catName].filter((i) =>
                                i.name.toLowerCase().includes(search.toLowerCase())
                            );
                            if (filtered.length === 0) return null;
                            return (
                                <View key={catName}>
                                    <Text style={styles.sectionTitle}>{catName}</Text>
                                    {filtered.map((item) => (
                                        <View key={item.id} style={styles.itemWrapper}>
                                            <View style={styles.itemMain}>
                                                <ExerciseListItem
                                                    name={item.name}
                                                    category={`${catName} - ${item.equipment}`}
                                                    hasVideo={!!item.videoUrl}
                                                />
                                            </View>
                                            {item.isCustom && (
                                                <View style={styles.actionsBox}>
                                                    <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(coach)/upsert-exercise?id=${item.id}` as any)}>
                                                        <Ionicons name="pencil" size={18} color={CoachTheme.accent} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.actionBtn, { marginLeft: 6 }]} onPress={() => handleDelete(item.id)}>
                                                        <Ionicons name="trash" size={18} color="#FF453A" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            );
                        })
                    )}

                    {tab === 'nutrition' && (
                        <>
                            <Text style={styles.sectionTitle}>Hazır Öğünler</Text>
                            {NUTRITION_ITEMS.filter((i) =>
                                i.name.toLowerCase().includes(search.toLowerCase())
                            ).map((item) => (
                                <NutritionListItem key={item.name} {...item} />
                            ))}
                        </>
                    )}

                    {tab === 'supplements' && (
                        <>
                            {/* Info banner */}
                            <View style={suppStyles.infoBanner}>
                                <Ionicons name="information-circle-outline" size={16} color={SUPPLEMENT_ACCENT} />
                                <Text style={suppStyles.infoBannerText}>
                                    Karta tıklayarak detay ve kullanım bilgisini görün.
                                </Text>
                            </View>

                            {Object.keys(filteredSupplements).length === 0 ? (
                                <View style={suppStyles.emptyState}>
                                    <Ionicons name="flask-outline" size={48} color={CoachTheme.textMuted} />
                                    <Text style={suppStyles.emptyText}>Supplement bulunamadı</Text>
                                </View>
                            ) : (
                                Object.entries(filteredSupplements).map(([cat, items]) => (
                                    <View key={cat}>
                                        <Text style={styles.sectionTitle}>{cat}</Text>
                                        {items.map(item => (
                                            <SupplementCard key={item.name} item={item} />
                                        ))}
                                    </View>
                                ))
                            )}
                        </>
                    )}
                </ScrollView>
            )}

            {/* FAB — only on exercises tab */}
            {tab === 'exercises' && (
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(coach)/upsert-exercise')}
                >
                    <Ionicons name="add" size={28} color={CoachTheme.background} />
                </TouchableOpacity>
            )}
        </View>
    );
}

// ─── Supplement Card Styles ───────────────────────────────────────────────────
const suppStyles = StyleSheet.create({
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: `${SUPPLEMENT_ACCENT}12`,
        borderWidth: 1,
        borderColor: `${SUPPLEMENT_ACCENT}30`,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    infoBannerText: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        flex: 1,
    },
    card: {
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        borderRadius: 14,
        marginHorizontal: 20,
        marginBottom: 8,
        padding: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: `${SUPPLEMENT_ACCENT}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: { flex: 1 },
    name: {
        color: CoachTheme.text,
        fontSize: 14,
        fontWeight: '600',
    },
    timing: {
        color: CoachTheme.textMuted,
        fontSize: 11,
        marginTop: 2,
    },
    doseBadge: {
        backgroundColor: `${SUPPLEMENT_ACCENT}20`,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    doseText: {
        color: SUPPLEMENT_ACCENT,
        fontSize: 12,
        fontWeight: '700',
    },
    description: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        lineHeight: 19,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: CoachTheme.cardBorder,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 12,
    },
    emptyText: {
        color: CoachTheme.textMuted,
        fontSize: 14,
    },
});

// ─── Main Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: CoachTheme.background },
    header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
    title: { color: CoachTheme.text, fontSize: 28, fontWeight: '800' },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: CoachTheme.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 4,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 10,
        borderRadius: 10,
    },
    tabActive: { backgroundColor: CoachTheme.cardBg },
    tabText: { color: CoachTheme.textMuted, fontSize: 12, fontWeight: '600' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        marginHorizontal: 20,
        paddingHorizontal: 14,
        gap: 10,
        marginBottom: 16,
    },
    searchInput: { flex: 1, color: CoachTheme.text, fontSize: 14, paddingVertical: 11 },
    listContent: { paddingBottom: 100 },
    sectionTitle: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 10,
    },
    itemWrapper: { position: 'relative', marginBottom: 8 },
    itemMain: { zIndex: 1 },
    actionsBox: {
        position: 'absolute',
        right: 35,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        zIndex: 10,
    },
    actionBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: CoachTheme.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
    },
    loaderArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: CoachTheme.fabBg,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: CoachTheme.fabShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
});
