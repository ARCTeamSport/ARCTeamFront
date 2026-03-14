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

interface NutritionDto {
    id: number;
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    imageUrl: string | null;
    isCustom: boolean;
}

interface SupportDto {
    id: number;
    name: string;
    type: string;
    dosageNotes: string | null;
    imageUrl: string | null;
    isCustom: boolean;
}

const MUSCLE_TRANSLATIONS: Record<string, string> = {
    Chest: 'Göğüs', Back: 'Sırt', Shoulders: 'Omuz', Biceps: 'Ön Kol', Triceps: 'Arka Kol',
    Quads: 'Ön Bacak', Hamstrings: 'Arka Bacak', Calves: 'Kalf', Core: 'Karın', FullBody: 'Tüm Vücut'
};

const CATEGORY_TRANSLATIONS: Record<string, string> = {
    ProteinSource: 'Protein',
    CarbohydrateSource: 'Karbonhidrat',
    HealthyFats: 'Sağlıklı Yağ',
    Vegetables: 'Sebze',
    Fruits: 'Meyve',
    Dairy: 'Süt Ürünleri'
};

const TYPE_TRANSLATIONS: Record<string, string> = {
    Supplement: 'Gıda Takviyesi',
    Vitamin: 'Vitamin/Mineral',
    Vaccine: 'Aşı / Medikal',
    Other: 'Diğer'
};

const SUPPLEMENT_ACCENT = '#F5C518';

// onPress parametresini (prop) buraya ekledik 👇
function SupportCard({ item, onEdit, onDelete, onPress }: { item: SupportDto, onEdit: () => void, onDelete: () => void, onPress?: () => void }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <View style={suppStyles.cardWrapper}>
            <TouchableOpacity
                style={suppStyles.card}
                // Eğer dışarıdan onPress geldiyse onu çalıştır, gelmediyse kartı aşağı doğru aç (expanded)
                onPress={onPress ? onPress : () => setExpanded(p => !p)}
                activeOpacity={0.8}
            >
                <View style={suppStyles.row}>
                    <View style={suppStyles.iconWrap}>
                        <Ionicons name="flask-outline" size={20} color={SUPPLEMENT_ACCENT} />
                    </View>
                    <View style={suppStyles.info}>
                        <Text style={suppStyles.name}>{item.name}</Text>
                        <Text style={suppStyles.timing}>
                            <Ionicons name="pricetag-outline" size={11} color={CoachTheme.textMuted} /> {TYPE_TRANSLATIONS[item.type] || item.type}
                        </Text>
                    </View>
                    <Ionicons
                        // Eğer onPress varsa tıklandığında sayfa değişeceği için ok ikonunu sağa (forward) çevirebiliriz, yoksa aşağı/yukarı ok kalır.
                        name={onPress ? 'chevron-forward' : (expanded ? 'chevron-up' : 'chevron-down')}
                        size={16}
                        color={CoachTheme.textMuted}
                        style={{ marginLeft: 8 }}
                    />
                </View>
                {/* Eğer dışarıdan onPress gelmişse, kart detay sayfasına gidecektir. O yüzden bu alt kısmı açmaya gerek kalmaz. */}
                {!onPress && expanded && (
                    <Text style={suppStyles.description}>{item.dosageNotes || "Not veya ölçü belirtilmemiş."}</Text>
                )}
            </TouchableOpacity>

            {item.isCustom && (
                <View style={styles.actionsBox}>
                    <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
                        <Ionicons name="pencil" size={16} color={CoachTheme.accent} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { marginLeft: 6 }]} onPress={onDelete}>
                        <Ionicons name="trash" size={16} color="#FF453A" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default function LibraryScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('exercises');
    const [search, setSearch] = useState('');

    const [exercises, setExercises] = useState<ExerciseDto[]>([]);
    const [nutritions, setNutritions] = useState<NutritionDto[]>([]);
    const [supports, setSupports] = useState<SupportDto[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const token = await getToken();
            if (!token) return;

            const [exRes, nuRes, suRes] = await Promise.all([
                fetch(API_ENDPOINTS.EXERCISE.GET_LIST, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(API_ENDPOINTS.NUTRITION.GET_LIST, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(API_ENDPOINTS.SUPPORT.GET_LIST, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (exRes.ok) setExercises(await exRes.json());
            if (nuRes.ok) setNutritions(await nuRes.json());
            if (suRes.ok) setSupports(await suRes.json());

        } catch (error) {
            console.error(error);
            Alert.alert("Hata", "Veriler yüklenirken bir sorun oluştu.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const handleDelete = async (id: number, type: Tab) => {
        Alert.alert("Sil", "Bunu silmek istediğinize emin misiniz?", [
            { text: "İptal", style: "cancel" },
            {
                text: "Sil", style: "destructive", onPress: async () => {
                    const token = await getToken();
                    let endpoint = "";
                    if (type === 'exercises') endpoint = API_ENDPOINTS.EXERCISE.DELETE(id);
                    else if (type === 'nutrition') endpoint = API_ENDPOINTS.NUTRITION.DELETE(id);
                    else if (type === 'supplements') endpoint = API_ENDPOINTS.SUPPORT.DELETE(id);

                    const res = await fetch(endpoint, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        if (type === 'exercises') setExercises(prev => prev.filter(e => e.id !== id));
                        else if (type === 'nutrition') setNutritions(prev => prev.filter(n => n.id !== id));
                        else if (type === 'supplements') setSupports(prev => prev.filter(s => s.id !== id));
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

    const groupedNutritions = nutritions.reduce((acc, nu) => {
        const cat = CATEGORY_TRANSLATIONS[nu.category] || nu.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(nu);
        return acc;
    }, {} as Record<string, NutritionDto[]>);

    const groupedSupports = supports.reduce((acc, su) => {
        const cat = TYPE_TRANSLATIONS[su.type] || su.type;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(su);
        return acc;
    }, {} as Record<string, SupportDto[]>);

    const getTabColor = (t: Tab) => {
        if (t === 'exercises') return CoachTheme.accent;
        if (t === 'nutrition') return CoachTheme.statCalorie;
        return SUPPLEMENT_ACCENT;
    };

    const handleFabPress = () => {
        if (tab === 'exercises') router.push('/(coach)/upsert-exercise');
        else if (tab === 'nutrition') router.push('/(coach)/upsert-nutrition');
        else if (tab === 'supplements') router.push('/(coach)/upsert-support');
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Kütüphane</Text>
            </View>

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

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={CoachTheme.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={
                        tab === 'exercises' ? 'Egzersiz ara...' :
                            tab === 'nutrition' ? 'Besin ara...' : 'Destek ara...'
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

            {loading && !refreshing ? (
                <View style={styles.loaderArea}>
                    <ActivityIndicator size="large" color={getTabColor(tab)} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchData(true)}
                            tintColor={getTabColor(tab)}
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
                                                    level={item.level}
                                                    goal={item.goal}
                                                    intensityType={item.intensityType}
                                                    onPress={() => router.push(`/(shared)/exercise/${item.id}` as any)}
                                                />
                                            </View>
                                            {item.isCustom && (
                                                <View style={styles.actionsBox}>
                                                    <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(coach)/upsert-exercise?id=${item.id}` as any)}>
                                                        <Ionicons name="pencil" size={16} color={CoachTheme.accent} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.actionBtn, { marginLeft: 6 }]} onPress={() => handleDelete(item.id, 'exercises')}>
                                                        <Ionicons name="trash" size={16} color="#FF453A" />
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
                        Object.keys(groupedNutritions).map((catName) => {
                            const filtered = groupedNutritions[catName].filter((i) =>
                                i.name.toLowerCase().includes(search.toLowerCase())
                            );
                            if (filtered.length === 0) return null;
                            return (
                                <View key={catName}>
                                    <Text style={styles.sectionTitle}>{catName}</Text>
                                    {filtered.map((item) => (
                                        <View key={item.id} style={styles.itemWrapper}>
                                            <View style={styles.itemMain}>
                                                <NutritionListItem
                                                    name={item.name}
                                                    calories={item.calories}
                                                    protein={item.protein}
                                                    carbs={item.carbohydrates}
                                                    fat={item.fat}
                                                    onPress={() => router.push(`/(shared)/nutrition/${item.id}` as any)}
                                                />
                                            </View>
                                            {item.isCustom && (
                                                <View style={styles.actionsBox}>
                                                    <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(coach)/upsert-nutrition?id=${item.id}` as any)}>
                                                        <Ionicons name="pencil" size={16} color={CoachTheme.accent} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.actionBtn, { marginLeft: 6 }]} onPress={() => handleDelete(item.id, 'nutrition')}>
                                                        <Ionicons name="trash" size={16} color="#FF453A" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            );
                        })
                    )}

                    {tab === 'supplements' && (
                        Object.keys(groupedSupports).map((catName) => {
                            const filtered = groupedSupports[catName].filter((i) =>
                                i.name.toLowerCase().includes(search.toLowerCase())
                            );
                            if (filtered.length === 0) return null;
                            return (
                                <View key={catName}>
                                    <Text style={styles.sectionTitle}>{catName}</Text>
                                    {filtered.map((item) => (
                                        <SupportCard
                                            key={item.id}
                                            item={item}
                                            onEdit={() => router.push(`/(coach)/upsert-support?id=${item.id}` as any)}
                                            onDelete={() => handleDelete(item.id, 'supplements')}
                                            onPress={() => router.push(`/(shared)/support/${item.id}` as any)}
                                        />
                                    ))}
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            )}

            {/* Dynamic FAB based on the active tab */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: getTabColor(tab) }]}
                activeOpacity={0.8}
                onPress={handleFabPress}
            >
                <Ionicons name="add" size={28} color="#0A0E10" />
            </TouchableOpacity>
        </View>
    );
}

const suppStyles = StyleSheet.create({
    cardWrapper: { position: 'relative', marginBottom: 8 },
    card: { backgroundColor: CoachTheme.cardBg, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 14, marginHorizontal: 20, padding: 14, zIndex: 1 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: `${SUPPLEMENT_ACCENT}15`, justifyContent: 'center', alignItems: 'center' },
    info: { flex: 1 },
    name: { color: CoachTheme.text, fontSize: 14, fontWeight: '600' },
    timing: { color: CoachTheme.textMuted, fontSize: 11, marginTop: 2 },
    description: { color: CoachTheme.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: CoachTheme.cardBorder },
});

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: CoachTheme.background },
    header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
    title: { color: CoachTheme.text, fontSize: 28, fontWeight: '800' },
    tabContainer: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: CoachTheme.surface, borderRadius: 14, borderWidth: 1, borderColor: CoachTheme.cardBorder, padding: 4, marginBottom: 12 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: 10 },
    tabActive: { backgroundColor: CoachTheme.cardBg },
    tabText: { color: CoachTheme.textMuted, fontSize: 12, fontWeight: '600' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: CoachTheme.cardBg, borderRadius: 14, borderWidth: 1, borderColor: CoachTheme.cardBorder, marginHorizontal: 20, paddingHorizontal: 14, gap: 10, marginBottom: 16 },
    searchInput: { flex: 1, color: CoachTheme.text, fontSize: 14, paddingVertical: 11 },
    listContent: { paddingBottom: 100 },
    sectionTitle: { color: CoachTheme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10 },
    itemWrapper: { position: 'relative', marginBottom: 8 },
    itemMain: { zIndex: 1 },
    actionsBox: { position: 'absolute', right: 35, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', zIndex: 10, paddingLeft: 10 },
    actionBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: CoachTheme.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: CoachTheme.cardBorder },
    loaderArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fab: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
});
