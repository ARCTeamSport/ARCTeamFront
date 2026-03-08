import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import AthleteCard from './components/AthleteCard';
import ProgramEditorScreen from './components/ProgramEditorScreen';
import FABSpeedDial from './components/FABSpeedDial';
import SearchInviteModal from './components/SearchInviteModal';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';
import { useRouter } from 'expo-router';

interface TeamMemberDto {
    id: number;
    athleteId: number;
    fullName: string;
    role: string;
    weight: number;
    height: number;
    goal: string | null;
    joinedAt: string;
}

type FilterType = 'all' | 'athlete' | 'competitor';

export default function TeamScreen() {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [selectedAthlete, setSelectedAthlete] = useState<TeamMemberDto | null>(null);
    const [athletes, setAthletes] = useState<TeamMemberDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalRole, setModalRole] = useState<'Athlete' | 'Competitor'>('Athlete');

    const router = useRouter();

    const fetchMyTeam = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const token = await getToken();
            if (!token) {
                Alert.alert("Hata", "Oturum süresi dolmuş, lütfen tekrar giriş yapın.");
                return;
            }

            const response = await fetch(API_ENDPOINTS.TEAM.MY_TEAM, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setAthletes(data);
            } else {
                Alert.alert("Hata", "Takımınız yüklenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Hata", "Sunucuya bağlanılamadı.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMyTeam();
    }, []);

    const onRefresh = useCallback(() => {
        fetchMyTeam(true);
    }, []);

    const filteredAthletes = athletes.filter((a) => {
        const matchesSearch = a.fullName.toLowerCase().includes(search.toLowerCase());
        const roleStr = a.role.toLowerCase();
        const filterStr = filter === 'all' ? null : filter === 'athlete' ? 'athlete' : 'competitor';
        const matchesFilter = filterStr === null || roleStr === filterStr;
        return matchesSearch && matchesFilter;
    });

    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'Tümü' },
        { key: 'athlete', label: 'Sporcular' },
        { key: 'competitor', label: 'Yarışmacılar' },
    ];

    const handleOpenModal = (role: 'Athlete' | 'Competitor') => {
        setModalRole(role);
        setModalVisible(true);
    };

    const renderAthleteCard = ({ item }: { item: TeamMemberDto }) => (
        <AthleteCard
            key={item.id}
            name={item.fullName}
            role={item.role.toLowerCase() as 'athlete' | 'competitor'}
            lastActive={"Yeni"}
            completionRate={100}
            onPress={() => setSelectedAthlete(item)}
        />
    );

    const renderEmptyState = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyState}>
                <View style={styles.emptyIllustration}>
                    <View style={styles.emptyCircle1}>
                        <Ionicons name="people" size={32} color={CoachTheme.accent} />
                    </View>
                    <View style={styles.emptyCircle2}>
                        <Ionicons name="person-add" size={20} color={CoachTheme.badgeAthlete} />
                    </View>
                    <View style={styles.emptyCircle3}>
                        <Ionicons name="trophy" size={18} color={CoachTheme.badgeCompetitor} />
                    </View>
                </View>
                <Text style={styles.emptyTitle}>Takımınız Henüz Boş</Text>
                <Text style={styles.emptySubtitle}>
                    Sporcularınızı veya yarışmacılarınızı ekleyerek başlayın
                </Text>
                <TouchableOpacity
                    style={styles.emptyCta}
                    onPress={() => handleOpenModal('Athlete')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="person-add-outline" size={18} color="#0A0E10" />
                    <Text style={styles.emptyCtaText}>İlk Sporcunu Ekle</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderHeader = () => (
        <>
            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={CoachTheme.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Sporcu ara..."
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

            {/* Filter Chips */}
            <View style={styles.filterRow}>
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
                        onPress={() => setFilter(f.key)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filter === f.key && styles.filterTextActive,
                            ]}
                        >
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.title}>Takımım</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{athletes.length}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                        onPress={() => router.push('/(coach)/invitation-hub')}
                        style={styles.headerBtn}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="mail-unread-outline" size={22} color={CoachTheme.accent} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => fetchMyTeam()} disabled={loading} style={styles.headerBtn} activeOpacity={0.7}>
                        <Ionicons name="refresh" size={22} color={loading ? CoachTheme.textMuted : CoachTheme.accent} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* List with Pull-to-Refresh */}
            {loading && athletes.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={CoachTheme.accent} />
                </View>
            ) : (
                <FlatList
                    data={filteredAthletes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAthleteCard}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmptyState}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={CoachTheme.accent}
                            colors={[CoachTheme.accent]}
                            progressBackgroundColor={CoachTheme.cardBg}
                        />
                    }
                />
            )}

            {/* FAB Speed Dial */}
            <FABSpeedDial
                onAddAthlete={() => handleOpenModal('Athlete')}
                onAddCompetitor={() => handleOpenModal('Competitor')}
            />

            {/* Search & Invite Modal */}
            <SearchInviteModal
                visible={modalVisible}
                targetRole={modalRole}
                onClose={() => setModalVisible(false)}
                onAdded={() => fetchMyTeam()}
            />

            {/* Program Editor Modal */}
            {selectedAthlete && (
                <ProgramEditorScreen
                    visible={true}
                    athleteName={selectedAthlete.fullName}
                    athleteRole={selectedAthlete.role.toLowerCase() as 'athlete' | 'competitor'}
                    onClose={() => setSelectedAthlete(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerBtn: {
        padding: 8,
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    countBadge: {
        backgroundColor: CoachTheme.accentDim,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    countText: {
        color: CoachTheme.accent,
        fontSize: 14,
        fontWeight: '800',
    },
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
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        color: CoachTheme.text,
        fontSize: 14,
        paddingVertical: 12,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
    },
    filterChipActive: {
        backgroundColor: CoachTheme.accentDim,
        borderColor: CoachTheme.accent,
    },
    filterText: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        fontWeight: '600',
    },
    filterTextActive: {
        color: CoachTheme.accent,
    },
    listContent: {
        paddingBottom: 120,
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // ===== Empty State =====
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
        gap: 12,
    },
    emptyIllustration: {
        width: 120,
        height: 100,
        position: 'relative',
        marginBottom: 8,
    },
    emptyCircle1: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: CoachTheme.accentDim,
        borderWidth: 2,
        borderColor: CoachTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 28,
        top: 0,
    },
    emptyCircle2: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: CoachTheme.badgeAthleteDim,
        borderWidth: 1.5,
        borderColor: CoachTheme.badgeAthlete,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
    },
    emptyCircle3: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: CoachTheme.badgeCompetitorDim,
        borderWidth: 1.5,
        borderColor: CoachTheme.badgeCompetitor,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        bottom: 10,
    },
    emptyTitle: {
        color: CoachTheme.text,
        fontSize: 18,
        fontWeight: '700',
    },
    emptySubtitle: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },
    emptyCta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: CoachTheme.accent,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 8,
        shadowColor: CoachTheme.fabShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    emptyCtaText: {
        color: '#0A0E10',
        fontSize: 15,
        fontWeight: '700',
    },
});

