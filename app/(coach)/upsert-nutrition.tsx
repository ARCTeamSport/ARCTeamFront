import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Alert, Animated, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';

const ACCENT = '#FF453A';

// ── Hedef Sistem (s) ──────────────────────────────────────────────
const SYSTEMS = [
    'Protein', 'Karbonhidrat', 'Yağ', 'Sebze', 'Baharat', 'Hidrasyon',
    'Pre-Workout', 'Post-Workout', 'Gece', 'Kilo Verme', 'Hacim',
    'Smoothie', 'Özel', 'Atlet', 'Vejetaryen', 'Keto', 'Global'
] as const;

const SYSTEM_IONICONS: Record<string, string> = {
    'Protein': 'fitness-outline',
    'Karbonhidrat': 'leaf-outline',
    'Yağ': 'water-outline',
    'Sebze': 'nutrition-outline',
    'Baharat': 'flame-outline',
    'Hidrasyon': 'water-outline',
    'Pre-Workout': 'flash-outline',
    'Post-Workout': 'barbell-outline',
    'Gece': 'moon-outline',
    'Kilo Verme': 'scale-outline',
    'Hacim': 'trending-up-outline',
    'Smoothie': 'cafe-outline',
    'Özel': 'star-outline',
    'Atlet': 'walk-outline',
    'Vejetaryen': 'leaf-outline',
    'Keto': 'egg-outline',
    'Global': 'globe-outline',
};

const SYSTEM_COLORS: Record<string, string> = {
    'Protein': '#ef4444', 'Karbonhidrat': '#22c55e', 'Yağ': '#f59e0b', 'Sebze': '#10b981',
    'Baharat': '#f97316', 'Hidrasyon': '#06b6d4', 'Pre-Workout': '#8b5cf6', 'Post-Workout': '#14b8a6',
    'Gece': '#6366f1', 'Kilo Verme': '#84cc16', 'Hacim': '#e11d48', 'Smoothie': '#a855f7',
    'Özel': '#0ea5e9', 'Atlet': '#f43f5e', 'Vejetaryen': '#4ade80', 'Keto': '#fbbf24', 'Global': '#ec4899'
};

// ── Alt Sistem (a) ────────────────────────────────────────────────
const SUB_SYSTEMS: Record<string, string[]> = {
    'Protein': ['Hayvansal', 'Süt Ürünü', 'Bitkisel'],
    'Karbonhidrat': ['Tam Tahıl', 'Nişastalı Sebze', 'Meyve'],
    'Yağ': ['Tekli Doymamış', 'Çoklu Doymamış', 'Doymuş', 'Kuruyemiş', 'Tohum'],
    'Sebze': ['Yeşil Yapraklı', 'Renkli', 'Cruciferous', 'Soğan'],
    'Baharat': ['Antienflamatuar', 'Termojenik', 'Sindirim', 'Antioksidan', 'Kan Şekeri'],
    'Hidrasyon': ['Su', 'Elektrolit', 'Çay', 'Kahve'],
    'Pre-Workout': ['Hızlı Karb', 'Yavaş Karb', 'Nitrat'],
    'Post-Workout': ['Hızlı Protein', 'Tam Öğün', 'Glukoz', 'Meyve Şekeri'],
    'Gece': ['Yavaş Protein', 'Combo', 'Uyku Desteği'],
    'Kilo Verme': ['Düşük Kalori', 'Doyurucu', 'Hacim', 'Ara Öğün'],
    'Hacim': ['Yoğun Kalori', 'Kolay Kalori', 'Gece'],
    'Smoothie': ['Pre', 'Post', 'Yeşil', 'Berry'],
    'Özel': ['Hastalık', 'Kas Krampı', 'Sindirim', 'Bağışıklık'],
    'Atlet': ['Dayanıklılık', 'Yarış Günü', 'Toparlanma'],
    'Vejetaryen': ['Protein', 'Tam Protein', 'Yüksek Protein'],
    'Keto': ['Ana Öğün', 'Kahvaltı', 'Ara Öğün'],
    'Global': ['Japon', 'Meksika', 'Akdeniz', 'Hint', 'Kore'],
};

// ── Seviye (v) ────────────────────────────────────────────────────
const LEVELS = ['Başlangıç', 'Orta', 'İleri'] as const;
const LEVEL_COLORS: Record<string, string> = {
    'Başlangıç': '#22c55e', 'Orta': '#06b6d4', 'İleri': '#ef4444'
};

// ── Besin Kategorisi (k) ──────────────────────────────────────────
const FOOD_CATEGORIES = [
    'Beyaz Et', 'Kırmızı Et', 'Organ Et', 'Yumurta', 'Balık', 'Deniz Ürünü',
    'Peynir', 'Süt Ürünü', 'Süt', 'Baklagil', 'Soya', 'Tahıl', 'Makarna',
    'Ekmek', 'Sebze', 'Meyve', 'Yağ', 'Kuruyemiş', 'Tohum', 'İçecek',
    'Baharat', 'Kombo', 'İşlenmiş', 'Çorba'
] as const;

const FOOD_CATEGORY_IONICONS: Record<string, string> = {
    'Beyaz Et': 'restaurant-outline', 'Kırmızı Et': 'fitness-outline',
    'Organ Et': 'heart-outline', 'Yumurta': 'egg-outline',
    'Balık': 'fish-outline', 'Deniz Ürünü': 'fish-outline',
    'Peynir': 'cube-outline', 'Süt Ürünü': 'cafe-outline',
    'Süt': 'cafe-outline', 'Baklagil': 'ellipse-outline',
    'Soya': 'leaf-outline', 'Tahıl': 'grid-outline',
    'Makarna': 'restaurant-outline', 'Ekmek': 'pizza-outline',
    'Sebze': 'nutrition-outline', 'Meyve': 'nutrition-outline',
    'Yağ': 'water-outline', 'Kuruyemiş': 'ellipse-outline',
    'Tohum': 'flower-outline', 'İçecek': 'beer-outline',
    'Baharat': 'flame-outline', 'Kombo': 'layers-outline',
    'İşlenmiş': 'construct-outline', 'Çorba': 'beaker-outline',
};

// ── Zamanlama (z) ─────────────────────────────────────────────────
const TIMINGS = [
    'Ana Öğün', 'Kahvaltı', 'Ara Öğün', 'Pre-workout', 'Post',
    'Gece', 'Kahvaltı/Post', 'Pre/Ana Öğün', 'Pre/Post',
    'Salata', 'Pişirme', 'Sürekli', 'Sabah', 'Baharat'
] as const;

const TIMING_IONICONS: Record<string, string> = {
    'Ana Öğün': 'restaurant-outline', 'Kahvaltı': 'sunny-outline',
    'Ara Öğün': 'fast-food-outline', 'Pre-workout': 'flash-outline',
    'Post': 'barbell-outline', 'Gece': 'moon-outline',
    'Kahvaltı/Post': 'sunny-outline', 'Pre/Ana Öğün': 'flash-outline',
    'Pre/Post': 'flash-outline', 'Salata': 'nutrition-outline',
    'Pişirme': 'flame-outline', 'Sürekli': 'infinite-outline',
    'Sabah': 'sunny-outline', 'Baharat': 'flame-outline',
};

// ── Makro Renkleri ────────────────────────────────────────────────
const MACRO_COLORS = {
    protein: '#ef4444',
    carb: '#22c55e',
    fat: '#f59e0b',
    calorie: '#8b5cf6',
    fiber: '#14b8a6',
};

// ── Steps config ─────────────────────────────────────────────────
const STEPS = [
    { id: 1, title: 'Temel Bilgi', icon: 'nutrition-outline', desc: 'İsim ve porsiyon' },
    { id: 2, title: 'Sınıflandırma', icon: 'layers-outline', desc: 'Sistem ve kategori' },
    { id: 3, title: 'Makro Değerler', icon: 'analytics-outline', desc: 'Kalori ve besin değerleri' },
    { id: 4, title: 'Detaylar', icon: 'document-text-outline', desc: 'Zamanlama ve notlar' },
];

// ══════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ══════════════════════════════════════════════════════════════════

function StepIndicator({ currentStep }: { currentStep: number }) {
    return (
        <View style={styles.stepIndicatorRow}>
            {STEPS.map((s, i) => {
                const isActive = s.id === currentStep;
                const isDone = s.id < currentStep;
                return (
                    <React.Fragment key={s.id}>
                        <View style={styles.stepDot}>
                            <View style={[
                                styles.stepCircle,
                                isDone && styles.stepCircleDone,
                                isActive && styles.stepCircleActive,
                            ]}>
                                {isDone
                                    ? <Ionicons name="checkmark" size={12} color="#fff" />
                                    : <Text style={[
                                        styles.stepNum,
                                        isActive && { color: '#fff', fontWeight: '700' },
                                    ]}>{s.id}</Text>
                                }
                            </View>
                            {isActive && (
                                <Text style={styles.stepLabel} numberOfLines={1}>{s.title}</Text>
                            )}
                        </View>
                        {i < STEPS.length - 1 && (
                            <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

function InputField({
    icon, placeholder, value, onChangeText, multiline, keyboardType,
}: {
    icon: string; placeholder: string; value: string;
    onChangeText: (t: string) => void; multiline?: boolean;
    keyboardType?: 'default' | 'numeric';
}) {
    return (
        <View style={[styles.inputWrapper, multiline && { height: 90, alignItems: 'flex-start', paddingTop: 12 }]}>
            <Ionicons name={icon as any} size={17} color={CoachTheme.textMuted} style={{ marginTop: multiline ? 2 : 0 }} />
            <TextInput
                style={[styles.input, multiline && { textAlignVertical: 'top' }]}
                placeholder={placeholder}
                placeholderTextColor={CoachTheme.textMuted}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                keyboardType={keyboardType || 'default'}
            />
        </View>
    );
}

function ChipRow({
    options, selected, onSelect, colorMap, ioniconMap,
}: {
    options: readonly string[] | string[];
    selected: string;
    onSelect: (val: string) => void;
    colorMap?: Record<string, string>;
    ioniconMap?: Record<string, string>;
}) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {(options as string[]).map(opt => {
                const active = selected === opt;
                const color = colorMap?.[opt] || ACCENT;
                const iconName = ioniconMap?.[opt];
                return (
                    <TouchableOpacity
                        key={opt}
                        onPress={() => onSelect(active ? '' : opt)}
                        activeOpacity={0.75}
                        style={[
                            styles.chip,
                            active && { backgroundColor: color + '22', borderColor: color },
                        ]}
                    >
                        {iconName && (
                            <Ionicons
                                name={iconName as any}
                                size={14}
                                color={active ? color : CoachTheme.textMuted}
                                style={{ marginRight: 5 }}
                            />
                        )}
                        <Text style={[styles.chipText, active && { color, fontWeight: '700' }]}>
                            {opt}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

function ChipGrid({
    options, selected, onSelect, colorMap, ioniconMap,
}: {
    options: readonly string[] | string[];
    selected: string;
    onSelect: (val: string) => void;
    colorMap?: Record<string, string>;
    ioniconMap?: Record<string, string>;
}) {
    return (
        <View style={styles.chipGridWrap}>
            {(options as string[]).map(opt => {
                const active = selected === opt;
                const color = colorMap?.[opt] || ACCENT;
                const iconName = ioniconMap?.[opt];
                return (
                    <TouchableOpacity
                        key={opt}
                        onPress={() => onSelect(active ? '' : opt)}
                        activeOpacity={0.75}
                        style={[
                            styles.chip,
                            active && { backgroundColor: color + '22', borderColor: color },
                        ]}
                    >
                        {iconName && (
                            <Ionicons
                                name={iconName as any}
                                size={14}
                                color={active ? color : CoachTheme.textMuted}
                                style={{ marginRight: 5 }}
                            />
                        )}
                        <Text style={[styles.chipText, active && { color, fontWeight: '700' }]}>
                            {opt}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function StepCard({
    icon, iconColor, title, subtitle, children, variant,
}: {
    icon: string; iconColor?: string; title: string; subtitle: string;
    children: React.ReactNode; variant?: 'default' | 'warning';
}) {
    return (
        <View style={[styles.stepCard, variant === 'warning' && styles.stepCardWarning]}>
            <View style={styles.stepCardHeader}>
                <View style={[
                    styles.stepCardIcon,
                    { backgroundColor: (iconColor || ACCENT) + '18' },
                ]}>
                    <Ionicons name={icon as any} size={20} color={iconColor || ACCENT} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[
                        styles.stepCardTitle,
                        variant === 'warning' && { color: '#ef4444' },
                    ]}>{title}</Text>
                    <Text style={styles.stepCardSub}>{subtitle}</Text>
                </View>
            </View>
            {children}
        </View>
    );
}

function SummaryRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
    return (
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : null]} numberOfLines={1}>{value}</Text>
        </View>
    );
}

// ══════════════════════════════════════════════════════════════════
// ANA EKRAN
// ══════════════════════════════════════════════════════════════════

export default function UpsertNutritionScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState(1);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0.25)).current;

    const [name, setName] = useState('');
    const [portion, setPortion] = useState('');
    const [system, setSystem] = useState('');
    const [subSystem, setSubSystem] = useState('');
    const [level, setLevel] = useState('');
    const [foodCategory, setFoodCategory] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbohydrates, setCarbo] = useState('');
    const [fat, setFat] = useState('');
    const [fiber, setFiber] = useState('');
    const [timing, setTiming] = useState('');
    const [mainBenefit, setMainBenefit] = useState('');
    const [combination, setCombination] = useState('');
    const [criticalNote, setCriticalNote] = useState('');

    const subSystemOptions = useMemo(
        () => (system ? SUB_SYSTEMS[system] || [] : []),
        [system]
    );

    useEffect(() => { setSubSystem(''); }, [system]);
    useEffect(() => { if (isEdit) fetchDetails(); }, [id]);
    useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: step / STEPS.length,
            useNativeDriver: false, tension: 60, friction: 8,
        }).start();
    }, [step]);

    const goToStep = (next: number) => {
        Animated.sequence([
            Animated.timing(slideAnim, { toValue: -20, duration: 80, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        ]).start();
        setStep(next);
    };

    const fetchDetails = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/Nutrition/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setName(data.name || ''); setSystem(data.system || data.category || '');
                setSubSystem(data.subSystem || ''); setLevel(data.level || '');
                setFoodCategory(data.foodCategory || ''); setPortion(data.portion || '');
                setCalories(data.calories?.toString() || ''); setProtein(data.protein?.toString() || '');
                setCarbo(data.carbohydrates?.toString() || ''); setFat(data.fat?.toString() || '');
                setFiber(data.fiber?.toString() || ''); setTiming(data.timing || '');
                setMainBenefit(data.mainBenefit || ''); setCombination(data.combination || '');
                setCriticalNote(data.criticalNote || '');
            } else { Alert.alert('Hata', 'Besin bilgileri çekilemedi.'); router.back(); }
        } catch { Alert.alert('Hata', 'Sunucu bağlantı hatası.'); router.back(); }
        finally { setLoading(false); }
    };

    const handleNext = () => {
        if (step === 1 && !name.trim()) { Alert.alert('Eksik Bilgi', 'Lütfen besin adını girin.'); return; }
        if (step === 2 && !system) { Alert.alert('Eksik Bilgi', 'Lütfen hedef sistemi seçin.'); return; }
        if (step < STEPS.length) goToStep(step + 1);
        else handleSave();
    };

    const handleSave = async () => {
        if (!name.trim() || !system) { Alert.alert('Eksik Bilgi', 'Lütfen besin adını ve hedef sistemi seçin.'); return; }
        try {
            setSaving(true);
            const token = await getToken();
            const payload = {
                id: isEdit ? Number(id) : 0, name, category: system, system, subSystem, level, foodCategory, portion,
                calories: parseFloat(calories) || 0, protein: parseFloat(protein) || 0,
                carbohydrates: parseFloat(carbohydrates) || 0, fat: parseFloat(fat) || 0,
                fiber: parseFloat(fiber) || 0, timing, mainBenefit, combination, criticalNote,
                imageUrl: null, isCustom: true,
            };
            const url = isEdit ? API_ENDPOINTS.NUTRITION.UPDATE(Number(id)) : API_ENDPOINTS.NUTRITION.CREATE;
            const method = isEdit ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) { Alert.alert('Başarılı', `Besin başarıyla ${isEdit ? 'güncellendi' : 'eklendi'}.`); router.back(); }
            else { const errText = await res.text(); Alert.alert('Hata', 'Kaydetme başarısız: ' + errText); }
        } catch (err) { console.error(err); Alert.alert('Hata', 'Sunucu bağlantı hatası.'); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (<View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={ACCENT} /></View>);
    }

    const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
    const currentStepInfo = STEPS[step - 1];

    const renderMacroBar = () => {
        const p = parseFloat(protein) || 0; const c = parseFloat(carbohydrates) || 0; const f = parseFloat(fat) || 0;
        const total = p + c + f; if (total === 0) return null;
        const pPct = Math.round((p / total) * 100); const cPct = Math.round((c / total) * 100); const fPct = 100 - pPct - cPct;
        return (
            <View style={styles.macroBarCard}>
                <Text style={styles.macroBarTitle}>Makro Dağılımı</Text>
                <View style={styles.macroBarTrack}>
                    <View style={[styles.macroBarSeg, { flex: p, backgroundColor: MACRO_COLORS.protein, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }]} />
                    <View style={{ width: 2 }} />
                    <View style={[styles.macroBarSeg, { flex: c, backgroundColor: MACRO_COLORS.carb }]} />
                    <View style={{ width: 2 }} />
                    <View style={[styles.macroBarSeg, { flex: f, backgroundColor: MACRO_COLORS.fat, borderTopRightRadius: 4, borderBottomRightRadius: 4 }]} />
                </View>
                <View style={styles.macroBarLegend}>
                    <View style={styles.macroBarLegendItem}><View style={[styles.macroBarDot, { backgroundColor: MACRO_COLORS.protein }]} /><Text style={[styles.macroBarLegendText, { color: MACRO_COLORS.protein }]}>P {pPct}%</Text></View>
                    <View style={styles.macroBarLegendItem}><View style={[styles.macroBarDot, { backgroundColor: MACRO_COLORS.carb }]} /><Text style={[styles.macroBarLegendText, { color: MACRO_COLORS.carb }]}>K {cPct}%</Text></View>
                    <View style={styles.macroBarLegendItem}><View style={[styles.macroBarDot, { backgroundColor: MACRO_COLORS.fat }]} /><Text style={[styles.macroBarLegendText, { color: MACRO_COLORS.fat }]}>Y {fPct}%</Text></View>
                </View>
            </View>
        );
    };

    const MacroInputRow = ({ label, value, onChange, color, icon }: { label: string; value: string; onChange: (v: string) => void; color: string; icon: string }) => (
        <View style={[styles.macroInputRow, { borderColor: value ? `${color}40` : CoachTheme.cardBorder }]}>
            <Ionicons name={icon as any} size={16} color={color} style={{ marginRight: 4 }} />
            <Text style={styles.macroInputLabel}>{label}</Text>
            <TextInput style={[styles.macroInputField, { color }]} placeholder="0" placeholderTextColor={CoachTheme.textMuted} keyboardType="numeric" value={value} onChangeText={onChange} />
        </View>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <StepCard icon="nutrition-outline" title="Besin Adı" subtitle="Zorunlu alan">
                            <InputField icon="nutrition-outline" placeholder="Örn: Tavuk Göğsü, Yulaf Ezmesi" value={name} onChangeText={setName} />
                        </StepCard>
                        <StepCard icon="scale-outline" title="Porsiyon" subtitle="Miktar bilgisi">
                            <InputField icon="scale-outline" placeholder="Örn: 100g, 1 adet (50g), 250ml" value={portion} onChangeText={setPortion} />
                        </StepCard>
                    </Animated.View>
                );
            case 2:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <StepCard icon="fitness-outline" title="Hedef Sistem" subtitle="Bu besin neyi hedefliyor? (Zorunlu)">
                            <ChipGrid options={SYSTEMS} selected={system} onSelect={setSystem} colorMap={SYSTEM_COLORS} ioniconMap={SYSTEM_IONICONS} />
                        </StepCard>
                        {subSystemOptions.length > 0 && (
                            <StepCard icon="git-branch-outline" title="Alt Sistem" subtitle="İsteğe bağlı detay">
                                <ChipRow options={subSystemOptions} selected={subSystem} onSelect={setSubSystem} />
                            </StepCard>
                        )}
                        <StepCard icon="stats-chart-outline" title="Kullanıcı Seviyesi" subtitle="Kime uygun?">
                            <View style={styles.levelRow}>
                                {LEVELS.map(opt => {
                                    const active = level === opt; const color = LEVEL_COLORS[opt];
                                    return (
                                        <TouchableOpacity key={opt} onPress={() => setLevel(active ? '' : opt)} activeOpacity={0.75}
                                            style={[styles.levelCard, active && { borderColor: color, backgroundColor: color + '18' }]}>
                                            <View style={[styles.levelDot, { backgroundColor: color }]} />
                                            <Text style={[styles.levelText, active && { color, fontWeight: '700' }]}>{opt}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </StepCard>
                        <StepCard icon="restaurant-outline" title="Besin Kategorisi" subtitle="Besin türünü seçin">
                            <ChipGrid options={FOOD_CATEGORIES} selected={foodCategory} onSelect={setFoodCategory} ioniconMap={FOOD_CATEGORY_IONICONS} />
                        </StepCard>
                    </Animated.View>
                );
            case 3:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <StepCard icon="flame-outline" iconColor={MACRO_COLORS.calorie} title="Kalori" subtitle="Toplam enerji değeri">
                            <View style={styles.calorieRow}>
                                <TextInput style={styles.calorieInput} placeholder="0" placeholderTextColor={`${MACRO_COLORS.calorie}55`} keyboardType="numeric" value={calories} onChangeText={setCalories} />
                                <Text style={styles.calorieUnit}>kcal</Text>
                            </View>
                        </StepCard>
                        <StepCard icon="bar-chart-outline" title="Besin Değerleri" subtitle="Makro ve lif bilgileri">
                            <View style={styles.macroGrid}>
                                <MacroInputRow label="Protein (g)" value={protein} onChange={setProtein} color={MACRO_COLORS.protein} icon="fitness-outline" />
                                <MacroInputRow label="Karbonhidrat (g)" value={carbohydrates} onChange={setCarbo} color={MACRO_COLORS.carb} icon="leaf-outline" />
                                <MacroInputRow label="Yağ (g)" value={fat} onChange={setFat} color={MACRO_COLORS.fat} icon="water-outline" />
                                <MacroInputRow label="Lif (g)" value={fiber} onChange={setFiber} color={MACRO_COLORS.fiber} icon="flower-outline" />
                            </View>
                        </StepCard>
                        {renderMacroBar()}
                    </Animated.View>
                );
            case 4:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <StepCard icon="time-outline" title="Zamanlama" subtitle="Ne zaman tüketilmeli?">
                            <ChipRow options={TIMINGS} selected={timing} onSelect={setTiming} ioniconMap={TIMING_IONICONS} />
                        </StepCard>
                        <StepCard icon="heart-outline" title="Ana Faydası" subtitle="Bu besinin temel katkısı">
                            <InputField icon="heart-outline" placeholder="Örn: Yağsız protein, Omega-3, Probiyotik" value={mainBenefit} onChangeText={setMainBenefit} />
                        </StepCard>
                        <StepCard icon="link-outline" title="Kombinasyon" subtitle="Birlikte iyi giden besinler">
                            <InputField icon="link-outline" placeholder="Örn: Pilav, Sebze, Limon" value={combination} onChangeText={setCombination} />
                        </StepCard>
                        <StepCard icon="warning-outline" iconColor="#ef4444" title="Kritik Not" subtitle="Uyarı / dikkat edilmesi gerekenler" variant="warning">
                            <InputField icon="warning-outline" placeholder="Örn: Haftada 2-3 kez, Derisiz tercih" value={criticalNote} onChangeText={setCriticalNote} multiline />
                        </StepCard>
                        {name.trim() && system ? (
                            <View style={styles.summaryCard}>
                                <View style={styles.summaryHeader}>
                                    <Ionicons name="checkmark-circle" size={18} color={ACCENT} />
                                    <Text style={styles.summaryTitle}>Kayıt Özeti</Text>
                                </View>
                                <View style={styles.summaryBody}>
                                    <SummaryRow label="Besin" value={name} />
                                    <SummaryRow label="Sistem" value={system} valueColor={SYSTEM_COLORS[system]} />
                                    {subSystem ? <SummaryRow label="Alt Sistem" value={subSystem} /> : null}
                                    {level ? <SummaryRow label="Seviye" value={level} valueColor={LEVEL_COLORS[level]} /> : null}
                                    {foodCategory ? <SummaryRow label="Kategori" value={foodCategory} /> : null}
                                    {portion ? <SummaryRow label="Porsiyon" value={portion} /> : null}
                                    {calories ? <SummaryRow label="Kalori" value={`${calories} kcal`} valueColor={MACRO_COLORS.calorie} /> : null}
                                    {protein ? <SummaryRow label="Protein" value={`${protein}g`} valueColor={MACRO_COLORS.protein} /> : null}
                                    {carbohydrates ? <SummaryRow label="Karb." value={`${carbohydrates}g`} valueColor={MACRO_COLORS.carb} /> : null}
                                    {fat ? <SummaryRow label="Yağ" value={`${fat}g`} valueColor={MACRO_COLORS.fat} /> : null}
                                    {timing ? <SummaryRow label="Zamanlama" value={timing} /> : null}
                                    {mainBenefit ? <SummaryRow label="Fayda" value={mainBenefit} /> : null}
                                </View>
                            </View>
                        ) : null}
                    </Animated.View>
                );
            default: return null;
        }
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => step > 1 ? goToStep(step - 1) : router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={CoachTheme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.title}>{isEdit ? 'Besini Düzenle' : 'Yeni Besin'}</Text>
                    <Text style={styles.subtitle}>{currentStepInfo.title} · {step}/{STEPS.length} adım</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>
            <View style={styles.progressTrack}><Animated.View style={[styles.progressFill, { width: progressWidth }]} /></View>
            <StepIndicator currentStep={step} />
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {renderStepContent()}
            </ScrollView>
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <View style={styles.footerRow}>
                    {step > 1 && (
                        <TouchableOpacity style={styles.backStepBtn} onPress={() => goToStep(step - 1)}>
                            <Ionicons name="chevron-back" size={20} color={CoachTheme.text} />
                            <Text style={styles.backStepText}>Geri</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.nextBtn, saving && styles.nextBtnDisabled, step === 1 && { flex: 1 }]} onPress={handleNext} disabled={saving}>
                        {saving ? (<ActivityIndicator color="#fff" />) : (
                            <>
                                <Text style={styles.nextBtnText}>{step === STEPS.length ? (isEdit ? 'Güncelle' : 'Kaydet') : 'Devam Et'}</Text>
                                {step < STEPS.length && <Ionicons name="chevron-forward" size={18} color="#fff" />}
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// ══════════════════════════════════════════════════════════════════
// STİLLER
// ══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: CoachTheme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
    backBtn: { width: 44, height: 44, backgroundColor: CoachTheme.cardBg, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: CoachTheme.cardBorder },
    headerCenter: { alignItems: 'center', flex: 1 },
    title: { color: CoachTheme.text, fontSize: 17, fontWeight: '700' },
    subtitle: { color: CoachTheme.textMuted, fontSize: 12, marginTop: 2 },
    progressTrack: { height: 3, backgroundColor: CoachTheme.cardBorder, marginHorizontal: 20, borderRadius: 2, marginBottom: 16, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: ACCENT, borderRadius: 2 },
    stepIndicatorRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    stepDot: { alignItems: 'center' },
    stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: CoachTheme.cardBg, borderWidth: 1.5, borderColor: CoachTheme.cardBorder, justifyContent: 'center', alignItems: 'center' },
    stepCircleActive: { backgroundColor: ACCENT, borderColor: ACCENT },
    stepCircleDone: { backgroundColor: ACCENT, borderColor: ACCENT },
    stepNum: { color: CoachTheme.textMuted, fontSize: 12, fontWeight: '600' },
    stepLabel: { color: ACCENT, fontSize: 10, fontWeight: '700', marginTop: 4, textAlign: 'center', maxWidth: 60 },
    stepLine: { flex: 1, height: 1.5, backgroundColor: CoachTheme.cardBorder, marginBottom: 16 },
    stepLineDone: { backgroundColor: ACCENT },
    scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
    stepCard: { backgroundColor: CoachTheme.cardBg, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 18, padding: 16, marginBottom: 14 },
    stepCardWarning: { borderColor: '#ef444430' },
    stepCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    stepCardIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    stepCardTitle: { color: CoachTheme.text, fontSize: 15, fontWeight: '700' },
    stepCardSub: { color: CoachTheme.textMuted, fontSize: 12, marginTop: 1 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: CoachTheme.background, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 13 : 10, gap: 10 },
    input: { flex: 1, color: CoachTheme.text, fontSize: 15, padding: 0 },
    chipRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
    chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: CoachTheme.background, borderWidth: 1.5, borderColor: CoachTheme.cardBorder, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
    chipText: { color: CoachTheme.textSecondary, fontSize: 13, fontWeight: '500' },
    chipGridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    levelRow: { flexDirection: 'row', gap: 10 },
    levelCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: CoachTheme.background, borderWidth: 1.5, borderColor: CoachTheme.cardBorder, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12 },
    levelDot: { width: 8, height: 8, borderRadius: 4 },
    levelText: { color: CoachTheme.textSecondary, fontSize: 13, fontWeight: '600' },
    calorieRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
    calorieInput: { fontSize: 32, fontWeight: '800', color: MACRO_COLORS.calorie, padding: 0, minWidth: 80 },
    calorieUnit: { color: `${MACRO_COLORS.calorie}66`, fontSize: 16, fontWeight: '600' },
    macroGrid: { gap: 10 },
    macroInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: CoachTheme.background, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
    macroInputLabel: { color: CoachTheme.textSecondary, fontSize: 13, fontWeight: '600', flex: 1 },
    macroInputField: { fontSize: 18, fontWeight: '800', minWidth: 50, textAlign: 'right', padding: 0 },
    macroBarCard: { backgroundColor: CoachTheme.cardBg, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: CoachTheme.cardBorder, marginBottom: 14 },
    macroBarTitle: { color: CoachTheme.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    macroBarTrack: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' },
    macroBarSeg: { height: '100%' },
    macroBarLegend: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    macroBarLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    macroBarDot: { width: 8, height: 8, borderRadius: 4 },
    macroBarLegendText: { fontSize: 12, fontWeight: '800' },
    summaryCard: { backgroundColor: CoachTheme.cardBg, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: CoachTheme.cardBorder, marginBottom: 14 },
    summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: `${ACCENT}08` },
    summaryTitle: { color: ACCENT, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    summaryBody: { padding: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: `${CoachTheme.cardBorder}88` },
    summaryLabel: { color: CoachTheme.textMuted, fontSize: 12 },
    summaryValue: { color: CoachTheme.text, fontSize: 13, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
    footer: { paddingHorizontal: 16, paddingTop: 14, backgroundColor: CoachTheme.background, borderTopWidth: 1, borderTopColor: CoachTheme.cardBorder },
    footerRow: { flexDirection: 'row', gap: 12 },
    backStepBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: CoachTheme.cardBg, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 18 },
    backStepText: { color: CoachTheme.text, fontSize: 15, fontWeight: '600' },
    nextBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: ACCENT, borderRadius: 16, paddingVertical: 16 },
    nextBtnDisabled: { opacity: 0.6 },
    nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
