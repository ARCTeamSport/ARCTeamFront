import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Alert, Animated, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';

const ACCENT = CoachTheme.accent;

// ── Data ──────────────────────────────────────────────────────────
const MUSCLES = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Calves', 'Core', 'FullBody'];
const EQUIPMENTS = ['None', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Kettlebell', 'Band'];

const MUSCLE_TRANSLATIONS: Record<string, string> = {
    Chest: 'Göğüs', Back: 'Sırt', Shoulders: 'Omuz', Biceps: 'Ön Kol', Triceps: 'Arka Kol',
    Quads: 'Ön Bacak', Hamstrings: 'Arka Bacak', Calves: 'Kalf', Core: 'Karın', FullBody: 'Tüm Vücut'
};
const MUSCLE_ICONS: Record<string, string> = {
    Chest: 'body', Back: 'layers', Shoulders: 'accessibility', Biceps: 'fitness',
    Triceps: 'barbell', Quads: 'walk', Hamstrings: 'footsteps', Calves: 'flame',
    Core: 'radio-button-on', FullBody: 'person'
};

const EQUIPMENT_TRANSLATIONS: Record<string, string> = {
    None: 'Ekipmansız', Barbell: 'Halter', Dumbbell: 'Dambıl',
    Machine: 'Makine', Cable: 'Kablo', Kettlebell: 'Kettlebell', Band: 'Direnç Bandı'
};
const EQUIPMENT_ICONS: Record<string, string> = {
    None: 'hand-left', Barbell: 'barbell', Dumbbell: 'fitness',
    Machine: 'cog', Cable: 'git-merge', Kettlebell: 'globe', Band: 'resize'
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LEVEL_TRANSLATIONS: Record<string, string> = { Beginner: 'Başlangıç', Intermediate: 'Orta', Advanced: 'İleri' };
const LEVEL_COLORS: Record<string, string> = { Beginner: '#22c55e', Intermediate: '#06b6d4', Advanced: '#ef4444' };

const TYPES = ['Compound', 'Isolation'];
const TYPE_TRANSLATIONS: Record<string, string> = { Compound: 'Compound', Isolation: 'İzolasyon' };
const TYPE_ICONS: Record<string, string> = { Compound: 'git-network', Isolation: 'locate' };

const INTENSITY_TYPES = ['Normal', 'Dropset', 'Superset', 'Pyramid'];
const INTENSITY_TRANSLATIONS: Record<string, string> = { Normal: 'Normal', Dropset: 'Dropset', Superset: 'Süperset', Pyramid: 'Piramit' };
const INTENSITY_ICONS: Record<string, string> = { Normal: 'pulse', Dropset: 'arrow-down', Superset: 'flash', Pyramid: 'triangle' };

const GOALS = ['Kutle', 'Definasyon', 'Guc'];
const GOAL_TRANSLATIONS: Record<string, string> = { Kutle: 'Kütle', Definasyon: 'Definasyon', Guc: 'Güç' };
const GOAL_ICONS: Record<string, string> = { Kutle: 'barbell', Definasyon: 'cut', Guc: 'flash' };

// ── Steps config ─────────────────────────────────────────────────
const STEPS = [
    { id: 1, title: 'Temel Bilgi', icon: 'barbell-outline', desc: 'İsim ve açıklama' },
    { id: 2, title: 'Hedef & Ekipman', icon: 'body-outline', desc: 'Kas grubu ve ekipman' },
    { id: 3, title: 'Detaylar', icon: 'options-outline', desc: 'Set, tempo, yoğunluk' },
    { id: 4, title: 'Medya & Özet', icon: 'image-outline', desc: 'Video/fotoğraf ve kayıt' },
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
                                    ? <Ionicons name="checkmark" size={12} color="#0A0E10" />
                                    : <Text style={[
                                        styles.stepNum,
                                        isActive && { color: '#0A0E10', fontWeight: '700' },
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
    options, selected, onSelect, translations, icons, colorMap,
}: {
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
    translations: Record<string, string>;
    icons?: Record<string, string>;
    colorMap?: Record<string, string>;
}) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {options.map(opt => {
                const active = selected === opt;
                const color = colorMap?.[opt] || ACCENT;
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
                        {icons && (
                            <Ionicons
                                name={(icons[opt] || 'ellipse') as any}
                                size={14}
                                color={active ? color : CoachTheme.textMuted}
                                style={{ marginRight: 5 }}
                            />
                        )}
                        <Text style={[styles.chipText, active && { color, fontWeight: '700' }]}>
                            {translations[opt] || opt}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

function ChipGrid({
    options, selected, onSelect, translations, icons,
}: {
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
    translations: Record<string, string>;
    icons?: Record<string, string>;
}) {
    return (
        <View style={styles.chipGridWrap}>
            {options.map(opt => {
                const active = selected === opt;
                return (
                    <TouchableOpacity
                        key={opt}
                        onPress={() => onSelect(active ? '' : opt)}
                        activeOpacity={0.75}
                        style={[
                            styles.chip,
                            active && { backgroundColor: ACCENT + '22', borderColor: ACCENT },
                        ]}
                    >
                        {icons && (
                            <Ionicons
                                name={(icons[opt] || 'ellipse') as any}
                                size={14}
                                color={active ? ACCENT : CoachTheme.textMuted}
                                style={{ marginRight: 5 }}
                            />
                        )}
                        <Text style={[styles.chipText, active && { color: ACCENT, fontWeight: '700' }]}>
                            {translations[opt] || opt}
                        </Text>
                    </TouchableOpacity>
                );
            })}
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

export default function UpsertExerciseScreen() {
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
    const [description, setDescription] = useState('');
    const [targetMuscle, setTargetMuscle] = useState('');
    const [equipment, setEquipment] = useState('');
    const [subRegion, setSubRegion] = useState('');
    const [level, setLevel] = useState('');
    const [type, setType] = useState('');
    const [setsAndReps, setSetsAndReps] = useState('');
    const [tempo, setTempo] = useState('');
    const [restSeconds, setRestSeconds] = useState('');
    const [intensityType, setIntensityType] = useState('');
    const [goal, setGoal] = useState('');

    // Media
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit) fetchExerciseDetails();
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

    const fetchExerciseDetails = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/Exercise/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setName(data.name);
                setDescription(data.description || '');
                setTargetMuscle(data.targetMuscle);
                setEquipment(data.equipment);
                setSubRegion(data.subRegion || '');
                setLevel(data.level || '');
                setType(data.type || '');
                setSetsAndReps(data.setsAndReps || '');
                setTempo(data.tempo || '');
                setRestSeconds(data.restSeconds != null ? String(data.restSeconds) : '');
                setIntensityType(data.intensityType || '');
                setGoal(data.goal || '');
                setExistingVideoUrl(data.videoUrl);
            } else {
                Alert.alert('Hata', 'Egzersiz bilgileri çekilemedi.');
                router.back();
            }
        } catch {
            Alert.alert('Hata', 'Sunucu bağlantı hatası.');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handlePickMedia = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('İzin Gerekli', 'Medya kitaplığına erişim izni verilmedi.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 0.85,
            videoMaxDuration: 60,
        });
        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            setMediaUri(asset.uri);
            setMediaType(asset.type === 'video' ? 'video' : 'image');
        }
    };

    const handleRemoveMedia = () => {
        Alert.alert('Medyayı Kaldır', 'Seçilen medyayı kaldırmak istiyor musunuz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Kaldır', style: 'destructive', onPress: () => { setMediaUri(null); setMediaType(null); } }
        ]);
    };

    const handleNext = () => {
        if (step === 1 && !name.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen egzersiz adını girin.');
            return;
        }
        if (step === 2 && (!targetMuscle || !equipment)) {
            Alert.alert('Eksik Bilgi', 'Lütfen kas grubu ve ekipman seçin.');
            return;
        }
        if (step < STEPS.length) goToStep(step + 1);
        else handleSave();
    };

    const handleSave = async () => {
        if (!name.trim() || !targetMuscle || !equipment) {
            Alert.alert('Eksik Bilgi', 'Lütfen egzersiz adını, kas grubunu ve ekipmanı seçin.');
            return;
        }
        try {
            setSaving(true);
            const token = await getToken();
            const formData = new FormData();
            formData.append('Name', name);
            formData.append('Description', description);
            formData.append('TargetMuscle', targetMuscle);
            formData.append('Equipment', equipment);
            if (subRegion) formData.append('SubRegion', subRegion);
            if (level) formData.append('Level', level);
            if (type) formData.append('Type', type);
            if (setsAndReps) formData.append('SetsAndReps', setsAndReps);
            if (tempo) formData.append('Tempo', tempo);
            if (restSeconds) formData.append('RestSeconds', restSeconds);
            if (intensityType) formData.append('IntensityType', intensityType);
            if (goal) formData.append('Goal', goal);

            if (mediaUri) {
                const filename = mediaUri.split('/').pop() || 'media';
                const ext = /\.(\w+)$/.exec(filename)?.[1]?.toLowerCase() ?? 'jpg';
                const mimeType = mediaType === 'video'
                    ? `video/${ext === 'mov' ? 'quicktime' : ext}`
                    : `image/${ext}`;
                formData.append('mediaFile', { uri: mediaUri, name: filename, type: mimeType } as any);
            }

            const url = isEdit ? API_ENDPOINTS.EXERCISE.UPDATE(Number(id)) : API_ENDPOINTS.EXERCISE.CREATE;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
                body: formData,
            });

            if (res.ok) {
                Alert.alert('Başarılı', `Egzersiz başarıyla ${isEdit ? 'güncellendi' : 'eklendi'}.`);
                router.back();
            } else {
                const errText = await res.text();
                Alert.alert('Hata', 'Kaydetme başarısız: ' + errText);
            }
        } catch (err) {
            console.error(err);
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

    // ── Step içerikleri ──
    const renderStepContent = () => {
        switch (step) {

            // ════ STEP 1: TEMEL BİLGİ ════
            case 1:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <StepCard
                            icon="barbell-outline"
                            title="Egzersiz Adı"
                            subtitle="Zorunlu alan"
                        >
                            <InputField
                                icon="barbell-outline"
                                placeholder="Örn: Incline Bench Press"
                                value={name}
                                onChangeText={setName}
                            />
                        </StepCard>

                        <StepCard
                            icon="document-text-outline"
                            title="Açıklama"
                            subtitle="İpuçları, form uyarıları (İsteğe bağlı)"
                        >
                            <InputField
                                icon="create-outline"
                                placeholder="Egzersiz hakkında ipuçları, form uyarıları..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </StepCard>
                    </Animated.View>
                );

            // ════ STEP 2: HEDEF & EKİPMAN ════
            case 2:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <StepCard
                            icon="body-outline"
                            title="Hedef Kas Grubu"
                            subtitle="Hangi kas grubunu çalıştırıyor? (Zorunlu)"
                        >
                            <ChipGrid
                                options={MUSCLES}
                                selected={targetMuscle}
                                onSelect={setTargetMuscle}
                                translations={MUSCLE_TRANSLATIONS}
                                icons={MUSCLE_ICONS}
                            />
                        </StepCard>

                        <StepCard
                            icon="construct-outline"
                            title="Ekipman"
                            subtitle="Hangi ekipman gerekli? (Zorunlu)"
                        >
                            <ChipRow
                                options={EQUIPMENTS}
                                selected={equipment}
                                onSelect={setEquipment}
                                translations={EQUIPMENT_TRANSLATIONS}
                                icons={EQUIPMENT_ICONS}
                            />
                        </StepCard>

                        <StepCard
                            icon="navigate-outline"
                            title="Alt Bölge"
                            subtitle="İsteğe bağlı detay"
                        >
                            <InputField
                                icon="navigate-outline"
                                placeholder="Örn: Üst Göğüs, Arka Omuz"
                                value={subRegion}
                                onChangeText={setSubRegion}
                            />
                        </StepCard>

                        <StepCard
                            icon="stats-chart-outline"
                            title="Kullanıcı Seviyesi"
                            subtitle="Kime uygun?"
                        >
                            <View style={styles.levelRow}>
                                {LEVELS.map(opt => {
                                    const active = level === opt;
                                    const color = LEVEL_COLORS[opt];
                                    return (
                                        <TouchableOpacity
                                            key={opt}
                                            onPress={() => setLevel(active ? '' : opt)}
                                            activeOpacity={0.75}
                                            style={[styles.levelCard, active && { borderColor: color, backgroundColor: color + '18' }]}
                                        >
                                            <View style={[styles.levelDot, { backgroundColor: color }]} />
                                            <Text style={[styles.levelText, active && { color, fontWeight: '700' }]}>
                                                {LEVEL_TRANSLATIONS[opt]}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </StepCard>

                        <StepCard
                            icon="git-network-outline"
                            title="Egzersiz Türü"
                            subtitle="Compound veya İzolasyon"
                        >
                            <ChipRow
                                options={TYPES}
                                selected={type}
                                onSelect={setType}
                                translations={TYPE_TRANSLATIONS}
                                icons={TYPE_ICONS}
                            />
                        </StepCard>
                    </Animated.View>
                );

            // ════ STEP 3: DETAYLAR ════
            case 3:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <StepCard
                            icon="repeat-outline"
                            title="Set x Tekrar"
                            subtitle="Önerilen set ve tekrar aralığı"
                        >
                            <InputField
                                icon="repeat-outline"
                                placeholder="Örn: 4x8-12"
                                value={setsAndReps}
                                onChangeText={setSetsAndReps}
                            />
                        </StepCard>

                        <StepCard
                            icon="speedometer-outline"
                            title="Tempo"
                            subtitle="Hareket hızı (eksantrik-durak-konsantrik)"
                        >
                            <InputField
                                icon="speedometer-outline"
                                placeholder="Örn: 2-0-1"
                                value={tempo}
                                onChangeText={setTempo}
                            />
                        </StepCard>

                        <StepCard
                            icon="timer-outline"
                            title="Dinlenme Süresi"
                            subtitle="Setler arası dinlenme (saniye)"
                        >
                            <InputField
                                icon="timer-outline"
                                placeholder="Örn: 90"
                                value={restSeconds}
                                onChangeText={setRestSeconds}
                                keyboardType="numeric"
                            />
                        </StepCard>

                        <StepCard
                            icon="pulse-outline"
                            title="Yoğunluk Tipi"
                            subtitle="Antrenman tekniği"
                        >
                            <ChipRow
                                options={INTENSITY_TYPES}
                                selected={intensityType}
                                onSelect={setIntensityType}
                                translations={INTENSITY_TRANSLATIONS}
                                icons={INTENSITY_ICONS}
                            />
                        </StepCard>

                        <StepCard
                            icon="flag-outline"
                            title="Amaç"
                            subtitle="Egzersizin hedefi"
                        >
                            <ChipRow
                                options={GOALS}
                                selected={goal}
                                onSelect={setGoal}
                                translations={GOAL_TRANSLATIONS}
                                icons={GOAL_ICONS}
                            />
                        </StepCard>
                    </Animated.View>
                );

            // ════ STEP 4: MEDYA & ÖZET ════
            case 4:
                return (
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <StepCard
                            icon="cloud-upload-outline"
                            title="Medya"
                            subtitle="Video veya fotoğraf yükleyin (İsteğe bağlı)"
                        >
                            {mediaUri ? (
                                <View style={styles.mediaPreviewCard}>
                                    <View style={styles.mediaPreviewContent}>
                                        <View style={styles.mediaIconBadge}>
                                            <Ionicons
                                                name={mediaType === 'video' ? 'videocam' : 'image'}
                                                size={28}
                                                color={ACCENT}
                                            />
                                        </View>
                                        <View style={styles.mediaInfo}>
                                            <Text style={styles.mediaInfoTitle}>
                                                {mediaType === 'video' ? 'Video Seçildi' : 'Fotoğraf Seçildi'}
                                            </Text>
                                            <Text style={styles.mediaInfoSub} numberOfLines={1}>
                                                {mediaUri.split('/').pop()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.mediaActions}>
                                        <TouchableOpacity style={styles.mediaActionBtn} onPress={handlePickMedia}>
                                            <Ionicons name="swap-horizontal" size={16} color={ACCENT} />
                                            <Text style={styles.mediaActionText}>Değiştir</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.mediaActionBtn, styles.mediaActionBtnDanger]} onPress={handleRemoveMedia}>
                                            <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                                            <Text style={[styles.mediaActionText, { color: '#FF6B6B' }]}>Kaldır</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : existingVideoUrl ? (
                                <View style={styles.mediaPreviewCard}>
                                    <View style={styles.mediaPreviewContent}>
                                        <View style={styles.mediaIconBadge}>
                                            <Ionicons name="cloud-done" size={28} color={ACCENT} />
                                        </View>
                                        <View style={styles.mediaInfo}>
                                            <Text style={styles.mediaInfoTitle}>Mevcut Video</Text>
                                            <Text style={styles.mediaInfoSub}>Sunucuda kayıtlı</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.mediaActionBtn} onPress={handlePickMedia}>
                                        <Ionicons name="swap-horizontal" size={16} color={ACCENT} />
                                        <Text style={styles.mediaActionText}>Değiştir</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.mediaPickerEmpty} onPress={handlePickMedia} activeOpacity={0.7}>
                                    <View style={styles.mediaPickerIconWrap}>
                                        <Ionicons name="cloud-upload-outline" size={30} color={ACCENT} />
                                    </View>
                                    <Text style={styles.mediaPickerTitle}>Video veya Fotoğraf Yükle</Text>
                                    <Text style={styles.mediaPickerSub}>MP4, MOV, JPG, PNG • Maks. 60sn</Text>
                                </TouchableOpacity>
                            )}
                        </StepCard>

                        {/* Özet */}
                        {name.trim() && targetMuscle && equipment ? (
                            <View style={styles.summaryCard}>
                                <View style={styles.summaryHeader}>
                                    <Ionicons name="checkmark-circle" size={18} color={ACCENT} />
                                    <Text style={styles.summaryTitle}>Kayıt Özeti</Text>
                                </View>
                                <View style={styles.summaryBody}>
                                    <SummaryRow label="Egzersiz" value={name} />
                                    <SummaryRow label="Kas Grubu" value={MUSCLE_TRANSLATIONS[targetMuscle] || targetMuscle} />
                                    <SummaryRow label="Ekipman" value={EQUIPMENT_TRANSLATIONS[equipment] || equipment} />
                                    {subRegion ? <SummaryRow label="Alt Bölge" value={subRegion} /> : null}
                                    {level ? <SummaryRow label="Seviye" value={LEVEL_TRANSLATIONS[level]} valueColor={LEVEL_COLORS[level]} /> : null}
                                    {type ? <SummaryRow label="Tür" value={TYPE_TRANSLATIONS[type] || type} /> : null}
                                    {setsAndReps ? <SummaryRow label="Set x Tekrar" value={setsAndReps} /> : null}
                                    {tempo ? <SummaryRow label="Tempo" value={tempo} /> : null}
                                    {restSeconds ? <SummaryRow label="Dinlenme" value={`${restSeconds} sn`} /> : null}
                                    {intensityType ? <SummaryRow label="Yoğunluk" value={INTENSITY_TRANSLATIONS[intensityType]} /> : null}
                                    {goal ? <SummaryRow label="Amaç" value={GOAL_TRANSLATIONS[goal]} /> : null}
                                    {(mediaUri || existingVideoUrl) ? <SummaryRow label="Medya" value={mediaUri ? (mediaType === 'video' ? 'Video eklendi' : 'Fotoğraf eklendi') : 'Mevcut video'} /> : null}
                                </View>
                            </View>
                        ) : null}
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
                    <Text style={styles.title}>{isEdit ? 'Egzersizi Düzenle' : 'Yeni Egzersiz'}</Text>
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
            <StepIndicator currentStep={step} />

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

// ══════════════════════════════════════════════════════════════════
// STİLLER
// ══════════════════════════════════════════════════════════════════

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

    // Input
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: CoachTheme.background, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 13 : 10, gap: 10 },
    input: { flex: 1, color: CoachTheme.text, fontSize: 15, padding: 0 },

    // Chips
    chipRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
    chip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: CoachTheme.background, borderWidth: 1.5, borderColor: CoachTheme.cardBorder,
        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    },
    chipText: { color: CoachTheme.textSecondary, fontSize: 13, fontWeight: '500' },
    chipGridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

    // Level row
    levelRow: { flexDirection: 'row', gap: 10 },
    levelCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: CoachTheme.background, borderWidth: 1.5, borderColor: CoachTheme.cardBorder, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12 },
    levelDot: { width: 8, height: 8, borderRadius: 4 },
    levelText: { color: CoachTheme.textSecondary, fontSize: 13, fontWeight: '600' },

    // Media
    mediaPickerEmpty: {
        height: 120,
        backgroundColor: CoachTheme.background,
        borderWidth: 1.5,
        borderColor: CoachTheme.cardBorder,
        borderStyle: 'dashed',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    mediaPickerIconWrap: {
        width: 52, height: 52, borderRadius: 14,
        backgroundColor: `${ACCENT}15`,
        justifyContent: 'center', alignItems: 'center', marginBottom: 4,
    },
    mediaPickerTitle: { color: CoachTheme.text, fontSize: 14, fontWeight: '600' },
    mediaPickerSub: { color: CoachTheme.textMuted, fontSize: 12 },

    mediaPreviewCard: {
        backgroundColor: CoachTheme.background,
        borderWidth: 1, borderColor: CoachTheme.cardBorder,
        borderRadius: 14, padding: 14, gap: 12,
    },
    mediaPreviewContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    mediaIconBadge: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: `${ACCENT}15`,
        justifyContent: 'center', alignItems: 'center',
    },
    mediaInfo: { flex: 1 },
    mediaInfoTitle: { color: CoachTheme.text, fontSize: 14, fontWeight: '600' },
    mediaInfoSub: { color: CoachTheme.textMuted, fontSize: 12, marginTop: 2 },
    mediaActions: { flexDirection: 'row', gap: 10 },
    mediaActionBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: `${ACCENT}15`,
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 10, flex: 1, justifyContent: 'center',
    },
    mediaActionBtnDanger: { backgroundColor: 'rgba(255,107,107,0.12)' },
    mediaActionText: { color: ACCENT, fontSize: 13, fontWeight: '600' },

    // Summary
    summaryCard: {
        backgroundColor: CoachTheme.cardBg, borderRadius: 18, overflow: 'hidden',
        borderWidth: 1, borderColor: CoachTheme.cardBorder, marginBottom: 14,
    },
    summaryHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: `${ACCENT}08`,
    },
    summaryTitle: { color: ACCENT, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    summaryBody: { padding: 16 },
    summaryRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: `${CoachTheme.cardBorder}88`,
    },
    summaryLabel: { color: CoachTheme.textMuted, fontSize: 12 },
    summaryValue: { color: CoachTheme.text, fontSize: 13, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },

    // Footer
    footer: { paddingHorizontal: 16, paddingTop: 14, backgroundColor: CoachTheme.background, borderTopWidth: 1, borderTopColor: CoachTheme.cardBorder },
    footerRow: { flexDirection: 'row', gap: 12 },
    backStepBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: CoachTheme.cardBg, borderWidth: 1, borderColor: CoachTheme.cardBorder, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 18 },
    backStepText: { color: CoachTheme.text, fontSize: 15, fontWeight: '600' },
    nextBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: ACCENT, borderRadius: 16, paddingVertical: 16 },
    nextBtnDisabled: { opacity: 0.6 },
    nextBtnText: { color: '#0A0E10', fontSize: 16, fontWeight: '700' },
});
