import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AthleteTheme } from '@/constants/theme';
import { getToken, removeToken } from '@/utils/auth';
import { useRouter } from 'expo-router';
import AthletePersonalInfo from './components/AthletePersonalInfo';
import { API_ENDPOINTS } from '@/constants/apiConfig';

// TODO: Gerçek backend API URL'nizi buraya yazın
const API_URL = API_ENDPOINTS.AUTH.ME;

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    weight: number;
    height: number;
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
                    email: data.email,
                    weight: data.weight,
                    height: data.height,
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
        return <AthletePersonalInfo onClose={() => setShowPersonalInfo(false)} userId={profile.id} />;
    }

    const menuItems: ProfileMenuItem[] = [
        { icon: 'body-outline', label: 'Fiziksel Bilgiler', value: `${profile?.weight} kg · ${profile?.height} cm`, onPress: () => setShowPersonalInfo(true) },
        { icon: 'barbell-outline', label: 'Antrenman Geçmişi', value: '24 antrenman' },
        { icon: 'nutrition-outline', label: 'Beslenme Hedeflerim' },
        { icon: 'trophy-outline', label: 'Başarılarım', value: '3 rozet' },
        { icon: 'settings-outline', label: 'Ayarlar' },
        { icon: 'log-out-outline', label: 'Çıkış Yap', color: AthleteTheme.error, onPress: handleLogout },
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
                    <Ionicons name="person" size={40} color={AthleteTheme.accent} />
                </View>
                {loading ? (
                    <ActivityIndicator size="small" color={AthleteTheme.accent} style={{ marginTop: 8 }} />
                ) : (
                    <>
                        <Text style={styles.name}>
                            {profile ? `${profile.firstName} ${profile.lastName}` : 'Sporcu'}
                        </Text>
                        <Text style={styles.email}>
                            {profile ? profile.email : 'sporcu@arcteam.com'}
                        </Text>
                    </>
                )}
                <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                        <Ionicons name="fitness" size={14} color={AthleteTheme.accent} />
                        <Text style={styles.badgeText}>Aktif Üye</Text>
                    </View>
                    <View style={styles.badge}>
                        <Ionicons name="flame" size={14} color={AthleteTheme.statCalorie} />
                        <Text style={styles.badgeText}>12 Gün Seri</Text>
                    </View>
                </View>
            </View>

            {/* Stats summary */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>24</Text>
                    <Text style={styles.statLabel}>Antrenman</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>8</Text>
                    <Text style={styles.statLabel}>Hafta</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>4.2</Text>
                    <Text style={styles.statLabel}>kg Değişim</Text>
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
                        <Ionicons name={item.icon} size={20} color={item.color || AthleteTheme.accent} />
                    </View>
                    <View style={styles.menuInfo}>
                        <Text style={[styles.menuLabel, item.color && { color: item.color }]}>{item.label}</Text>
                        {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={AthleteTheme.textMuted} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: AthleteTheme.background,
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
        backgroundColor: AthleteTheme.accentDim,
        borderWidth: 3,
        borderColor: AthleteTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    name: {
        color: AthleteTheme.text,
        fontSize: 22,
        fontWeight: '800',
    },
    email: {
        color: AthleteTheme.textSecondary,
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
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    badgeText: {
        color: AthleteTheme.text,
        fontSize: 12,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        padding: 20,
        marginBottom: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        color: AthleteTheme.accent,
        fontSize: 22,
        fontWeight: '800',
    },
    statLabel: {
        color: AthleteTheme.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: AthleteTheme.cardBorder,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: AthleteTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AthleteTheme.cardBorder,
        padding: 14,
        marginBottom: 8,
        gap: 14,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: AthleteTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuInfo: {
        flex: 1,
    },
    menuLabel: {
        color: AthleteTheme.text,
        fontSize: 15,
        fontWeight: '600',
    },
    menuValue: {
        color: AthleteTheme.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
});
