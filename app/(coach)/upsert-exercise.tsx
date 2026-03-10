import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Alert, Modal, Animated, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CoachTheme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';

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

// ─── Chip Picker ────────────────────────────────────────────────────────────
interface ChipPickerProps {
    label: string;
    value: string;
    options: string[];
    translations: Record<string, string>;
    icons?: Record<string, string>;
    onSelect: (val: string) => void;
}

function ChipPicker({ label, value, options, translations, icons, onSelect }: ChipPickerProps) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {options.map(opt => {
                    const active = value === opt;
                    return (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => onSelect(opt)}
                            activeOpacity={0.75}
                            style={[styles.chip, active && styles.chipActive]}
                        >
                            {icons && (
                                <Ionicons
                                    name={(icons[opt] || 'ellipse') as any}
                                    size={14}
                                    color={active ? '#0A0E10' : CoachTheme.textMuted}
                                    style={{ marginRight: 5 }}
                                />
                            )}
                            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                {translations[opt] || opt}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function UpsertExerciseScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetMuscle, setTargetMuscle] = useState('');
    const [equipment, setEquipment] = useState('');
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
    const [nameFocused, setNameFocused] = useState(false);
    const [descFocused, setDescFocused] = useState(false);

    // Animated progress indicator
    const progressAnim = useRef(new Animated.Value(0)).current;
    const filledFields = [name.trim(), targetMuscle, equipment].filter(Boolean).length;
    const progress = filledFields / 3;

    useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: progress,
            useNativeDriver: false,
            tension: 60,
            friction: 8,
        }).start();
    }, [progress]);

    useEffect(() => {
        if (isEdit) fetchExerciseDetails();
    }, [id]);

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

    // ─── FIXED: Media Picker ────────────────────────────────────────────────
    const handlePickMedia = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('İzin Gerekli', 'Medya kitaplığına erişim izni verilmedi.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            // FIX: Use new API instead of deprecated MediaTypeOptions.All
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 0.85,
            videoMaxDuration: 60,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            setMediaUri(asset.uri);
            // FIX: Correctly detect media type from asset
            setMediaType(asset.type === 'video' ? 'video' : 'image');
        }
    };

    const handleRemoveMedia = () => {
        Alert.alert('Medyayı Kaldır', 'Seçilen medyayı kaldırmak istiyor musunuz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Kaldır', style: 'destructive', onPress: () => { setMediaUri(null); setMediaType(null); } }
        ]);
    };

    // ─── Save ───────────────────────────────────────────────────────────────
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

            if (mediaUri) {
                const filename = mediaUri.split('/').pop() || 'media';
                const ext = /\.(\w+)$/.exec(filename)?.[1]?.toLowerCase() ?? 'jpg';
                // FIX: Correct MIME type based on actual media type
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

    // ─── Loading ─────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={[styles.screen, styles.centered]}>
                <ActivityIndicator size="large" color={CoachTheme.accent} />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={CoachTheme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.title}>{isEdit ? 'Egzersizi Düzenle' : 'Yeni Egzersiz'}</Text>
                    <Text style={styles.subtitle}>
                        {filledFields === 3 ? 'Kaydedilmeye hazır ✓' : `${filledFields}/3 zorunlu alan dolduruldu`}
                    </Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            {/* ── Progress Bar ── */}
            <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

            {/* ── Form ── */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Exercise Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        <Text style={styles.requiredDot}>* </Text>Egzersiz Adı
                    </Text>
                    <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
                        <Ionicons name="barbell-outline" size={18} color={nameFocused ? CoachTheme.accent : CoachTheme.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Örn: Incline Bench Press"
                            placeholderTextColor={CoachTheme.textMuted}
                            value={name}
                            onChangeText={setName}
                            onFocus={() => setNameFocused(true)}
                            onBlur={() => setNameFocused(false)}
                        />
                        {name.length > 0 && (
                            <TouchableOpacity onPress={() => setName('')}>
                                <Ionicons name="close-circle" size={18} color={CoachTheme.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Description */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Açıklama <Text style={styles.optionalTag}>(opsiyonel)</Text></Text>
                    <View style={[styles.inputWrapper, styles.textAreaWrapper, descFocused && styles.inputWrapperFocused]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Egzersiz hakkında ipuçları, form uyarıları..."
                            placeholderTextColor={CoachTheme.textMuted}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                            onFocus={() => setDescFocused(true)}
                            onBlur={() => setDescFocused(false)}
                        />
                    </View>
                </View>

                {/* Muscle Chips */}
                <ChipPicker
                    label="* Hedef Kas Grubu"
                    value={targetMuscle}
                    options={MUSCLES}
                    translations={MUSCLE_TRANSLATIONS}
                    icons={MUSCLE_ICONS}
                    onSelect={setTargetMuscle}
                />

                {/* Equipment Chips */}
                <ChipPicker
                    label="* Ekipman"
                    value={equipment}
                    options={EQUIPMENTS}
                    translations={EQUIPMENT_TRANSLATIONS}
                    icons={EQUIPMENT_ICONS}
                    onSelect={setEquipment}
                />

                {/* Media Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Medya <Text style={styles.optionalTag}>(opsiyonel)</Text></Text>

                    {mediaUri ? (
                        // ── Media Preview ──
                        <View style={styles.mediaPreviewCard}>
                            <View style={styles.mediaPreviewContent}>
                                <View style={styles.mediaIconBadge}>
                                    <Ionicons
                                        name={mediaType === 'video' ? 'videocam' : 'image'}
                                        size={28}
                                        color={CoachTheme.accent}
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
                                    <Ionicons name="swap-horizontal" size={16} color={CoachTheme.accent} />
                                    <Text style={styles.mediaActionText}>Değiştir</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.mediaActionBtn, styles.mediaActionBtnDanger]} onPress={handleRemoveMedia}>
                                    <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                                    <Text style={[styles.mediaActionText, { color: '#FF6B6B' }]}>Kaldır</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : existingVideoUrl ? (
                        // ── Existing Media ──
                        <View style={styles.mediaPreviewCard}>
                            <View style={styles.mediaPreviewContent}>
                                <View style={styles.mediaIconBadge}>
                                    <Ionicons name="cloud-done" size={28} color={CoachTheme.accent} />
                                </View>
                                <View style={styles.mediaInfo}>
                                    <Text style={styles.mediaInfoTitle}>Mevcut Video</Text>
                                    <Text style={styles.mediaInfoSub}>Sunucuda kayıtlı</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.mediaActionBtn} onPress={handlePickMedia}>
                                <Ionicons name="swap-horizontal" size={16} color={CoachTheme.accent} />
                                <Text style={styles.mediaActionText}>Değiştir</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        // ── Empty Picker ──
                        <TouchableOpacity style={styles.mediaPickerEmpty} onPress={handlePickMedia} activeOpacity={0.7}>
                            <View style={styles.mediaPickerIconWrap}>
                                <Ionicons name="cloud-upload-outline" size={30} color={CoachTheme.accent} />
                            </View>
                            <Text style={styles.mediaPickerTitle}>Video veya Fotoğraf Yükle</Text>
                            <Text style={styles.mediaPickerSub}>MP4, MOV, JPG, PNG • Maks. 60sn</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bottom spacing */}
                <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Footer ── */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                    activeOpacity={0.85}
                >
                    {saving ? (
                        <ActivityIndicator color="#0A0E10" />
                    ) : (
                        <>
                            <Ionicons name={isEdit ? 'checkmark-circle' : 'add-circle'} size={20} color="#0A0E10" />
                            <Text style={styles.saveBtnText}>{isEdit ? 'Güncelle' : 'Egzersiz Ekle'}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: CoachTheme.background },
    centered: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: CoachTheme.textMuted, marginTop: 12, fontSize: 14 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    backBtn: {
        width: 44, height: 44,
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
    },
    headerCenter: { alignItems: 'center', flex: 1 },
    title: { color: CoachTheme.text, fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
    subtitle: { color: CoachTheme.textMuted, fontSize: 12, marginTop: 2 },

    // Progress
    progressTrack: {
        height: 3,
        backgroundColor: CoachTheme.cardBorder,
        marginHorizontal: 20,
        borderRadius: 2,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: CoachTheme.accent,
        borderRadius: 2,
    },

    // Scroll
    scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },

    // Input Group
    inputGroup: { marginBottom: 22 },
    label: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    requiredDot: { color: CoachTheme.accent },
    optionalTag: { color: CoachTheme.textMuted, fontWeight: '400', textTransform: 'none', letterSpacing: 0 },

    // Text Input
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1.5,
        borderColor: CoachTheme.cardBorder,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        gap: 10,
    },
    inputWrapperFocused: {
        borderColor: CoachTheme.accent,
        backgroundColor: `${CoachTheme.accent}10`,
    },
    textAreaWrapper: {
        alignItems: 'flex-start',
        paddingTop: 14,
        paddingBottom: 14,
    },
    inputIcon: { marginRight: 2 },
    input: { flex: 1, color: CoachTheme.text, fontSize: 15, padding: 0 },
    textArea: { height: 90, textAlignVertical: 'top' },

    // Chips
    chipRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1.5,
        borderColor: CoachTheme.cardBorder,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    chipActive: {
        backgroundColor: CoachTheme.accent,
        borderColor: CoachTheme.accent,
    },
    chipText: { color: CoachTheme.textSecondary, fontSize: 13, fontWeight: '500' },
    chipTextActive: { color: '#0A0E10', fontWeight: '700' },

    // Media
    mediaPickerEmpty: {
        height: 130,
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1.5,
        borderColor: CoachTheme.cardBorder,
        borderStyle: 'dashed',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    mediaPickerIconWrap: {
        width: 56, height: 56,
        borderRadius: 16,
        backgroundColor: `${CoachTheme.accent}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    mediaPickerTitle: { color: CoachTheme.text, fontSize: 14, fontWeight: '600' },
    mediaPickerSub: { color: CoachTheme.textMuted, fontSize: 12 },

    mediaPreviewCard: {
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1.5,
        borderColor: CoachTheme.cardBorder,
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    mediaPreviewContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    mediaIconBadge: {
        width: 52, height: 52,
        borderRadius: 14,
        backgroundColor: `${CoachTheme.accent}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaInfo: { flex: 1 },
    mediaInfoTitle: { color: CoachTheme.text, fontSize: 14, fontWeight: '600' },
    mediaInfoSub: { color: CoachTheme.textMuted, fontSize: 12, marginTop: 2 },
    mediaActions: { flexDirection: 'row', gap: 10 },
    mediaActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: `${CoachTheme.accent}15`,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
    },
    mediaActionBtnDanger: { backgroundColor: 'rgba(255,107,107,0.12)' },
    mediaActionText: { color: CoachTheme.accent, fontSize: 13, fontWeight: '600' },

    // Footer
    footer: {
        paddingHorizontal: 20,
        paddingTop: 14,
        backgroundColor: CoachTheme.background,
        borderTopWidth: 1,
        borderTopColor: CoachTheme.cardBorder,
    },
    saveBtn: {
        backgroundColor: CoachTheme.accent,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    saveBtnDisabled: { opacity: 0.6 },
    saveBtnText: { color: '#0A0E10', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
