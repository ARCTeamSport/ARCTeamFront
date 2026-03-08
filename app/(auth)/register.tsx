import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthTheme } from '@/constants/theme';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import RolePicker from './components/RolePicker';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import { setToken } from '@/utils/auth'; // Token kaydetmek için
import { jwtDecode } from 'jwt-decode'; // Token okumak için
type Role = 'Coach' | 'Athlete' | 'Competitor';

export default function RegisterScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [role, setRole] = useState<Role>('Athlete');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [inviteCode, setInviteCode] = useState('');
    const [showInviteCode, setShowInviteCode] = useState(false);

    // Animations
    const logoScale = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(logoScale, {
                toValue: 1,
                useNativeDriver: true,
                speed: 12,
                bounciness: 6,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const updateField = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.firstName.trim()) newErrors.firstName = 'Ad gerekli';
        if (!form.lastName.trim()) newErrors.lastName = 'Soyad gerekli';
        if (!form.email.trim()) newErrors.email = 'E-posta gerekli';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Geçerli bir e-posta girin';
        if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Telefon numarası gerekli';
        else if (form.phoneNumber.length < 10) newErrors.phoneNumber = 'Geçerli bir numara girin';
        if (!form.password) newErrors.password = 'Şifre gerekli';
        else if (form.password.length < 6) newErrors.password = 'En az 6 karakter olmalı';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Şifre tekrarı gerekli';
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const roleToInt = (r: Role): number => {
        switch (r) {
            case 'Coach': return 1;
            case 'Athlete': return 2;
            case 'Competitor': return 3;
        }
    };

    const handleRegister = async () => {
        if (!validate()) return;
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    phoneNumber: form.phoneNumber,
                    role: roleToInt(role),
                    inviteCode: inviteCode.trim() || undefined,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrors({ general: errorText || 'Kayıt başarısız' });
                return;
            }

            // 1. Token'ı al (Backend token string'i dönüyorsa text(), obje dönüyorsa json())
            const token = await response.text();

            // 2. Token'ı güvenli depolamaya kaydet
            await setToken(token);

            // 3. Token'ı çöz ve role göre yönlendir
            try {
                const decoded = jwtDecode(token) as any;

                // Login'deki aynı claim kontrol mantığı
                const userRole = decoded.role || decoded.Role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                if (userRole === 'Coach' || userRole === '1' || userRole === 1) {
                    router.replace('/(coach)' as any);
                } else if (userRole === 'Athlete' || userRole === '2' || userRole === 2) {
                    router.replace('/(athlete)' as any);
                } else if (userRole === 'Competitor' || userRole === '3' || userRole === 3) {
                    router.replace('/(competitor)' as any);
                } else {
                    // Eğer rol bulunamazsa varsayılan athlete dashboard
                    router.replace('/(athlete)' as any);
                }
            } catch (decodeError) {
                console.error("Register Token decode error:", decodeError);
                router.replace('/(athlete)' as any);
            }

        } catch (err) {
            setErrors({ general: 'Sunucuya bağlanılamadı' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header / Logo */}
                    <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="fitness-outline" size={36} color={AuthTheme.accent} />
                        </View>
                        <Text style={styles.appName}>ARCTeam</Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
                        <Text style={styles.formTitle}>Hesap Oluştur</Text>
                        <Text style={styles.formSubtitle}>Bilgilerinizi girerek kayıt olun</Text>

                        {errors.general ? (
                            <View style={styles.errorBanner}>
                                <Ionicons name="alert-circle" size={18} color={AuthTheme.error} />
                                <Text style={styles.errorBannerText}>{errors.general}</Text>
                            </View>
                        ) : null}

                        {/* Name Row */}
                        <View style={styles.row}>
                            <View style={styles.halfCol}>
                                <AuthInput
                                    label="Ad"
                                    icon="person-outline"
                                    placeholder="Adınız"
                                    value={form.firstName}
                                    onChangeText={(v) => updateField('firstName', v)}
                                    error={errors.firstName}
                                />
                            </View>
                            <View style={styles.halfCol}>
                                <AuthInput
                                    label="Soyad"
                                    icon="person-outline"
                                    placeholder="Soyadınız"
                                    value={form.lastName}
                                    onChangeText={(v) => updateField('lastName', v)}
                                    error={errors.lastName}
                                />
                            </View>
                        </View>

                        <AuthInput
                            label="E-Posta"
                            icon="mail-outline"
                            placeholder="email@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={form.email}
                            onChangeText={(v) => updateField('email', v)}
                            error={errors.email}
                        />

                        <AuthInput
                            label="Telefon"
                            icon="call-outline"
                            placeholder="05XX XXX XX XX"
                            keyboardType="phone-pad"
                            value={form.phoneNumber}
                            onChangeText={(v) => updateField('phoneNumber', v)}
                            error={errors.phoneNumber}
                        />

                        <AuthInput
                            label="Şifre"
                            icon="lock-closed-outline"
                            placeholder="••••••••"
                            isPassword
                            value={form.password}
                            onChangeText={(v) => updateField('password', v)}
                            error={errors.password}
                        />

                        <AuthInput
                            label="Şifre Tekrar"
                            icon="shield-checkmark-outline"
                            placeholder="••••••••"
                            isPassword
                            value={form.confirmPassword}
                            onChangeText={(v) => updateField('confirmPassword', v)}
                            error={errors.confirmPassword}
                        />

                        <RolePicker selectedRole={role} onSelect={setRole} />

                        {/* Davet Kodu (Opsiyonel) */}
                        <TouchableOpacity
                            style={styles.inviteToggle}
                            onPress={() => setShowInviteCode(!showInviteCode)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="key-outline" size={16} color={AuthTheme.accent} />
                            <Text style={styles.inviteToggleText}>
                                {showInviteCode ? 'Davet kodunu gizle' : 'Davet kodun var mı?'}
                            </Text>
                            <Ionicons
                                name={showInviteCode ? 'chevron-up' : 'chevron-down'}
                                size={16}
                                color={AuthTheme.textSecondary}
                            />
                        </TouchableOpacity>
                        {showInviteCode && (
                            <AuthInput
                                label="Davet Kodu"
                                icon="key-outline"
                                placeholder="Örn: 5XKLT3"
                                autoCapitalize="characters"
                                value={inviteCode}
                                onChangeText={setInviteCode}
                            />
                        )}

                        <AuthButton title="Kayıt Ol" onPress={handleRegister} loading={loading} />
                    </Animated.View>

                    {/* Footer Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
                            <Text style={styles.footerLink}>Giriş Yap</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: AuthTheme.background,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: AuthTheme.accentDim,
        borderWidth: 2,
        borderColor: AuthTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: AuthTheme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    appName: {
        color: AuthTheme.text,
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 1,
    },
    formCard: {
        backgroundColor: AuthTheme.cardBg,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: AuthTheme.cardBorder,
    },
    formTitle: {
        color: AuthTheme.text,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    formSubtitle: {
        color: AuthTheme.textSecondary,
        fontSize: 14,
        marginBottom: 24,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 77, 106, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 106, 0.3)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    inviteToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        marginBottom: 4,
    },
    inviteToggleText: {
        color: AuthTheme.accent,
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    errorBannerText: {
        color: AuthTheme.error,
        fontSize: 13,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfCol: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
    },
    footerText: {
        color: AuthTheme.textSecondary,
        fontSize: 14,
    },
    footerLink: {
        color: AuthTheme.accent,
        fontSize: 14,
        fontWeight: '700',
    },
});
