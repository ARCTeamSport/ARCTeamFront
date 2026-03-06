import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { getToken, removeToken } from '@/utils/auth';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '@/constants/apiConfig';

// TODO: Gerçek backend API URL'nizi buraya yazın
const API_URL = API_ENDPOINTS.AUTH.ME;

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

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

    const menuItems = [
        { icon: 'settings-outline' as const, label: 'Ayarlar', onPress: () => { } },
        { icon: 'shield-checkmark-outline' as const, label: 'Güvenlik', onPress: () => { } },
        { icon: 'help-circle-outline' as const, label: 'Yardım', onPress: () => { } },
        { icon: 'log-out-outline' as const, label: 'Çıkış Yap', onPress: handleLogout, isDanger: true },
    ];

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Profil</Text>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={CoachTheme.accent} />
                </View>
            ) : (
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={36} color={CoachTheme.accent} />
                    </View>
                    <Text style={styles.name}>
                        {profile ? `${profile.firstName} ${profile.lastName}` : 'Kullanıcı Adı'}
                    </Text>
                    <Text style={styles.email}>
                        {profile ? profile.email : 'bilinmiyor@arcteam.com'}
                    </Text>
                </View>
            )}

            <View style={styles.menuList}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIconCircle, item.isDanger && styles.menuIconDangerBg]}>
                            <Ionicons
                                name={item.icon}
                                size={20}
                                color={item.isDanger ? CoachTheme.error : CoachTheme.accent}
                            />
                        </View>
                        <Text style={[styles.menuLabel, item.isDanger && styles.menuLabelDanger]}>
                            {item.label}
                        </Text>
                        <Ionicons name="chevron-forward" size={18} color={CoachTheme.textMuted} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    loaderContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    profileCard: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: CoachTheme.accentDim,
        borderWidth: 2,
        borderColor: CoachTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    name: {
        color: CoachTheme.text,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    email: {
        color: CoachTheme.textSecondary,
        fontSize: 14,
    },
    menuList: {
        marginHorizontal: 20,
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 14,
        borderBottomWidth: 1,
        borderBottomColor: CoachTheme.cardBorder,
    },
    menuIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: CoachTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIconDangerBg: {
        backgroundColor: 'rgba(255, 77, 106, 0.1)',
    },
    menuLabel: {
        flex: 1,
        color: CoachTheme.text,
        fontSize: 15,
        fontWeight: '600',
    },
    menuLabelDanger: {
        color: CoachTheme.error,
    },
});
