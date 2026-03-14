import React, { useState, useEffect, useRef } from 'react';
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

type ChipOption = { label: string; value: string };

const SUPPORT_TYPES: ChipOption[] = [
    { label: 'Gıda Takviyesi', value: 'Supplement' },
    { label: 'Vitamin/Mineral', value: 'Vitamin' },
    { label: 'Aşı / Medikal', value: 'Vaccine' },
    { label: 'Diğer', value: 'Other' },
];

const TARGET_SYSTEM_LIST: ChipOption[] = [
    { label: 'Kas', value: 'Muscle' },
    { label: 'Sağlık', value: 'Health' },
    { label: 'Enerji', value: 'Energy' },
    { label: 'Toparlanma', value: 'Recovery' },
    { label: 'Sinir', value: 'Nerve' },
    { label: 'Hormon', value: 'Hormone' },
    { label: 'Genetik', value: 'Genetic' },
    { label: 'Metabolizma', value: 'Metabolism' },
    { label: 'Kadın', value: 'Women' },
    { label: 'Cilt', value: 'Skin' },
    { label: 'Detoks', value: 'Detox' },
    { label: 'Erkek', value: 'Men' },
    { label: 'Spor', value: 'Sports' },
    { label: 'Karaciğer', value: 'Liver' },
    { label: 'Göz', value: 'Eye' },
    { label: 'Saç', value: 'Hair' },
    { label: 'Anti-Aging', value: 'AntiAging' },
    { label: 'Çocuk', value: 'Children' },
    { label: 'Eklem', value: 'Joint' },
    { label: 'Bağışıklık', value: 'Immunity' },
];

const CATEGORY_LIST: ChipOption[] = [
    { label: 'Protein', value: 'Protein' },
    { label: 'Amino Asit', value: 'AminoAcid' },
    { label: 'Mineral', value: 'Mineral' },
    { label: 'Nootropic', value: 'Nootropic' },
    { label: 'Vitamin', value: 'Vitamin' },
    { label: 'Yağ Asidi', value: 'FattyAcid' },
    { label: 'Adaptogen', value: 'Adaptogen' },
    { label: 'Blend', value: 'Blend' },
    { label: 'Flavonoid', value: 'Flavonoid' },
    { label: 'Kreatin', value: 'Creatine' },
    { label: 'Mantar', value: 'Mushroom' },
    { label: 'Antioksidan', value: 'Antioxidant' },
    { label: 'Alkaloid', value: 'Alkaloid' },
    { label: 'Peptid', value: 'Peptide' },
    { label: 'Bitkisel', value: 'Herbal' },
    { label: 'Enzim', value: 'Enzyme' },
    { label: 'Koenzim', value: 'Coenzyme' },
    { label: 'Probiyotik', value: 'Probiotic' },
    { label: 'Elektrolit', value: 'Electrolyte' },
];

const LEVEL_LIST: ChipOption[] = [
    { label: 'Başlangıç', value: 'Beginner' },
    { label: 'Orta', value: 'Intermediate' },
    { label: 'İleri', value: 'Advanced' },
];
const LEVEL_COLORS: Record<string, string> = {
    Beginner: '#22c55e',
    Intermediate: '#06b6d4',
    Advanced: '#ef4444',
};

const FORM_LIST: ChipOption[] = [
    { label: 'Kapsül', value: 'Capsule' },
    { label: 'Toz', value: 'Powder' },
    { label: 'Tablet', value: 'Tablet' },
    { label: 'Sıvı', value: 'Liquid' },
    { label: 'Damla', value: 'Drop' },
    { label: 'Sprey', value: 'Spray' },
    { label: 'Enjeksiyon', value: 'Injection' },
    { label: 'Resin', value: 'Resin' },
];

const TIMING_LIST: ChipOption[] = [
    { label: 'Sabah', value: 'Morning' },
    { label: 'Öğün', value: 'WithMeal' },
    { label: 'Pre', value: 'PreWorkout' },
    { label: 'Post', value: 'PostWorkout' },
    { label: 'Gece', value: 'Night' },
    { label: 'Akşam', value: 'Evening' },
    { label: 'Aç', value: 'Fasted' },
    { label: 'Intra', value: 'IntraWorkout' },
    { label: 'Günlük', value: 'Daily' },
];

const ACCENT = '#F5C518';

// ── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, title: 'Temel Bilgi', icon: 'flask-outline', desc: 'İsim ve tür' },
    { id: 2, title: 'Hedef & Kategori', icon: 'layers-outline', desc: 'Sistem ve sınıf' },
    { id: 3, title: 'Dozaj', icon: 'scale-outline', desc: 'Form, doz, zamanlama' },
    { id: 4, title: 'Notlar', icon: 'document-text-outline', desc: 'Amaç ve uyarılar' },
];

// ── Chip component ────────────────────────────────────────────────────────────
function ChipRow({
    options, selected, onSelect, accentColor,
}: {
    options: ChipOption[];
    selected: string;
    onSelect: (val: string) => void;
    accentColor?: (val: string) => string;
}) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {options.map(opt => {
                const active = selected === opt.value;
                const color = accentColor ? accentColor(opt.value) : ACCENT;
                return (
                    <TouchableOpacity
                        key={opt.value}
                        onPress={() => onSelect(active ? '' : opt.value)}
                        activeOpacity={0.75}
                        style={[
                            styles.chip,
                            active && { backgroundColor: color + '22', borderColor: color },
                        ]}
                    >
                        <Text style={[styles.chipText, active && { color, fontWeight: '700' }]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

// ── Input Field ───────────────────────────────────────────────────────────────
function InputField({
    icon, placeholder, value, onChangeText, multiline,
}: {
    icon: string; placeholder: string; value: string;
    onChangeText: (t: string) => void; multiline?: boolean;
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
            />
        </View>
    );
}

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
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
                                    ? <Ionicons name="checkmark" size={12} color="#0A0E10" />
                                    : <Text style={[
                                        styles.stepNum,
                                        isActive && { color: '#0A0E10', fontWeight: '700' },
                                        isDone && { color: '#0A0E10' },
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

// ── Screen ────────────────────────────────────────────────────────────────────
export default function UpsertSupportScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState(1);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0.25)).current;

    // Fields
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [targetSystem, setTargetSystem] = useState('');
    const [subSystem, setSubSystem] = useState('');
    const [category, setCategory] = useState('');
    const [level, setLevel] = useState('');
    const [form, setForm] = useState('');
    const [dose, setDose] = useState('');
    const [timing, setTiming] = useState('');
    const [mainPurpose, setMainPurpose] = useState('');
    const [synergy, setSynergy] = useState('');
    const [criticalNote, setCriticalNote] = useState('');
    const [dosageNotes, setDosageNotes] = useState('');

    useEffect(() => {
        if (isEdit) fetchDetails();
    }, [id]);

    useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: step / STEPS.length,
            useNativeDriver: false,
            tension: 60,
            friction: 8,
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
            const res = await fetch(`${API_BASE_URL}/api/Support/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setName(data.name || '');
                setType(data.type || '');
                setDosageNotes(data.dosageNotes || '');
                setTargetSystem(data.targetSystem || '');
                setSubSystem(data.subSystem || '');
                setLevel(data.level || '');
                setCategory(data.category || '');
                setForm(data.form || '');
                setDose(data.dose || '');
                setTiming(data.timing || '');
                setMainPurpose(data.mainPurpose || '');
                setSynergy(data.synergy || '');
                setCriticalNote(data.criticalNote || '');
            } else {
                Alert.alert('Hata', 'Destek bilgileri çekilemedi.');
                router.back();
            }
        } catch {
            Alert.alert('Hata', 'Sunucu bağlantı hatası.');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 1 && (!name.trim() || !type)) {
            Alert.alert('Eksik Bilgi', 'Lütfen destek adını ve türünü seçin.');
            return;
        }
        if (step < STEPS.length) goToStep(step + 1);
        else handleSave();
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = await getToken();
            const payload = {
                Id: isEdit ? Number(id) : 0,
                Name: name,
                Type: type,
                DosageNotes: dosageNotes,
                TargetSystem: targetSystem,
                SubSystem: subSystem,
                Level: level,
                Category: category,
                Form: form,
                Dose: dose,
                Timing: timing,
                MainPurpose: mainPurpose,
                Synergy: synergy,
                CriticalNote: criticalNote,
                ImageUrl: null,
                IsCustom: true,
            };
            const url = isEdit ? API_ENDPOINTS.SUPPORT.UPDATE(Number(id)) : API_ENDPOINTS.SUPPORT.CREATE;
            const method = isEdit ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                Alert.alert('Başarılı', `Destek başarıyla ${isEdit ? 'güncellendi' : 'eklendi'}.`);
                router.back();
            } else {
                const errText = await res.text();
                Alert.alert('Hata', 'Kaydetme başarısız: ' + errText);
            }
        } catch {
            Alert.alert('Hata', 'Sunucu bağlantı hatası.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={ACCENT} />
            </View>
        );
    }

    const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
    const currentStepInfo = STEPS[step - 1];

    const renderStepContent = () => {
        switch (step) {

            // ── STEP 1: Temel Bilgi ──────────────────────────────────────────
            case 1:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="flask-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Destek İsmi</Text>
                                    <Text style={styles.stepCardSub}>Zorunlu alan</Text>
                                </View>
                            </View>
                            <InputField
                                icon="flask-outline"
                                placeholder="Örn: Whey Protein, D Vitamini"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="grid-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Tür Seçin</Text>
                                    <Text style={styles.stepCardSub}>Zorunlu alan</Text>
                                </View>
                            </View>
                            <View style={styles.typeGrid}>
                                {SUPPORT_TYPES.map(opt => {
                                    const active = type === opt.value;
                                    const icons: Record<string, string> = {
                                        Supplement: 'nutrition-outline',
                                        Vitamin: 'medkit-outline',
                                        Vaccine: 'bandage-outline',
                                        Other: 'ellipsis-horizontal-outline',
                                    };
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => setType(active ? '' : opt.value)}
                                            activeOpacity={0.75}
                                            style={[styles.typeCard, active && styles.typeCardActive]}
                                        >
                                            <Ionicons
                                                name={icons[opt.value] as any}
                                                size={22}
                                                color={active ? '#0A0E10' : CoachTheme.textMuted}
                                            />
                                            <Text style={[styles.typeCardText, active && styles.typeCardTextActive]}>
                                                {opt.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </Animated.View>
                );

            // ── STEP 2: Hedef & Kategori ─────────────────────────────────────
            case 2:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="body-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Hedef Sistem</Text>
                                    <Text style={styles.stepCardSub}>Bu takviye neyi hedefliyor?</Text>
                                </View>
                            </View>
                            <ChipRow options={TARGET_SYSTEM_LIST} selected={targetSystem} onSelect={setTargetSystem} />
                        </View>

                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="git-branch-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Alt Sistem</Text>
                                    <Text style={styles.stepCardSub}>İsteğe bağlı</Text>
                                </View>
                            </View>
                            <InputField
                                icon="git-branch-outline"
                                placeholder="Örn: Hipertrofi, Odak, Uyku"
                                value={subSystem}
                                onChangeText={setSubSystem}
                            />
                        </View>

                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="layers-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Kategori</Text>
                                    <Text style={styles.stepCardSub}>Bileşen türü</Text>
                                </View>
                            </View>
                            <ChipRow options={CATEGORY_LIST} selected={category} onSelect={setCategory} />
                        </View>

                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="stats-chart-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Kullanıcı Seviyesi</Text>
                                    <Text style={styles.stepCardSub}>Kime uygun?</Text>
                                </View>
                            </View>
                            <View style={styles.levelRow}>
                                {LEVEL_LIST.map(opt => {
                                    const active = level === opt.value;
                                    const color = LEVEL_COLORS[opt.value];
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => setLevel(active ? '' : opt.value)}
                                            activeOpacity={0.75}
                                            style={[styles.levelCard, active && { borderColor: color, backgroundColor: color + '18' }]}
                                        >
                                            <View style={[styles.levelDot, { backgroundColor: color }]} />
                                            <Text style={[styles.levelText, active && { color, fontWeight: '700' }]}>
                                                {opt.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </Animated.View>
                );

            // ── STEP 3: Dozaj ─────────────────────────────────────────────────
            case 3:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="cube-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Supplement Formu</Text>
                                    <Text style={styles.stepCardSub}>Hangi formda kullanılıyor?</Text>
                                </View>
                            </View>
                            <ChipRow options={FORM_LIST} selected={form} onSelect={setForm} />
                        </View>

                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="scale-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Doz Miktarı</Text>
                                    <Text style={styles.stepCardSub}>Standart kullanım dozu</Text>
                                </View>
                            </View>
                            <InputField
                                icon="scale-outline"
                                placeholder="Örn: 25 g, 200 mg, 5000 IU"
                                value={dose}
                                onChangeText={setDose}
                            />
                        </View>

                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="time-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Kullanım Zamanlaması</Text>
                                    <Text style={styles.stepCardSub}>Ne zaman alınmalı?</Text>
                                </View>
                            </View>
                            <ChipRow options={TIMING_LIST} selected={timing} onSelect={setTiming} />
                        </View>
                    </Animated.View>
                );

            // ── STEP 4: Notlar ────────────────────────────────────────────────
            case 4:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="flag-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Ana Amaç</Text>
                                    <Text style={styles.stepCardSub}>Bu takviyenin temel işlevi</Text>
                                </View>
                            </View>
                            <InputField
                                icon="flag-outline"
                                placeholder="Örn: Kas sentezi, Odak, ATP üretimi"
                                value={mainPurpose}
                                onChangeText={setMainPurpose}
                            />
                        </View>

                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="link-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Sinerji</Text>
                                    <Text style={styles.stepCardSub}>Kombinasyon önerileri</Text>
                                </View>
                            </View>
                            <InputField
                                icon="link-outline"
                                placeholder="Örn: Kreatin, D3, Omega-3"
                                value={synergy}
                                onChangeText={setSynergy}
                            />
                        </View>

                        <View style={[styles.stepCard, styles.stepCardWarning]}>
                            <View style={styles.stepCardHeader}>
                                <View style={[styles.stepCardIcon, { backgroundColor: '#ef444420' }]}>
                                    <Ionicons name="warning-outline" size={20} color="#ef4444" />
                                </View>
                                <View>
                                    <Text style={[styles.stepCardTitle, { color: '#ef4444' }]}>Kritik Not</Text>
                                    <Text style={styles.stepCardSub}>Uyarı / dikkat edilmesi gerekenler</Text>
                                </View>
                            </View>
                            <InputField
                                icon="warning-outline"
                                placeholder="Örn: Kan sulandırıcıyla dikkat, Döngüsel kullanım"
                                value={criticalNote}
                                onChangeText={setCriticalNote}
                            />
                        </View>

                        <View style={styles.stepCard}>
                            <View style={styles.stepCardHeader}>
                                <View style={styles.stepCardIcon}>
                                    <Ionicons name="document-text-outline" size={20} color={ACCENT} />
                                </View>
                                <View>
                                    <Text style={styles.stepCardTitle}>Ek Notlar</Text>
                                    <Text style={styles.stepCardSub}>Dozaj ve kullanım detayları</Text>
                                </View>
                            </View>
                            <InputField
                                icon="create-outline"
                                placeholder="Örn: Antrenmandan sonra 1 ölçek su ile"
                                value={dosageNotes}
                                onChangeText={setDosageNotes}
                                multiline
                            />
                        </View>
                    </Animated.View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => step > 1 ? goToStep(step - 1) : router.back()}
                    style={styles.backBtn}
                >
                    <Ionicons name="arrow-back" size={22} color={CoachTheme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.title}>{isEdit ? 'Desteği Düzenle' : 'Yeni Destek'}</Text>
                    <Text style={styles.subtitle}>
                        {currentStepInfo.title} · {step}/{STEPS.length} adım
                    </Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

            {/* Step Indicator */}
            <StepIndicator currentStep={step} totalSteps={STEPS.length} />

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {renderStepContent()}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <View style={styles.footerRow}>
                    {step > 1 && (
                        <TouchableOpacity style={styles.backStepBtn} onPress={() => goToStep(step - 1)}>
                            <Ionicons name="chevron-back" size={20} color={CoachTheme.text} />
                            <Text style={styles.backStepText}>Geri</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.nextBtn, saving && styles.nextBtnDisabled, step === 1 && { flex: 1 }]}
                        onPress={handleNext}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#0A0E10" />
                        ) : (
                            <>
                                <Text style={styles.nextBtnText}>
                                    {step === STEPS.length ? (isEdit ? 'Güncelle' : 'Kaydet') : 'Devam Et'}
                                </Text>
                                {step < STEPS.length && (
                                    <Ionicons name="chevron-forward" size={18} color="#0A0E10" />
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: CoachTheme.background },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
    backBtn: { width: 44, height: 44, backgroundColor: CoachTheme.cardBg, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: CoachTheme.cardBorder },
    headerCenter: { alignItems: 'center', flex: 1 },
    title: { color: CoachTheme.text, fontSize: 17, fontWeight: '700' },
    subtitle: { color: CoachTheme.textMuted, fontSize: 12, marginTop: 2 },

    // Progress
    progressTrack: { height: 3, backgroundColor: CoachTheme.cardBorder, marginHorizontal: 20, borderRadius: 2, marginBottom: 16, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: ACCENT, borderRadius: 2 },

    // Step Indicator
    stepIndicatorRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    stepDot: { alignItems: 'center' },
    stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: CoachTheme.cardBg, borderWidth: 1.5, borderColor: CoachTheme.cardBorder, justifyContent: 'center', alignItems: 'center' },
    stepCircleActive: { backgroundColor: ACCENT, borderColor: ACCENT },
    stepCircleDone: { backgroundColor: ACCENT, borderColor: ACCENT },
    stepNum: { color: CoachTheme.textMuted, fontSize: 12, fontWeight: '600' },
    stepLabel: { color: ACCENT, fontSize: 10, fontWeight: '700', marginTop: 4, textAlign: 'center', maxWidth: 60 },
    stepLine: { flex: 1, height: 1.5, backgroundColor: CoachTheme.cardBorder, marginBottom: 16 },
    stepLineDone: { backgroundColor: ACCENT },

    // Scroll
    scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },

    // Step Cards
    stepCard: {
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
    },
    stepCardWarning: { borderColor: '#ef444430' },
    stepCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    stepCardIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: ACCENT + '18', justifyContent: 'center', alignItems: 'center' },
    stepCardTitle: { color: CoachTheme.text, fontSize: 15, fontWeight: '700' },
    stepCardSub: { color: CoachTheme.textMuted, fontSize: 12, marginTop: 1 },

    // Type grid
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    typeCard: { flex: 1, minWidth: '44%', backgroundColor: CoachTheme.background, borderWidth: 1.5, borderColor: CoachTheme.cardBorder, borderRadius: 14, paddingVertical: 14, alignItems: 'center', gap: 6 },
    typeCardActive: { backgroundColor: ACCENT, borderColor: ACCENT },
    typeCardText: { color: CoachTheme.textSecondary, fontSize: 12, fontWeight: '600', textAlign: 'center' },
    typeCardTextActive: { color: '#0A0E10', fontWeight: '700' },

    // Level row
    levelRow: { flexDirection: 'row', gap: 10 },
    levelCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: CoachTheme.background, borderWidth: 1.5, borderColor: CoachTheme.cardBorder, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12 },
    levelDot: { width: 8, height: 8, borderRadius: 4 },
    levelText: { color: CoachTheme.textSecondary, fontSize: 13, fontWeight: '600' },

    // Input
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: CoachTheme.background, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 13 : 10, gap: 10 },
    input: { flex: 1, color: CoachTheme.text, fontSize: 15, padding: 0 },

    // Chips
    chipRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
    chip: { backgroundColor: CoachTheme.background, borderWidth: 1.5, borderColor: CoachTheme.cardBorder, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
    chipText: { color: CoachTheme.textSecondary, fontSize: 13, fontWeight: '500' },

    // Footer
    footer: { paddingHorizontal: 16, paddingTop: 14, backgroundColor: CoachTheme.background, borderTopWidth: 1, borderTopColor: CoachTheme.cardBorder },
    footerRow: { flexDirection: 'row', gap: 12 },
    backStepBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: CoachTheme.cardBg, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 18 },
    backStepText: { color: CoachTheme.text, fontSize: 15, fontWeight: '600' },
    nextBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: ACCENT, borderRadius: 16, paddingVertical: 16 },
    nextBtnDisabled: { opacity: 0.6 },
    nextBtnText: { color: '#0A0E10', fontSize: 16, fontWeight: '700' },
});
