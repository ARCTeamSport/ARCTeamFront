import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompetitorTheme } from '@/constants/theme';
import { getToken, removeToken } from '@/utils/auth';
import { useRouter } from 'expo-router';
import CompetitorPersonalInfo from './components/CompetitorPersonalInfo';
import { API_ENDPOINTS } from '@/constants/apiConfig';

// TODO: Gerçek backend API URL'nizi buraya yazın
const API_URL = API_ENDPOINTS.PROFILE.UPDATE('{userId}');

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface ProfileMenuItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    color?: string;
    onPress?: () => void;
}

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await getToken();
            if (!token) {
                handleLogout();
                return;
            }

            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfile({
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                });
            } else {
                console.warn('Profile fetch failed with status:', response.status);
            }
        } catch (error) {
            console.error('Network error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await removeToken();
        router.replace('/(auth)/login' as any);
    };

    // Kişisel bilgiler ekranı açıksa onu göster
    if (showPersonalInfo && profile) {
        return <CompetitorPersonalInfo onClose={() => setShowPersonalInfo(false)} userId={profile.id} />;
    }

    const menuItems: ProfileMenuItem[] = [
        { icon: 'trophy-outline', label: 'Yarışma Başarıları', value: '3 madalya' },
        { icon: 'stats-chart-outline', label: 'Kişisel Rekorlar', value: '12 PR' },
        { icon: 'body-outline', label: 'Fiziksel Bilgiler', value: '82 kg · 180 cm', onPress: () => setShowPersonalInfo(true) },
        { icon: 'barbell-outline', label: 'Antrenman Geçmişi', value: '48 antrenman' },
        { icon: 'nutrition-outline', label: 'Beslenme Hedeflerim' },
        { icon: 'medal-outline', label: 'Başarılarım', value: '8 rozet' },
        { icon: 'settings-outline', label: 'Ayarlar' },
        { icon: 'log-out-outline', label: 'Çıkış Yap', color: CompetitorTheme.error, onPress: handleLogout },
    ];

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Profile header */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarLarge}>
                    <Ionicons name="flame" size={40} color={CompetitorTheme.accent} />
                </View>
                {loading ? (
                    <ActivityIndicator size="small" color={CompetitorTheme.accent} style={{ marginTop: 8 }} />
                ) : (
                    <>
                        <Text style={styles.name}>
                            {profile ? `${profile.firstName} ${profile.lastName}` : 'Yarışmacı'}
                        </Text>
                        <Text style={styles.email}>
                            {profile ? profile.email : 'yarisma@arcteam.com'}
                        </Text>
                    </>
                )}
                <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                        <Ionicons name="flame" size={14} color={CompetitorTheme.accent} />
                        <Text style={styles.badgeText}>Yarışmacı</Text>
                    </View>
                    <View style={styles.badge}>
                        <Ionicons name="trophy" size={14} color={CompetitorTheme.gold} />
                        <Text style={styles.badgeText}>28 Gün Seri</Text>
                    </View>
                </View>
            </View>

            {/* Stats summary */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>48</Text>
                    <Text style={styles.statLabel}>Antrenman</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>3</Text>
                    <Text style={styles.statLabel}>Madalya</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>PR</Text>
                </View>
            </View>

            {/* Menu items */}
            {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={item.onPress}
                >
                    <View style={[styles.menuIcon, item.color && { backgroundColor: 'rgba(255, 77, 106, 0.12)' }]}>
                        <Ionicons name={item.icon} size={20} color={item.color || CompetitorTheme.accent} />
                    </View>
                    <View style={styles.menuInfo}>
                        <Text style={[styles.menuLabel, item.color && { color: item.color }]}>{item.label}</Text>
                        {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={CompetitorTheme.textMuted} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CompetitorTheme.background,
    },
    content: {
        paddingBottom: 20,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: CompetitorTheme.accentDim,
        borderWidth: 3,
        borderColor: CompetitorTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    name: {
        color: CompetitorTheme.text,
        fontSize: 22,
        fontWeight: '800',
    },
    email: {
        color: CompetitorTheme.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    badgeText: {
        color: CompetitorTheme.text,
        fontSize: 12,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
        padding: 20,
        marginBottom: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        color: CompetitorTheme.accent,
        fontSize: 22,
        fontWeight: '800',
    },
    statLabel: {
        color: CompetitorTheme.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: CompetitorTheme.cardBorder,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: CompetitorTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CompetitorTheme.cardBorder,
        padding: 14,
        marginBottom: 8,
        gap: 14,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: CompetitorTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuInfo: {
        flex: 1,
    },
    menuLabel: {
        color: CompetitorTheme.text,
        fontSize: 15,
        fontWeight: '600',
    },
    menuValue: {
        color: CompetitorTheme.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
});
