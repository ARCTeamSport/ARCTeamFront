import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';

interface SupportDto {
    id: number;
    name: string;
    type: string;
    dosageNotes: string | null;
    imageUrl: string | null;
    isCustom: boolean;
    targetSystem: string | null;
    subSystem: string | null;
    level: string | null;
    category: string | null;
    form: string | null;
    dose: string | null;
    timing: string | null;
    mainPurpose: string | null;
    synergy: string | null;
    criticalNote: string | null;
}

/* ─── Translations ─────────────────────────────────────────── */

const TYPE_TRANSLATIONS: Record<string, string> = {
    Supplement: 'Takviye', Vitamin: 'Vitamin', Mineral: 'Mineral',
    Herb: 'Bitki', Probiotic: 'Probiyotik', Amino: 'Amino Asit',
    Adaptogen: 'Adaptogen', Other: 'Diğer',
};

const LEVEL_TRANSLATIONS: Record<string, string> = {
    Beginner: 'Başlangıç', Intermediate: 'Orta', Advanced: 'İleri',
};

const LEVEL_COLORS: Record<string, string> = {
    Beginner: '#4CAF50', Intermediate: '#FF9800', Advanced: '#F44336',
};

const FORM_TRANSLATIONS: Record<string, string> = {
    Capsule: 'Kapsül', Tablet: 'Tablet', Powder: 'Toz',
    Liquid: 'Sıvı', Softgel: 'Softgel', Gummy: 'Gummy', Other: 'Diğer',
};

const FORM_ICONS: Record<string, string> = {
    Capsule: 'ellipse-outline', Tablet: 'square-outline', Powder: 'beaker-outline',
    Liquid: 'water-outline', Softgel: 'egg-outline', Gummy: 'happy-outline', Other: 'help-circle-outline',
};

const TARGET_SYSTEM_TRANSLATIONS: Record<string, string> = {
    Muscle: 'Kas', Immune: 'Bağışıklık', Brain: 'Beyin', Gut: 'Sindirim',
    Energy: 'Enerji', Hormonal: 'Hormonal', Bone: 'Kemik', Cardiovascular: 'Kardiyovasküler',
    Recovery: 'Toparlanma', Sleep: 'Uyku', Other: 'Diğer',
};

const TARGET_SYSTEM_COLORS: Record<string, string> = {
    Muscle: '#4FC3F7', Immune: '#81C784', Brain: '#CE93D8',
    Gut: '#FFCC80', Energy: '#FF8A65', Hormonal: '#F48FB1',
    Bone: '#B0BEC5', Cardiovascular: '#EF9A9A', Recovery: '#80DEEA',
    Sleep: '#9FA8DA', Other: CoachTheme.accent,
};

/* ─── Component ────────────────────────────────────────────── */

export default function SupportDetailModal() {
    const { id } = useLocalSearchParams();
    const [support, setSupport] = useState<SupportDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchSupport = async () => {
            try {
                const token = await getToken();
                if (!token) { setError('Oturum bulunamadı.'); return; }

                const res = await fetch(API_ENDPOINTS.SUPPORT.GET_BY_ID(Number(id)), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    setSupport(await res.json());
                } else if (res.status === 403) {
                    setError('Bu takviyeyi görüntüleme yetkiniz yok.');
                } else {
                    setError('Takviye bulunamadı.');
                }
            } catch (err) {
                console.error(err);
                setError('Bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchSupport();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={CoachTheme.accent} />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    if (error || !support) {
        return (
            <View style={styles.centerContainer}>
                <View style={styles.errorIconWrap}>
                    <Ionicons name="alert-circle-outline" size={40} color={CoachTheme.error} />
                </View>
                <Text style={styles.errorText}>{error || 'Takviye bulunamadı.'}</Text>
            </View>
        );
    }

    const levelColor = support.level
        ? (LEVEL_COLORS[support.level] ?? CoachTheme.accent)
        : CoachTheme.accent;

    const systemColor = support.targetSystem
        ? (TARGET_SYSTEM_COLORS[support.targetSystem] ?? CoachTheme.accent)
        : CoachTheme.accent;

    const formIcon = support.form ? (FORM_ICONS[support.form] ?? 'ellipse-outline') : 'ellipse-outline';

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Media ── */}
            <View style={styles.mediaContainer}>
                {support.imageUrl ? (
                    <Image source={{ uri: support.imageUrl }} style={styles.media} resizeMode="cover" />
                ) : (
                    <View style={[styles.media, styles.placeholderMedia]}>
                        <View style={[styles.placeholderIconWrap, { backgroundColor: systemColor + '22' }]}>
                            <Ionicons name="medkit-outline" size={52} color={systemColor} />
                        </View>
                    </View>
                )}

                {/* Type pill — sol üst */}
                <View style={styles.typePill}>
                    <Ionicons name="flask-outline" size={12} color={CoachTheme.accent} />
                    <Text style={styles.typePillText}>
                        {TYPE_TRANSLATIONS[support.type] || support.type}
                    </Text>
                </View>

                {/* Level pill — sağ üst */}
                {support.level && (
                    <View style={[styles.levelPill, { backgroundColor: levelColor + '22', borderColor: levelColor + '66' }]}>
                        <View style={[styles.levelDot, { backgroundColor: levelColor }]} />
                        <Text style={[styles.levelPillText, { color: levelColor }]}>
                            {LEVEL_TRANSLATIONS[support.level] || support.level}
                        </Text>
                    </View>
                )}
            </View>

            {/* ── Header ── */}
            <View style={styles.headerSection}>
                <Text style={styles.title}>{support.name}</Text>
                {support.mainPurpose && (
                    <View style={styles.purposeRow}>
                        <Ionicons name="star-outline" size={14} color={CoachTheme.accent} />
                        <Text style={styles.purposeText}>{support.mainPurpose}</Text>
                    </View>
                )}
            </View>

            {/* ── Quick chips ── */}
            <View style={styles.chipsRow}>
                {support.targetSystem && (
                    <Chip
                        icon="body-outline"
                        label={TARGET_SYSTEM_TRANSLATIONS[support.targetSystem] || support.targetSystem}
                        accentColor={systemColor}
                    />
                )}
                {support.category && <Chip icon="layers-outline" label={support.category} />}
                {support.subSystem && <Chip icon="git-branch-outline" label={support.subSystem} />}
                {support.form && (
                    <Chip
                        icon={formIcon as any}
                        label={FORM_TRANSLATIONS[support.form] || support.form}
                    />
                )}
            </View>

            {/* ── Target System featured card ── */}
            {support.targetSystem && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hedef Sistem</Text>
                    <View style={[styles.systemCard, { borderColor: systemColor + '44' }]}>
                        <View style={[styles.systemIconWrap, { backgroundColor: systemColor + '22' }]}>
                            <Ionicons name="pulse-outline" size={26} color={systemColor} />
                        </View>
                        <View style={styles.systemCardBody}>
                            <Text style={[styles.systemName, { color: systemColor }]}>
                                {TARGET_SYSTEM_TRANSLATIONS[support.targetSystem] || support.targetSystem}
                            </Text>
                            {support.subSystem && (
                                <Text style={styles.systemSub}>{support.subSystem}</Text>
                            )}
                        </View>
                        {support.category && (
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>{support.category}</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* ── Dose & Timing stat cards ── */}
            {(support.dose || support.timing || support.form) && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kullanım Bilgileri</Text>
                    <View style={styles.statGrid}>
                        {support.dose && (
                            <StatCard
                                icon="calculator-outline"
                                label="Doz"
                                value={support.dose}
                                color="#4FC3F7"
                            />
                        )}
                        {support.timing && (
                            <StatCard
                                icon="time-outline"
                                label="Zamanlama"
                                value={support.timing}
                                color="#81C784"
                            />
                        )}
                        {support.form && (
                            <StatCard
                                icon={formIcon as any}
                                label="Form"
                                value={FORM_TRANSLATIONS[support.form] || support.form}
                                color="#CE93D8"
                            />
                        )}
                    </View>
                </View>
            )}

            {/* ── Dosage Notes ── */}
            {support.dosageNotes && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dozaj Notları</Text>
                    <View style={styles.infoCard}>
                        <View style={[styles.infoIconWrap, { backgroundColor: '#4FC3F7' + '22' }]}>
                            <Ionicons name="document-text-outline" size={18} color="#4FC3F7" />
                        </View>
                        <Text style={styles.infoText}>{support.dosageNotes}</Text>
                    </View>
                </View>
            )}

            {/* ── Synergy ── */}
            {support.synergy && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sinerji</Text>
                    <View style={styles.infoCard}>
                        <View style={[styles.infoIconWrap, { backgroundColor: '#81C784' + '22' }]}>
                            <Ionicons name="git-merge-outline" size={18} color="#81C784" />
                        </View>
                        <Text style={styles.infoText}>{support.synergy}</Text>
                    </View>
                </View>
            )}

            {/* ── Critical Note ── */}
            {support.criticalNote && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kritik Not</Text>
                    <View style={[styles.infoCard, styles.criticalCard]}>
                        <View style={[styles.infoIconWrap, { backgroundColor: '#FF6B35' + '22' }]}>
                            <Ionicons name="warning-outline" size={18} color="#FF6B35" />
                        </View>
                        <Text style={[styles.infoText, { color: CoachTheme.text }]}>{support.criticalNote}</Text>
                    </View>
                </View>
            )}

            <View style={{ height: 48 }} />
        </ScrollView>
    );
}

/* ─── Sub-components ─────────────────────────────────────── */

function Chip({ icon, label, accentColor }: { icon: any; label: string; accentColor?: string }) {
    const color = accentColor ?? CoachTheme.accent;
    return (
        <View style={[chipStyles.wrap, accentColor ? { borderColor: color + '55' } : null]}>
            <Ionicons name={icon} size={13} color={color} />
            <Text style={[chipStyles.text, accentColor ? { color } : null]}>{label}</Text>
        </View>
    );
}

function StatCard({ icon, label, value, color }: {
    icon: any; label: string; value: string; color: string;
}) {
    return (
        <View style={statStyles.card}>
            <View style={[statStyles.iconWrap, { backgroundColor: color + '22' }]}>
                <Ionicons name={icon} size={18} color={color} />
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
    placeholderIconWrap: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center' },

    typePill: {
        position: 'absolute', top: 16, left: 16,
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: CoachTheme.cardBg + 'CC',
        paddingVertical: 5, paddingHorizontal: 12,
        borderRadius: 20, borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    typePillText: { color: CoachTheme.text, fontSize: 12, fontWeight: '700' },

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
    purposeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    purposeText: { color: CoachTheme.textSecondary, fontSize: 14, fontWeight: '500', flex: 1 },

    /* Chips */
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginBottom: 28 },

    /* Sections */
    section: { paddingHorizontal: 20, marginBottom: 28 },
    sectionTitle: {
        color: CoachTheme.textMuted, fontSize: 11, fontWeight: '700',
        letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14,
    },

    /* System featured card */
    systemCard: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 20, padding: 20,
        borderWidth: 1,
    },
    systemIconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    systemCardBody: { flex: 1 },
    systemName: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
    systemSub: { color: CoachTheme.textMuted, fontSize: 13, fontWeight: '500' },
    categoryBadge: {
        backgroundColor: CoachTheme.sectionBg,
        paddingVertical: 4, paddingHorizontal: 10,
        borderRadius: 10, borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    categoryBadgeText: { color: CoachTheme.textSecondary, fontSize: 12, fontWeight: '600' },

    /* Stat grid */
    statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

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

const statStyles = StyleSheet.create({
    card: {
        flex: 1, minWidth: '44%',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 18, padding: 16,
        borderWidth: 1, borderColor: CoachTheme.cardBorder,
    },
    iconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    label: { color: CoachTheme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
    value: { color: CoachTheme.text, fontSize: 17, fontWeight: '800' },
});
