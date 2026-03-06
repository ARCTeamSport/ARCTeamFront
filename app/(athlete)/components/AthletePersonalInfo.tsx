import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Animated,
    PanResponder,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';
import { getToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/constants/apiConfig';

// Android LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_PADDING = 40; // her iki taraftan 20px
const SLIDER_WIDTH = SCREEN_WIDTH - SLIDER_PADDING * 2 - 32; // card padding dahil

const API_BASE_URL = API_ENDPOINTS.PERSONAL_INFO;

const BLOOD_TYPES = ['A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'];

const ACTIVITY_LABELS: Record<number, string> = {
    1: 'Hareketsiz',
    2: 'Az Aktif',
    3: 'Orta Aktif',
    4: 'Çok Aktif',
    5: 'Ekstra Aktif',
};

const GENDER_MAP: Record<number, string> = { 1: 'Erkek', 2: 'Kadın', 3: 'Diğer' };
const GENDERS = [1, 2, 3];

interface AthletePersonalInfoProps { onClose: () => void; userId: number; }

// ═══════════════════════════════════════════
// ══ Sürüklenebilir Slider (PanResponder) ══
// ═══════════════════════════════════════════
function DraggableSlider({
    value, min, max, step, unit, color, onValueChange,
}: {
    value: number; min: number; max: number; step: number; unit: string; color: string;
    onValueChange: (v: number) => void;
}) {
    const progress = ((value - min) / (max - min)) * 100;
    const trackRef = useRef<View>(null);
    const trackX = useRef(0);

    const calcValue = (pageX: number) => {
        const x = pageX - trackX.current;
        const ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH));
        const raw = min + ratio * (max - min);
        const stepped = Math.round(raw / step) * step;
        return Math.max(min, Math.min(max, parseFloat(stepped.toFixed(1))));
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                trackRef.current?.measureInWindow((x) => { trackX.current = x; });
                onValueChange(calcValue(evt.nativeEvent.pageX));
            },
            onPanResponderMove: (evt) => {
                onValueChange(calcValue(evt.nativeEvent.pageX));
            },
        })
    ).current;

    return (
        <View style={dsStyles.container}>
            <View style={dsStyles.labels}>
                <Text style={dsStyles.minMax}>{min}{unit}</Text>
                <Text style={[dsStyles.current, { color }]}>{value}{unit}</Text>
                <Text style={dsStyles.minMax}>{max}{unit}</Text>
            </View>
            <View
                ref={trackRef}
                style={dsStyles.trackWrap}
                {...panResponder.panHandlers}
                onLayout={() => {
                    trackRef.current?.measureInWindow((x) => { trackX.current = x; });
                }}
            >
                <View style={dsStyles.track}>
                    <View style={[dsStyles.fill, { width: `${progress}%`, backgroundColor: color }]} />
                    <View style={[dsStyles.thumb, { left: `${progress}%`, backgroundColor: color }]}>
                        <View style={dsStyles.thumbInner} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const dsStyles = StyleSheet.create({
    container: { marginTop: 8 },
    labels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    minMax: { color: AthleteTheme.textMuted, fontSize: 11, fontWeight: '500' },
    current: { fontSize: 17, fontWeight: '800' },
    trackWrap: { paddingVertical: 14, cursor: 'pointer' as any },
    track: { height: 6, borderRadius: 3, backgroundColor: AthleteTheme.ringTrack, position: 'relative' },
    fill: { height: '100%', borderRadius: 3, position: 'absolute' },
    thumb: {
        position: 'absolute', top: -9, width: 24, height: 24, borderRadius: 12,
        marginLeft: -12, elevation: 6,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5,
        justifyContent: 'center', alignItems: 'center',
    },
    thumbInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
});

// ── Circular Progress ──
function CircularProgress({ percentage, size = 90 }: { percentage: number; size?: number }) {
    const clamp = Math.min(100, Math.max(0, percentage));
    return (
        <View style={[circStyles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
            <View style={[circStyles.track, { width: size, height: size, borderRadius: size / 2 }]} />
            <View style={[circStyles.halfClip, { width: size / 2, height: size, left: 0 }]}>
                <View style={[circStyles.halfCircle, { width: size, height: size, borderRadius: size / 2, borderWidth: 7, transform: [{ rotate: `${clamp > 50 ? 180 : (clamp / 50) * 180}deg` }] }]} />
            </View>
            {clamp > 50 && (
                <View style={[circStyles.halfClip, { width: size / 2, height: size, right: 0, left: size / 2 }]}>
                    <View style={[circStyles.halfCircleRight, { width: size, height: size, borderRadius: size / 2, borderWidth: 7, left: -(size / 2), transform: [{ rotate: `${((clamp - 50) / 50) * 180}deg` }] }]} />
                </View>
            )}
            <View style={[circStyles.inner, { width: size - 18, height: size - 18, borderRadius: (size - 18) / 2 }]} />
        </View>
    );
}
const circStyles = StyleSheet.create({
    wrap: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
    track: { position: 'absolute', borderWidth: 7, borderColor: AthleteTheme.ringTrack },
    halfClip: { position: 'absolute', overflow: 'hidden' },
    halfCircle: { position: 'absolute', borderColor: AthleteTheme.accent, borderRightColor: 'transparent', borderBottomColor: 'transparent' },
    halfCircleRight: { position: 'absolute', borderColor: AthleteTheme.accent, borderLeftColor: 'transparent', borderTopColor: 'transparent' },
    inner: { position: 'absolute', backgroundColor: AthleteTheme.cardBg },
});

// ══════════════════════════════════════════
// ════════ ANA COMPONENT ══════════════════
// ══════════════════════════════════════════
export default function AthletePersonalInfo({ onClose, userId }: AthletePersonalInfoProps) {
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Veriler
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [bodyFat, setBodyFat] = useState(15);
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState(1);
    const [activityLevel, setActivityLevel] = useState(3);
    const [bloodType, setBloodType] = useState('A Rh+');
    const [allergies, setAllergies] = useState<string[]>([]);
    const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
    const [medications, setMedications] = useState<string[]>([]);
    const [goal, setGoal] = useState('Sağlıklı Yaşam');
    const [newAllergy, setNewAllergy] = useState('');
    const [newCondition, setNewCondition] = useState('');
    const [newMedication, setNewMedication] = useState('');

    const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));

    // ── Geçiş Animasyonu ──
    const toggleEdit = (val: boolean) => {
        // Fade out → change mode → fade in
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsEditing(val);
            Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
        });
    };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/me`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' }
            });
            if (response.ok) {
                const data = await response.json();
                setHeight(data.height || 170);
                setWeight(data.weight || 70);
                setBodyFat(data.bodyFat || 15);
                setAge(data.age || 25);
                setGender(data.gender || 1);
                setActivityLevel(data.activityLevel || 3);
                setBloodType(data.bloodType || 'A Rh+');
                if (data.goal) setGoal(data.goal);
                if (data.medications) setMedications(data.medications);
                if (data.medicalConditions) setMedicalConditions(data.medicalConditions);
                if (data.allergies) setAllergies(data.allergies);
            }
        } catch (error) { console.error('Error fetching profile:', error); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = await getToken();
            const payload = { height, weight, bodyFat, age, gender, activityLevel, goal, medications, medicalConditions, allergies };
            const response = await fetch(`${API_BASE_URL}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                toggleEdit(false);
                Alert.alert('Başarılı', 'Bilgilerin güncellendi.');
            } else {
                const errorText = await response.text();
                console.warn('Backend hatası:', errorText);
                Alert.alert('Hata', 'Kaydedilirken bir sorun oluştu.');
            }
        } catch (error) { console.error('Network error:', error); Alert.alert('Hata', 'Ağ bağlantı hatası.'); }
        finally { setSaving(false); }
    };

    const addItem = (list: string[], setList: (v: string[]) => void, val: string, clear: (v: string) => void) => {
        const t = val.trim(); if (t && !list.includes(t)) { setList([...list, t]); clear(''); }
    };
    const removeItem = (list: string[], setList: (v: string[]) => void, i: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setList(list.filter((_, idx) => idx !== i));
    };

    if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={AthleteTheme.accent} /></View>;

    // ─── Her iki modda da aynı kart yapısını kullanıyoruz ───
    const renderMetricCard = (icon: string, label: string, value: number | string, unit: string, iconColor: string, bgColor: string) => (
        <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: bgColor }]}>
                <Ionicons name={icon as any} size={20} color={iconColor} />
            </View>
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricUnit}>{unit}</Text>
            <Text style={styles.metricLabel}>{label}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={AthleteTheme.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Kişisel Bilgiler</Text>
                    <TouchableOpacity
                        onPress={() => isEditing ? handleSave() : toggleEdit(true)}
                        style={[styles.editButton, isEditing && styles.editButtonActive]}
                    >
                        {saving ? <ActivityIndicator size="small" color="#fff" /> : (
                            <Ionicons name={isEditing ? 'checkmark' : 'create-outline'} size={20} color={isEditing ? '#fff' : AthleteTheme.accent} />
                        )}
                    </TouchableOpacity>
                </View>

                <Animated.ScrollView
                    style={{ opacity: fadeAnim }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, isEditing && { paddingBottom: 100 }]}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ══ Fiziksel Metrikler ══ */}
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="body-outline" size={16} color={AthleteTheme.accent} />{'  '}Fiziksel Metrikler
                    </Text>

                    {/* Metrik Kartları – her iki modda da göster */}
                    <View style={styles.metricsGrid}>
                        {renderMetricCard('resize-outline', 'Boy', height, 'cm', AthleteTheme.accent, AthleteTheme.accentDim)}
                        {renderMetricCard('scale-outline', 'Kilo', weight, 'kg', AthleteTheme.statCalorie, 'rgba(255, 107, 53, 0.12)')}
                        {renderMetricCard('analytics-outline', 'BMI', bmi, 'kg/m²', AthleteTheme.success, 'rgba(0, 229, 160, 0.12)')}
                    </View>

                    {/* Düzenleme sliderları */}
                    {isEditing && (
                        <View style={styles.editSection}>
                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}>
                                    <Ionicons name="person-outline" size={18} color={AthleteTheme.textSecondary} />
                                    <Text style={styles.sliderTitle}>Yaş</Text>
                                </View>
                                <DraggableSlider value={age} min={10} max={100} step={1} unit=" Yaş" color={AthleteTheme.textSecondary} onValueChange={setAge} />
                            </View>

                            <View style={[styles.sliderCard, { paddingVertical: 12 }]}>
                                <View style={styles.sliderHeader}>
                                    <Ionicons name="male-female-outline" size={18} color={AthleteTheme.textSecondary} />
                                    <Text style={styles.sliderTitle}>Cinsiyet</Text>
                                </View>
                                <View style={styles.optionGrid}>
                                    {GENDERS.map((g) => (
                                        <TouchableOpacity key={g} style={[styles.optionBtn, gender === g && styles.optionBtnActive]} onPress={() => setGender(g)}>
                                            <Text style={[styles.optionText, gender === g && styles.optionTextActive]}>{GENDER_MAP[g]}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}>
                                    <Ionicons name="resize-outline" size={18} color={AthleteTheme.accent} />
                                    <Text style={styles.sliderTitle}>Boy</Text>
                                </View>
                                <DraggableSlider value={height} min={140} max={220} step={1} unit=" cm" color={AthleteTheme.accent} onValueChange={setHeight} />
                            </View>

                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}>
                                    <Ionicons name="scale-outline" size={18} color={AthleteTheme.statCalorie} />
                                    <Text style={styles.sliderTitle}>Kilo</Text>
                                </View>
                                <DraggableSlider value={weight} min={40} max={150} step={0.1} unit=" kg" color={AthleteTheme.statCalorie} onValueChange={setWeight} />
                            </View>

                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}>
                                    <Ionicons name="water-outline" size={18} color={AthleteTheme.statProtein} />
                                    <Text style={styles.sliderTitle}>Vücut Yağ Oranı</Text>
                                </View>
                                <DraggableSlider value={bodyFat} min={3} max={50} step={0.1} unit="%" color={AthleteTheme.statProtein} onValueChange={setBodyFat} />
                            </View>
                        </View>
                    )}

                    {/* Yağ Oranı Kartı (view mode) */}
                    {!isEditing && (
                        <View style={styles.fatCard}>
                            <View style={styles.fatCardLeft}>
                                <Text style={styles.fatCardTitle}>Vücut Yağ Oranı</Text>
                                <Text style={styles.fatCardSubtitle}>Sağlıklı aralık: %10 - %20</Text>
                                <View style={styles.fatStatusRow}>
                                    <View style={[styles.fatStatusDot, { backgroundColor: bodyFat >= 10 && bodyFat <= 20 ? AthleteTheme.success : AthleteTheme.warning }]} />
                                    <Text style={[styles.fatStatusText, { color: bodyFat >= 10 && bodyFat <= 20 ? AthleteTheme.success : AthleteTheme.warning }]}>
                                        {bodyFat >= 10 && bodyFat <= 20 ? 'Normal' : bodyFat < 10 ? 'Düşük' : 'Yüksek'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.fatCardRight}>
                                <CircularProgress percentage={bodyFat} size={90} />
                                <View style={styles.fatPercentOverlay}>
                                    <Text style={styles.fatPercentValue}>{bodyFat}</Text>
                                    <Text style={styles.fatPercentSymbol}>%</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ══ Genel Bilgi ══ */}
                    {!isEditing && (
                        <>
                            <Text style={styles.sectionTitle}>
                                <Ionicons name="flag-outline" size={16} color={AthleteTheme.accent} />{'  '}Genel Bilgi
                            </Text>
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <View style={[styles.infoIconWrap, { backgroundColor: AthleteTheme.surface }]}>
                                        <Ionicons name="person" size={18} color={AthleteTheme.textSecondary} />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Yaş / Cinsiyet</Text>
                                        <Text style={styles.infoValue}>{age} • {GENDER_MAP[gender]}</Text>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}

                    {/* ══ Sağlık Bilgileri ══ */}
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="heart-outline" size={16} color={AthleteTheme.error} />{'  '}Sağlık Bilgileri
                    </Text>

                    {/* Kan Grubu */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(255, 77, 106, 0.12)' }]}>
                                <Ionicons name="water" size={18} color={AthleteTheme.error} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Kan Grubu</Text>
                                {!isEditing && <Text style={styles.infoValue}>{bloodType}</Text>}
                            </View>
                        </View>
                        {isEditing && (
                            <View style={styles.optionGrid}>
                                {BLOOD_TYPES.map((type) => (
                                    <TouchableOpacity key={type} style={[styles.optionBtn, bloodType === type && styles.optionBtnActive]} onPress={() => setBloodType(type)}>
                                        <Text style={[styles.optionText, bloodType === type && styles.optionTextActive]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Alerjiler */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(251, 191, 36, 0.12)' }]}>
                                <Ionicons name="alert-circle" size={18} color={AthleteTheme.warning} />
                            </View>
                            <Text style={styles.infoLabel}>Alerjiler</Text>
                        </View>
                        {allergies.length > 0 ? (
                            <View style={styles.chipContainer}>
                                {allergies.map((a, i) => (
                                    <View key={i} style={styles.chip}>
                                        <Ionicons name="warning-outline" size={12} color={AthleteTheme.warning} />
                                        <Text style={styles.chipText}>{a}</Text>
                                        {isEditing && (
                                            <TouchableOpacity onPress={() => removeItem(allergies, setAllergies, i)}>
                                                <Ionicons name="close-circle" size={16} color={AthleteTheme.error} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ) : !isEditing && <Text style={styles.emptyText}>Kayıtlı alerji yok ✓</Text>}
                        {isEditing && (
                            <View style={styles.addRow}>
                                <TextInput style={styles.addInput} placeholder="Yeni alerji ekle..." placeholderTextColor={AthleteTheme.textMuted} value={newAllergy} onChangeText={setNewAllergy}
                                    onSubmitEditing={() => addItem(allergies, setAllergies, newAllergy, setNewAllergy)} />
                                <TouchableOpacity style={[styles.addButton, { backgroundColor: AthleteTheme.warning }]} onPress={() => addItem(allergies, setAllergies, newAllergy, setNewAllergy)}>
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Tıbbi Durumlar */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: AthleteTheme.accentDim }]}>
                                <Ionicons name="medkit" size={18} color={AthleteTheme.accent} />
                            </View>
                            <Text style={styles.infoLabel}>Tıbbi Durumlar</Text>
                        </View>
                        {medicalConditions.length > 0 ? (
                            <View style={styles.chipContainer}>
                                {medicalConditions.map((c, i) => (
                                    <View key={i} style={[styles.chip, styles.chipMedical]}>
                                        <Ionicons name="medical-outline" size={12} color={AthleteTheme.accent} />
                                        <Text style={[styles.chipText, { color: AthleteTheme.accent }]}>{c}</Text>
                                        {isEditing && (
                                            <TouchableOpacity onPress={() => removeItem(medicalConditions, setMedicalConditions, i)}>
                                                <Ionicons name="close-circle" size={16} color={AthleteTheme.error} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ) : !isEditing && <Text style={styles.emptyText}>Kayıtlı tıbbi durum yok ✓</Text>}
                        {isEditing && (
                            <View style={styles.addRow}>
                                <TextInput style={styles.addInput} placeholder="Yeni tıbbi durum ekle..." placeholderTextColor={AthleteTheme.textMuted} value={newCondition} onChangeText={setNewCondition}
                                    onSubmitEditing={() => addItem(medicalConditions, setMedicalConditions, newCondition, setNewCondition)} />
                                <TouchableOpacity style={[styles.addButton, { backgroundColor: AthleteTheme.accent }]} onPress={() => addItem(medicalConditions, setMedicalConditions, newCondition, setNewCondition)}>
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>


                    {/* İlaçlar */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(167, 139, 250, 0.12)' }]}>
                                <Ionicons name="fitness" size={18} color={AthleteTheme.statProtein} />
                            </View>
                            <Text style={styles.infoLabel}>Kullanılan İlaçlar</Text>
                        </View>

                        {medications.length > 0 ? (
                            <View style={styles.chipContainer}>
                                {medications.map((m, i) => (
                                    <View key={i} style={[styles.chip, styles.chipMedication]}>
                                        <Ionicons name="medical" size={12} color={AthleteTheme.statProtein} />
                                        <Text style={[styles.chipText, { color: AthleteTheme.statProtein }]}>{m}</Text>
                                        {isEditing && (
                                            <TouchableOpacity onPress={() => removeItem(medications, setMedications, i)}>
                                                <Ionicons name="close-circle" size={16} color={AthleteTheme.error} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ) : !isEditing && <Text style={styles.emptyText}>Kayıtlı ilaç yok ✓</Text>}

                        {isEditing && (
                            <View style={styles.addRow}>
                                <TextInput
                                    style={styles.addInput}
                                    placeholder="Yeni ilaç ekle..."
                                    placeholderTextColor={AthleteTheme.textMuted}
                                    value={newMedication}
                                    onChangeText={setNewMedication}
                                    onSubmitEditing={() => addItem(medications, setMedications, newMedication, setNewMedication)}
                                />
                                <TouchableOpacity
                                    style={[styles.addButton, { backgroundColor: AthleteTheme.statProtein }]}
                                    onPress={() => addItem(medications, setMedications, newMedication, setNewMedication)}
                                >
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* ══ Aktivite Seviyesi ══ */}
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="pulse-outline" size={16} color={AthleteTheme.accent} />{'  '}Aktivite & Hedef
                    </Text>

                    <View style={styles.activityCard}>
                        <View style={styles.activityHeader}>
                            <View style={styles.activityIconWrap}>
                                <Ionicons name="pulse" size={20} color={AthleteTheme.accent} />
                            </View>
                            <View>
                                <Text style={styles.activityTitle}>Aktivite Seviyesi</Text>
                                <Text style={styles.activityLevelText}>{ACTIVITY_LABELS[activityLevel]}</Text>
                            </View>
                        </View>
                        <View style={styles.activityDotsRow}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TouchableOpacity
                                    key={i} disabled={!isEditing} onPress={() => isEditing && setActivityLevel(i)}
                                    style={[styles.activityDot, i <= activityLevel && styles.activityDotActive, isEditing && styles.activityDotEditable]}
                                >
                                    {isEditing && <Text style={styles.activityDotLabel}>{i}</Text>}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.activityBarBg}>
                            <View style={[styles.activityBarFill, { width: `${(activityLevel / 5) * 100}%` }]} />
                        </View>
                    </View>

                    {/* Hedef */}
                    <View style={[styles.infoCard, { marginTop: 10 }]}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: AthleteTheme.accentDim }]}>
                                <Ionicons name="trophy" size={18} color={AthleteTheme.accent} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Mevcut Hedef</Text>
                                {isEditing ? (
                                    <TextInput style={styles.goalInput} value={goal} onChangeText={setGoal} placeholderTextColor={AthleteTheme.textMuted} />
                                ) : (
                                    <Text style={styles.infoValue}>{goal}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </Animated.ScrollView>

                {/* Kaydet */}
                {isEditing && (
                    <Animated.View style={[styles.saveContainer, { paddingBottom: insets.bottom + 12, opacity: fadeAnim }]}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85} disabled={saving}>
                            {saving ? <ActivityIndicator size="small" color="#fff" /> : (
                                <><Ionicons name="checkmark-circle" size={22} color="#fff" /><Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text></>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AthleteTheme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: AthleteTheme.cardBg, borderWidth: 1, borderColor: AthleteTheme.cardBorder, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: AthleteTheme.text, fontSize: 18, fontWeight: '700' },
    editButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: AthleteTheme.accentDim, borderWidth: 1, borderColor: 'rgba(0, 180, 255, 0.3)', justifyContent: 'center', alignItems: 'center' },
    editButtonActive: { backgroundColor: AthleteTheme.accent, borderColor: AthleteTheme.accent },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
    sectionTitle: { color: AthleteTheme.text, fontSize: 15, fontWeight: '700', marginTop: 24, marginBottom: 14, letterSpacing: 0.3 },

    // Metrics
    metricsGrid: { flexDirection: 'row', gap: 10 },
    metricCard: { flex: 1, backgroundColor: AthleteTheme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: AthleteTheme.cardBorder, padding: 16, alignItems: 'center' },
    metricIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    metricValue: { color: AthleteTheme.text, fontSize: 22, fontWeight: '800' },
    metricUnit: { color: AthleteTheme.textSecondary, fontSize: 11, marginTop: 2 },
    metricLabel: { color: AthleteTheme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 6 },

    // Fat card
    fatCard: { flexDirection: 'row', backgroundColor: AthleteTheme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: AthleteTheme.cardBorder, padding: 20, marginTop: 10, alignItems: 'center' },
    fatCardLeft: { flex: 1 },
    fatCardTitle: { color: AthleteTheme.text, fontSize: 16, fontWeight: '700' },
    fatCardSubtitle: { color: AthleteTheme.textSecondary, fontSize: 12, marginTop: 4 },
    fatStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
    fatStatusDot: { width: 8, height: 8, borderRadius: 4 },
    fatStatusText: { fontSize: 13, fontWeight: '600' },
    fatCardRight: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
    fatPercentOverlay: { position: 'absolute', flexDirection: 'row', alignItems: 'flex-start' },
    fatPercentValue: { color: AthleteTheme.text, fontSize: 22, fontWeight: '800' },
    fatPercentSymbol: { color: AthleteTheme.accent, fontSize: 12, fontWeight: '700', marginTop: 4 },

    // Edit sliders
    editSection: { gap: 10, marginTop: 14 },
    sliderCard: { backgroundColor: AthleteTheme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: AthleteTheme.cardBorder, padding: 16 },
    sliderHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sliderTitle: { color: AthleteTheme.text, fontSize: 14, fontWeight: '600' },

    // Info cards
    infoCard: { backgroundColor: AthleteTheme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: AthleteTheme.cardBorder, padding: 16, marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    infoIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    infoContent: { flex: 1 },
    infoLabel: { color: AthleteTheme.textSecondary, fontSize: 13, fontWeight: '500' },
    infoValue: { color: AthleteTheme.text, fontSize: 18, fontWeight: '700', marginTop: 2 },

    // Options grid
    optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
    optionBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: AthleteTheme.surface, borderWidth: 1, borderColor: AthleteTheme.cardBorder },
    optionBtnActive: { backgroundColor: AthleteTheme.accentDim, borderColor: AthleteTheme.accent },
    optionText: { color: AthleteTheme.textSecondary, fontSize: 13, fontWeight: '600' },
    optionTextActive: { color: AthleteTheme.accent },

    // Chips
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(251, 191, 36, 0.10)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)', paddingHorizontal: 12, paddingVertical: 6 },
    chipMedical: { backgroundColor: AthleteTheme.accentDim, borderColor: 'rgba(0, 180, 255, 0.2)' },
    chipMedication: {
        backgroundColor: 'rgba(167, 139, 250, 0.10)',
        borderColor: 'rgba(167, 139, 250, 0.2)'
    },
    chipText: { color: AthleteTheme.warning, fontSize: 12, fontWeight: '600' },
    emptyText: { color: AthleteTheme.success, fontSize: 13, fontWeight: '500', marginTop: 8, paddingLeft: 48 },

    // Add row
    addRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
    addInput: { flex: 1, height: 40, backgroundColor: AthleteTheme.surface, borderRadius: 12, borderWidth: 1, borderColor: AthleteTheme.cardBorder, paddingHorizontal: 14, color: AthleteTheme.text, fontSize: 13 },
    addButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    // Medications
    medRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, paddingLeft: 48 },
    medBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: AthleteTheme.statProtein },
    medText: { color: AthleteTheme.text, fontSize: 14, fontWeight: '500', flex: 1 },

    // Goal
    goalInput: { color: AthleteTheme.text, fontSize: 15, fontWeight: '600', borderBottomWidth: 1, borderBottomColor: AthleteTheme.accent, paddingVertical: 4, marginTop: 2 },

    // Activity
    activityCard: { backgroundColor: AthleteTheme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: AthleteTheme.cardBorder, padding: 16 },
    activityHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    activityIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: AthleteTheme.accentDim, justifyContent: 'center', alignItems: 'center' },
    activityTitle: { color: AthleteTheme.textSecondary, fontSize: 12, fontWeight: '500' },
    activityLevelText: { color: AthleteTheme.text, fontSize: 16, fontWeight: '700', marginTop: 1 },
    activityDotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16 },
    activityDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: AthleteTheme.ringTrack, borderWidth: 2, borderColor: AthleteTheme.cardBorder, justifyContent: 'center', alignItems: 'center' },
    activityDotActive: { backgroundColor: AthleteTheme.accent, borderColor: AthleteTheme.accent },
    activityDotEditable: { width: 32, height: 32, borderRadius: 16 },
    activityDotLabel: { color: '#fff', fontSize: 12, fontWeight: '700' },
    activityBarBg: { height: 6, borderRadius: 3, backgroundColor: AthleteTheme.ringTrack, marginTop: 14, overflow: 'hidden' },
    activityBarFill: { height: '100%', borderRadius: 3, backgroundColor: AthleteTheme.accent },

    // Save
    saveContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: AthleteTheme.background, borderTopWidth: 1, borderTopColor: AthleteTheme.cardBorder },
    saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: AthleteTheme.accent, borderRadius: 16, paddingVertical: 16 },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
