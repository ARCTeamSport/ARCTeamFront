import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { CoachTheme } from '@/constants/theme';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';
import SearchInviteModal from './components/SearchInviteModal';

interface InvitationCodeDto {
    id: number;
    code: string;
    email: string | null;
    targetRole: string;
    createdAt: string;
    expiryDate: string;
}

export default function InvitationHubScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [invitations, setInvitations] = useState<InvitationCodeDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalRole, setModalRole] = useState<'Athlete' | 'Competitor'>('Athlete');

    const fetchInvitations = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const token = await getToken();
            if (!token) return;

            const response = await fetch(API_ENDPOINTS.TEAM.ACTIVE_INVITES, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setInvitations(data);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Davetiyeler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const onRefresh = useCallback(() => {
        fetchInvitations(true);
    }, []);

    const handleCopy = async (code: string) => {
        await Clipboard.setStringAsync(code);
        Alert.alert('Kopyalandı', 'Davet kodu panoya kopyalandı.');
    };

    const handleShare = async (code: string) => {
        try {
            await Share.share({
                message: `ARCTeam'e katılmak için bu davet kodunu kullan: ${code}\n\nUygulamayı indirip kayıt olurken bu kodu gir.`,
            });
        } catch (err) {
            console.error('Share error:', err);
        }
    };

    const handleCancel = (id: number) => {
        Alert.alert(
            'Davetiyeyi İptal Et',
            'Bu davet kodunu iptal etmek istediğinize emin misiniz? Sporcu bu kodu kullanarak artık size katılamaz.',
            [
                { text: 'Vazgeç', style: 'cancel' },
                {
                    text: 'İptal Et',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await getToken();
                            const response = await fetch(API_ENDPOINTS.TEAM.CANCEL_INVITE(id), {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });

                            if (response.ok) {
                                setInvitations(prev => prev.filter(inv => inv.id !== id));
                            } else {
                                Alert.alert('Hata', 'Davetiye iptal edilemedi.');
                            }
                        } catch (err) {
                            Alert.alert('Hata', 'Sunucu bağlantı hatası.');
                        }
                    }
                }
            ]
        );
    };

    const handleOpenModal = () => {
        // Default to Athlete for the central FAB. User can select in the future if needed,
        // or we could add another small interaction. For now, we'll assume Athlete,
        // but SearchInviteModal handles search for anything, and generating invite uses targetRole.
        setModalRole('Athlete');
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: InvitationCodeDto }) => {
        const isAthlete = item.targetRole === 'Athlete';
        const roleColor = isAthlete ? CoachTheme.badgeAthlete : CoachTheme.badgeCompetitor;
        const roleLabel = isAthlete ? 'Sporcu' : 'Yarışmacı';
        const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.roleBadgeContainer}>
                        <View style={[styles.roleDot, { backgroundColor: roleColor }]} />
                        <Text style={styles.roleText}>{roleLabel}</Text>
                    </View>
                    <Text style={styles.daysLeftText}>{daysLeft} gün kaldı</Text>
                </View>

                <View style={styles.codeContainer}>
                    <Text style={styles.codeText}>{item.code}</Text>
                </View>

                {!!item.email ? (
                    <Text style={styles.emailText}>Davet edilen: {item.email}</Text>
                ) : null}

                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleCopy(item.code)} activeOpacity={0.7}>
                        <Ionicons name="copy-outline" size={16} color={CoachTheme.textSecondary} />
                        <Text style={styles.actionText}>Kopyala</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item.code)} activeOpacity={0.7}>
                        <Ionicons name="share-social-outline" size={16} color={CoachTheme.textSecondary} />
                        <Text style={styles.actionText}>Paylaş</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)} activeOpacity={0.7}>
                        <Ionicons name="trash-outline" size={16} color={CoachTheme.error} />
                        <Text style={styles.cancelText}>İptal Et</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={CoachTheme.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Bekleyen Davetler</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* List */}
            {loading && invitations.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={CoachTheme.accent} />
                </View>
            ) : (
                <FlatList
                    data={invitations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={CoachTheme.accent}
                            colors={[CoachTheme.accent]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="mail-unread-outline" size={48} color={CoachTheme.textMuted} />
                            <Text style={styles.emptyTitle}>Aktif Davet Yok</Text>
                            <Text style={styles.emptySub}>Henüz kimseye davet göndermediniz veya tüm davetleriniz kabul edildi.</Text>
                        </View>
                    }
                />
            )}

            {/* Squircle FAB */}
            <TouchableOpacity
                style={[styles.squircleFab, { bottom: insets.bottom + 16 }]}
                onPress={handleOpenModal}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={32} color="#0A0E10" />
            </TouchableOpacity>

            {/* Modal */}
            <SearchInviteModal
                visible={modalVisible}
                targetRole={modalRole}
                onClose={() => setModalVisible(false)}
                onAdded={() => fetchInvitations()}
            />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        color: CoachTheme.text,
        fontSize: 20,
        fontWeight: '700',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120, // FAB için boşluk
        flexGrow: 1,
    },
    card: {
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    roleBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: CoachTheme.surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    roleDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    roleText: {
        color: CoachTheme.text,
        fontSize: 12,
        fontWeight: '600',
    },
    daysLeftText: {
        color: CoachTheme.warning,
        fontSize: 12,
        fontWeight: '600',
    },
    codeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CoachTheme.surface,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: CoachTheme.divider,
        borderStyle: 'dashed',
    },
    codeText: {
        color: CoachTheme.accent,
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 4,
    },
    emailText: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        marginBottom: 12,
        textAlign: 'center',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: CoachTheme.divider,
        paddingTop: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: CoachTheme.surface,
        borderRadius: 8,
    },
    actionText: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        fontWeight: '600',
    },
    cancelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 77, 106, 0.1)',
        borderRadius: 8,
    },
    cancelText: {
        color: CoachTheme.error,
        fontSize: 13,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 12,
    },
    emptyTitle: {
        color: CoachTheme.text,
        fontSize: 18,
        fontWeight: '700',
    },
    emptySub: {
        color: CoachTheme.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },
    squircleFab: {
        position: 'absolute',
        alignSelf: 'center',
        width: 64,
        height: 64,
        backgroundColor: CoachTheme.accent,
        borderRadius: 24, // Squircle etkisi için
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: CoachTheme.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
});
