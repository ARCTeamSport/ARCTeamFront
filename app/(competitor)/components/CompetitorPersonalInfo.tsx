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
import { CompetitorTheme } from '@/constants/theme';
import { getToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/constants/apiConfig';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80 - 32;

const API_BASE_URL = API_ENDPOINTS.PERSONAL_INFO;

const ACTIVITY_LABELS: Record<number, string> = { 1: 'Hareketsiz', 2: 'Az Aktif', 3: 'Orta Aktif', 4: 'Çok Aktif', 5: 'Ekstra Aktif' };
const GENDER_MAP: Record<number, string> = { 1: 'Erkek', 2: 'Kadın', 3: 'Diğer' };
const GENDERS = [1, 2, 3];

interface CompetitorPersonalInfoProps { onClose: () => void; userId: number; }

// ═══ Sürüklenebilir Slider ═══
function DraggableSlider({ value, min, max, step, unit, color, onValueChange }: {
    value: number; min: number; max: number; step: number; unit: string; color: string; onValueChange: (v: number) => void;
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
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => { trackRef.current?.measureInWindow((x) => { trackX.current = x; }); onValueChange(calcValue(evt.nativeEvent.pageX)); },
        onPanResponderMove: (evt) => { onValueChange(calcValue(evt.nativeEvent.pageX)); },
    })).current;
    return (
        <View style={dsStyles.container}>
            <View style={dsStyles.labels}>
                <Text style={dsStyles.minMax}>{min}{unit}</Text>
                <Text style={[dsStyles.current, { color }]}>{value}{unit}</Text>
                <Text style={dsStyles.minMax}>{max}{unit}</Text>
            </View>
            <View ref={trackRef} style={dsStyles.trackWrap} {...panResponder.panHandlers}
                onLayout={() => { trackRef.current?.measureInWindow((x) => { trackX.current = x; }); }}>
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
    minMax: { color: CompetitorTheme.textMuted, fontSize: 11, fontWeight: '500' },
    current: { fontSize: 17, fontWeight: '800' },
    trackWrap: { paddingVertical: 14 },
    track: { height: 6, borderRadius: 3, backgroundColor: CompetitorTheme.ringTrack, position: 'relative' },
    fill: { height: '100%', borderRadius: 3, position: 'absolute' },
    thumb: { position: 'absolute', top: -9, width: 24, height: 24, borderRadius: 12, marginLeft: -12, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5, justifyContent: 'center', alignItems: 'center' },
    thumbInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
});

// ═══ Circular Progress ═══
function CircularProgress({ percentage, size = 85 }: { percentage: number; size?: number }) {
    const clamp = Math.min(100, Math.max(0, percentage));
    return (
        <View style={[cpStyles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
            <View style={[cpStyles.track, { width: size, height: size, borderRadius: size / 2 }]} />
            <View style={[cpStyles.halfClip, { width: size / 2, height: size, left: 0 }]}>
                <View style={[cpStyles.halfCircle, { width: size, height: size, borderRadius: size / 2, borderWidth: 7, transform: [{ rotate: `${clamp > 50 ? 180 : (clamp / 50) * 180}deg` }] }]} />
            </View>
            {clamp > 50 && (
                <View style={[cpStyles.halfClip, { width: size / 2, height: size, right: 0, left: size / 2 }]}>
                    <View style={[cpStyles.halfCircleRight, { width: size, height: size, borderRadius: size / 2, borderWidth: 7, left: -(size / 2), transform: [{ rotate: `${((clamp - 50) / 50) * 180}deg` }] }]} />
                </View>
            )}
            <View style={[cpStyles.inner, { width: size - 18, height: size - 18, borderRadius: (size - 18) / 2 }]} />
        </View>
    );
}
const cpStyles = StyleSheet.create({
    wrap: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
    track: { position: 'absolute', borderWidth: 7, borderColor: CompetitorTheme.ringTrack },
    halfClip: { position: 'absolute', overflow: 'hidden' },
    halfCircle: { position: 'absolute', borderColor: CompetitorTheme.accent, borderRightColor: 'transparent', borderBottomColor: 'transparent' },
    halfCircleRight: { position: 'absolute', borderColor: CompetitorTheme.accent, borderLeftColor: 'transparent', borderTopColor: 'transparent' },
    inner: { position: 'absolute', backgroundColor: CompetitorTheme.cardBg },
});

// ══════════════════════════════════════════
// ════════ ANA COMPONENT ══════════════════
// ══════════════════════════════════════════
export default function CompetitorPersonalInfo({ onClose, userId }: CompetitorPersonalInfoProps) {
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [height, setHeight] = useState(180);
    const [weight, setWeight] = useState(80);
    const [bodyFat, setBodyFat] = useState(10);
    const [age, setAge] = useState(24);
    const [gender, setGender] = useState(1);
    const [activityLevel, setActivityLevel] = useState(5);
    const [muscleMass, setMuscleMass] = useState(42.8);
    const [goal, setGoal] = useState('Şampiyonluk');
    const [allergies, setAllergies] = useState<string[]>([]);
    const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
    const [medications, setMedications] = useState<string[]>([]);
    const [newAllergy, setNewAllergy] = useState('');
    const [newCondition, setNewCondition] = useState('');
    const [newMedication, setNewMedication] = useState('');

    const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));

    const toggleEdit = (val: boolean) => {
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
                setHeight(data.height || 180); setWeight(data.weight || 80);
                setBodyFat(data.bodyFat || 10); setAge(data.age || 24);
                setGender(data.gender || 1); setActivityLevel(data.activityLevel || 5);
                if (data.goal) setGoal(data.goal);
                if (data.medications) setMedications(data.medications);
                if (data.medicalConditions) setMedicalConditions(data.medicalConditions);
                if (data.allergyNames) setAllergies(data.allergyNames);
            }
        } catch (error) { console.error('Error fetching profile:', error); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = await getToken();
            const payload = { height, weight, bodyFat, age, gender, activityLevel, goal, medications, medicalConditions, allergyNames: allergies };
            const response = await fetch(`${API_BASE_URL}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' },
                body: JSON.stringify(payload)
            });
            if (response.ok) { toggleEdit(false); Alert.alert('Başarılı', 'Bilgilerin güncellendi.'); }
            else { const e = await response.text(); console.warn('Backend hatası:', e); Alert.alert('Hata', 'Kaydedilirken bir sorun oluştu.'); }
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

    if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={CompetitorTheme.accent} /></View>;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={CompetitorTheme.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Kişisel Bilgiler</Text>
                    <TouchableOpacity onPress={() => isEditing ? handleSave() : toggleEdit(true)} style={[styles.editButton, isEditing && styles.editButtonActive]}>
                        {saving ? <ActivityIndicator size="small" color="#fff" /> : (
                            <Ionicons name={isEditing ? 'checkmark' : 'create-outline'} size={20} color={isEditing ? '#fff' : CompetitorTheme.accent} />
                        )}
                    </TouchableOpacity>
                </View>

                <Animated.ScrollView style={{ opacity: fadeAnim }} showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, isEditing && { paddingBottom: 100 }]} keyboardShouldPersistTaps="handled">

                    {/* ══ Fiziksel Metrikler ══ */}
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="body-outline" size={16} color={CompetitorTheme.accent} />{'  '}Fiziksel Metrikler
                    </Text>

                    <View style={styles.metricsGrid}>
                        <View style={styles.metricCard}>
                            <Ionicons name="resize-outline" size={18} color={CompetitorTheme.accent} />
                            <Text style={styles.metricValue}>{height}</Text>
                            <Text style={styles.metricUnit}>cm</Text>
                            <Text style={styles.metricLabel}>Boy</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Ionicons name="scale-outline" size={18} color={CompetitorTheme.statCalorie} />
                            <Text style={styles.metricValue}>{weight}</Text>
                            <Text style={styles.metricUnit}>kg</Text>
                            <Text style={styles.metricLabel}>Kilo</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Ionicons name="analytics-outline" size={18} color={CompetitorTheme.success} />
                            <Text style={styles.metricValue}>{bmi}</Text>
                            <Text style={styles.metricUnit}>kg/m²</Text>
                            <Text style={styles.metricLabel}>BMI</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Ionicons name="barbell-outline" size={18} color={CompetitorTheme.statPower} />
                            <Text style={styles.metricValue}>{muscleMass}</Text>
                            <Text style={styles.metricUnit}>%</Text>
                            <Text style={styles.metricLabel}>Kas Kütlesi</Text>
                        </View>
                    </View>

                    {isEditing && (
                        <View style={styles.editSection}>
                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}><Ionicons name="person-outline" size={18} color={CompetitorTheme.textSecondary} /><Text style={styles.sliderTitle}>Yaş</Text></View>
                                <DraggableSlider value={age} min={10} max={100} step={1} unit=" Yaş" color={CompetitorTheme.textSecondary} onValueChange={setAge} />
                            </View>
                            <View style={[styles.sliderCard, { paddingVertical: 12 }]}>
                                <View style={styles.sliderHeader}><Ionicons name="male-female-outline" size={18} color={CompetitorTheme.textSecondary} /><Text style={styles.sliderTitle}>Cinsiyet</Text></View>
                                <View style={styles.optionGrid}>
                                    {GENDERS.map((g) => (
                                        <TouchableOpacity key={g} style={[styles.optionBtn, gender === g && styles.optionBtnActive]} onPress={() => setGender(g)}>
                                            <Text style={[styles.optionText, gender === g && styles.optionTextActive]}>{GENDER_MAP[g]}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}><Ionicons name="resize-outline" size={18} color={CompetitorTheme.accent} /><Text style={styles.sliderTitle}>Boy</Text></View>
                                <DraggableSlider value={height} min={140} max={220} step={1} unit=" cm" color={CompetitorTheme.accent} onValueChange={setHeight} />
                            </View>
                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}><Ionicons name="scale-outline" size={18} color={CompetitorTheme.statCalorie} /><Text style={styles.sliderTitle}>Kilo</Text></View>
                                <DraggableSlider value={weight} min={40} max={150} step={0.1} unit=" kg" color={CompetitorTheme.statCalorie} onValueChange={setWeight} />
                            </View>
                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}><Ionicons name="water-outline" size={18} color={CompetitorTheme.statPower} /><Text style={styles.sliderTitle}>Vücut Yağ Oranı</Text></View>
                                <DraggableSlider value={bodyFat} min={3} max={50} step={0.1} unit="%" color={CompetitorTheme.statPower} onValueChange={setBodyFat} />
                            </View>
                            <View style={styles.sliderCard}>
                                <View style={styles.sliderHeader}><Ionicons name="barbell-outline" size={18} color={CompetitorTheme.statEndurance} /><Text style={styles.sliderTitle}>Kas Kütlesi</Text></View>
                                <DraggableSlider value={muscleMass} min={20} max={60} step={0.1} unit="%" color={CompetitorTheme.statEndurance} onValueChange={setMuscleMass} />
                            </View>
                        </View>
                    )}

                    {/* Vücut Kompozisyon (view mode) */}
                    {!isEditing && (
                        <>
                            <View style={styles.compositionCard}>
                                <View style={styles.compositionLeft}>
                                    <Text style={styles.compositionTitle}>Vücut Kompozisyonu</Text>
                                    <View style={styles.compositionStats}>
                                        <View style={styles.compositionStatRow}>
                                            <View style={[styles.compositionDot, { backgroundColor: CompetitorTheme.accent }]} />
                                            <Text style={styles.compositionStatLabel}>Yağ Oranı</Text>
                                            <Text style={styles.compositionStatValue}>{bodyFat}%</Text>
                                        </View>
                                        <View style={styles.compositionStatRow}>
                                            <View style={[styles.compositionDot, { backgroundColor: CompetitorTheme.statPower }]} />
                                            <Text style={styles.compositionStatLabel}>Kas Kütlesi</Text>
                                            <Text style={styles.compositionStatValue}>{muscleMass}%</Text>
                                        </View>
                                        <View style={styles.compositionStatRow}>
                                            <View style={[styles.compositionDot, { backgroundColor: CompetitorTheme.statWater }]} />
                                            <Text style={styles.compositionStatLabel}>Diğer</Text>
                                            <Text style={styles.compositionStatValue}>{(100 - bodyFat - muscleMass).toFixed(1)}%</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.compositionRight}>
                                    <CircularProgress percentage={bodyFat} size={85} />
                                    <View style={styles.compositionOverlay}>
                                        <Text style={styles.compositionPercent}>{bodyFat}</Text>
                                        <Text style={styles.compositionPercentSign}>%</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <View style={[styles.infoIconWrap, { backgroundColor: CompetitorTheme.surface }]}>
                                        <Ionicons name="person" size={18} color={CompetitorTheme.textSecondary} />
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
                        <Ionicons name="heart-outline" size={16} color={CompetitorTheme.error} />{'  '}Sağlık Bilgileri
                    </Text>

                    {/* Alerjiler */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(251, 191, 36, 0.12)' }]}>
                                <Ionicons name="alert-circle" size={18} color={CompetitorTheme.warning} />
                            </View>
                            <Text style={styles.infoLabel}>Alerjiler</Text>
                        </View>
                        {allergies.length > 0 ? (
                            <View style={styles.chipContainer}>
                                {allergies.map((a, i) => (
                                    <View key={i} style={styles.chip}>
                                        <Ionicons name="warning-outline" size={12} color={CompetitorTheme.warning} />
                                        <Text style={styles.chipText}>{a}</Text>
                                        {isEditing && <TouchableOpacity onPress={() => removeItem(allergies, setAllergies, i)}><Ionicons name="close-circle" size={16} color={CompetitorTheme.error} /></TouchableOpacity>}
                                    </View>
                                ))}
                            </View>
                        ) : !isEditing && <Text style={styles.emptyText}>Kayıtlı alerji yok ✓</Text>}
                        {isEditing && (
                            <View style={styles.addRow}>
                                <TextInput style={styles.addInput} placeholder="Yeni alerji ekle..." placeholderTextColor={CompetitorTheme.textMuted} value={newAllergy} onChangeText={setNewAllergy}
                                    onSubmitEditing={() => addItem(allergies, setAllergies, newAllergy, setNewAllergy)} />
                                <TouchableOpacity style={[styles.addButton, { backgroundColor: CompetitorTheme.warning }]} onPress={() => addItem(allergies, setAllergies, newAllergy, setNewAllergy)}>
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Tıbbi Durumlar */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: CompetitorTheme.accentDim }]}>
                                <Ionicons name="medkit" size={18} color={CompetitorTheme.accent} />
                            </View>
                            <Text style={styles.infoLabel}>Tıbbi Durumlar</Text>
                        </View>
                        {medicalConditions.length > 0 ? (
                            <View style={styles.chipContainer}>
                                {medicalConditions.map((c, i) => (
                                    <View key={i} style={[styles.chip, styles.chipMedical]}>
                                        <Ionicons name="medical-outline" size={12} color={CompetitorTheme.accent} />
                                        <Text style={[styles.chipText, { color: CompetitorTheme.accent }]}>{c}</Text>
                                        {isEditing && <TouchableOpacity onPress={() => removeItem(medicalConditions, setMedicalConditions, i)}><Ionicons name="close-circle" size={16} color={CompetitorTheme.error} /></TouchableOpacity>}
                                    </View>
                                ))}
                            </View>
                        ) : !isEditing && <Text style={styles.emptyText}>Kayıtlı tıbbi durum yok ✓</Text>}
                        {isEditing && (
                            <View style={styles.addRow}>
                                <TextInput style={styles.addInput} placeholder="Yeni tıbbi durum ekle..." placeholderTextColor={CompetitorTheme.textMuted} value={newCondition} onChangeText={setNewCondition}
                                    onSubmitEditing={() => addItem(medicalConditions, setMedicalConditions, newCondition, setNewCondition)} />
                                <TouchableOpacity style={[styles.addButton, { backgroundColor: CompetitorTheme.accent }]} onPress={() => addItem(medicalConditions, setMedicalConditions, newCondition, setNewCondition)}>
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* İlaçlar */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(167, 139, 250, 0.12)' }]}>
                                <Ionicons name="fitness" size={18} color={CompetitorTheme.statPower} />
                            </View>
                            <Text style={styles.infoLabel}>Kullanılan İlaçlar</Text>
                        </View>
                        {medications.length > 0 ? (
                            medications.map((m, i) => (
                                <View key={i} style={styles.medRow}>
                                    <View style={styles.medBullet} />
                                    <Text style={styles.medText}>{m}</Text>
                                    {isEditing && <TouchableOpacity onPress={() => removeItem(medications, setMedications, i)}><Ionicons name="close-circle" size={16} color={CompetitorTheme.error} /></TouchableOpacity>}
                                </View>
                            ))
                        ) : !isEditing && <Text style={styles.emptyText}>Kayıtlı ilaç yok ✓</Text>}
                        {isEditing && (
                            <View style={styles.addRow}>
                                <TextInput style={styles.addInput} placeholder="Yeni ilaç ekle..." placeholderTextColor={CompetitorTheme.textMuted} value={newMedication} onChangeText={setNewMedication}
                                    onSubmitEditing={() => addItem(medications, setMedications, newMedication, setNewMedication)} />
                                <TouchableOpacity style={[styles.addButton, { backgroundColor: CompetitorTheme.statPower }]} onPress={() => addItem(medications, setMedications, newMedication, setNewMedication)}>
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* ══ Performans ══ */}
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="speedometer-outline" size={16} color={CompetitorTheme.accent} />{'  '}Performans & Hedef
                    </Text>

                    <View style={styles.activityCard}>
                        <View style={styles.activityHeader}>
                            <View style={styles.activityIconWrap}><Ionicons name="flash" size={20} color={CompetitorTheme.accent} /></View>
                            <View>
                                <Text style={styles.activityTitle}>Aktivite Seviyesi</Text>
                                <Text style={styles.activityLevelText}>{ACTIVITY_LABELS[activityLevel]}</Text>
                            </View>
                        </View>
                        <View style={styles.activityDotsRow}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TouchableOpacity key={i} disabled={!isEditing} onPress={() => isEditing && setActivityLevel(i)}
                                    style={[styles.activityDot, i <= activityLevel && styles.activityDotActive, isEditing && styles.activityDotEditable]}>
                                    {isEditing && <Text style={styles.activityDotLabel}>{i}</Text>}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.gradientBarBg}>
                            <View style={[styles.gradientBarFill, { width: `${(activityLevel / 5) * 100}%`, backgroundColor: CompetitorTheme.accent }]} />
                        </View>
                    </View>

                    {/* Hedef */}
                    <View style={[styles.infoCard, { marginTop: 10 }]}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIconWrap, { backgroundColor: CompetitorTheme.accentDim }]}>
                                <Ionicons name="trophy" size={18} color={CompetitorTheme.accent} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Mevcut Hedef</Text>
                                {isEditing ? (
                                    <TextInput style={styles.goalInput} value={goal} onChangeText={setGoal} placeholderTextColor={CompetitorTheme.textMuted} />
                                ) : (
                                    <Text style={styles.infoValue}>{goal}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </Animated.ScrollView>

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
    container: { flex: 1, backgroundColor: CompetitorTheme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: CompetitorTheme.cardBg, borderWidth: 1, borderColor: CompetitorTheme.cardBorder, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: CompetitorTheme.text, fontSize: 18, fontWeight: '700' },
    editButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: CompetitorTheme.accentDim, borderWidth: 1, borderColor: 'rgba(255, 107, 44, 0.3)', justifyContent: 'center', alignItems: 'center' },
    editButtonActive: { backgroundColor: CompetitorTheme.accent, borderColor: CompetitorTheme.accent },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
    sectionTitle: { color: CompetitorTheme.text, fontSize: 15, fontWeight: '700', marginTop: 24, marginBottom: 14, letterSpacing: 0.3 },
    editSection: { gap: 10, marginTop: 14 },
    sliderCard: { backgroundColor: CompetitorTheme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: CompetitorTheme.cardBorder, padding: 16 },
    sliderHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sliderTitle: { color: CompetitorTheme.text, fontSize: 14, fontWeight: '600' },
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    metricCard: { width: (SCREEN_WIDTH - 50) / 2, backgroundColor: CompetitorTheme.cardBg, borderRadius: 18, borderWidth: 1, borderColor: CompetitorTheme.cardBorder, padding: 16, alignItems: 'center', gap: 4 },
    metricValue: { color: CompetitorTheme.text, fontSize: 24, fontWeight: '900', marginTop: 4 },
    metricUnit: { color: CompetitorTheme.textSecondary, fontSize: 11 },
    metricLabel: { color: CompetitorTheme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 },
    compositionCard: { flexDirection: 'row', backgroundColor: CompetitorTheme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: CompetitorTheme.cardBorder, padding: 20, marginTop: 10, alignItems: 'center' },
    compositionLeft: { flex: 1 },
    compositionTitle: { color: CompetitorTheme.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
    compositionStats: { gap: 8 },
    compositionStatRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    compositionDot: { width: 8, height: 8, borderRadius: 4 },
    compositionStatLabel: { color: CompetitorTheme.textSecondary, fontSize: 12, flex: 1 },
    compositionStatValue: { color: CompetitorTheme.text, fontSize: 13, fontWeight: '700' },
    compositionRight: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
    compositionOverlay: { position: 'absolute', flexDirection: 'row', alignItems: 'flex-start' },
    compositionPercent: { color: CompetitorTheme.text, fontSize: 20, fontWeight: '900' },
    compositionPercentSign: { color: CompetitorTheme.accent, fontSize: 11, fontWeight: '700', marginTop: 3 },
    infoCard: { backgroundColor: CompetitorTheme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: CompetitorTheme.cardBorder, padding: 16, marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    infoIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    infoContent: { flex: 1 },
    infoLabel: { color: CompetitorTheme.textSecondary, fontSize: 13, fontWeight: '500' },
    infoValue: { color: CompetitorTheme.text, fontSize: 18, fontWeight: '700', marginTop: 2 },
    optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
    optionBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: CompetitorTheme.surface, borderWidth: 1, borderColor: CompetitorTheme.cardBorder },
    optionBtnActive: { backgroundColor: CompetitorTheme.accentDim, borderColor: CompetitorTheme.accent },
    optionText: { color: CompetitorTheme.textSecondary, fontSize: 13, fontWeight: '600' },
    optionTextActive: { color: CompetitorTheme.accent },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(251, 191, 36, 0.10)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)', paddingHorizontal: 12, paddingVertical: 6 },
    chipMedical: { backgroundColor: CompetitorTheme.accentDim, borderColor: 'rgba(255, 107, 44, 0.2)' },
    chipText: { color: CompetitorTheme.warning, fontSize: 12, fontWeight: '600' },
    emptyText: { color: CompetitorTheme.success, fontSize: 13, fontWeight: '500', marginTop: 8, paddingLeft: 48 },
    addRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
    addInput: { flex: 1, height: 40, backgroundColor: CompetitorTheme.surface, borderRadius: 12, borderWidth: 1, borderColor: CompetitorTheme.cardBorder, paddingHorizontal: 14, color: CompetitorTheme.text, fontSize: 13 },
    addButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    medRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, paddingLeft: 48 },
    medBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: CompetitorTheme.statPower },
    medText: { color: CompetitorTheme.text, fontSize: 14, fontWeight: '500', flex: 1 },
    goalInput: { color: CompetitorTheme.text, fontSize: 15, fontWeight: '600', borderBottomWidth: 1, borderBottomColor: CompetitorTheme.accent, paddingVertical: 4, marginTop: 2 },
    activityCard: { backgroundColor: CompetitorTheme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: CompetitorTheme.cardBorder, padding: 16 },
    activityHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    activityIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: CompetitorTheme.accentDim, justifyContent: 'center', alignItems: 'center' },
    activityTitle: { color: CompetitorTheme.textSecondary, fontSize: 12, fontWeight: '500' },
    activityLevelText: { color: CompetitorTheme.text, fontSize: 16, fontWeight: '700', marginTop: 1 },
    activityDotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16 },
    activityDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: CompetitorTheme.ringTrack, borderWidth: 2, borderColor: CompetitorTheme.cardBorder, justifyContent: 'center', alignItems: 'center' },
    activityDotActive: { backgroundColor: CompetitorTheme.accent, borderColor: CompetitorTheme.accent },
    activityDotEditable: { width: 32, height: 32, borderRadius: 16 },
    activityDotLabel: { color: '#fff', fontSize: 12, fontWeight: '700' },
    gradientBarBg: { height: 7, borderRadius: 4, backgroundColor: CompetitorTheme.ringTrack, overflow: 'hidden', marginTop: 16 },
    gradientBarFill: { height: '100%', borderRadius: 4 },
    saveContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: CompetitorTheme.background, borderTopWidth: 1, borderTopColor: CompetitorTheme.cardBorder },
    saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: CompetitorTheme.accent, borderRadius: 16, paddingVertical: 16 },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
