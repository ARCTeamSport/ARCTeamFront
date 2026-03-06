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
    Dimensions,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthTheme } from '@/constants/theme';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import { setToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '@/constants/apiConfig';
const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

    // Logo animation
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

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!email.trim()) newErrors.email = 'E-posta adresi gerekli';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Geçerli bir e-posta girin';
        if (!password) newErrors.password = 'Şifre gerekli';
        else if (password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrors({ general: errorText || 'Giriş başarısız' });
                return;
            }

            const token = await response.text();
            await setToken(token);

            try {
                const decoded = jwtDecode(token) as any;

                // ASP.NET Core bazen claims'leri otomatik küçültür veya schema URL'si olarak verir.
                // Token içinde direkt "role" adıyla (veya "Role") bulunuyorsa onu alıyoruz.
                const role = decoded.role || decoded.Role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                if (role === 'Coach' || role === '1' || role === 1) {
                    router.replace('/(coach)' as any);
                } else if (role === 'Athlete' || role === '2' || role === 2) {
                    router.replace('/(athlete)' as any);
                } else if (role === 'Competitor' || role === '3' || role === 3) {
                    router.replace('/(competitor)' as any);
                }
            } catch (decodeError) {
                console.error("Token decode error:", decodeError);
                // Fallback route
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
                            <Ionicons name="fitness-outline" size={40} color={AuthTheme.accent} />
                        </View>
                        <Text style={styles.appName}>ARCTeam</Text>
                        <Text style={styles.appTagline}>Antrenman & Performans Takibi</Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
                        <Text style={styles.formTitle}>Giriş Yap</Text>
                        <Text style={styles.formSubtitle}>Hesabınıza giriş yapın</Text>

                        {errors.general ? (
                            <View style={styles.errorBanner}>
                                <Ionicons name="alert-circle" size={18} color={AuthTheme.error} />
                                <Text style={styles.errorBannerText}>{errors.general}</Text>
                            </View>
                        ) : null}

                        <AuthInput
                            label="E-Posta"
                            icon="mail-outline"
                            placeholder="email@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            error={errors.email}
                        />

                        <AuthInput
                            label="Şifre"
                            icon="lock-closed-outline"
                            placeholder="••••••••"
                            isPassword
                            value={password}
                            onChangeText={setPassword}
                            error={errors.password}
                        />

                        <TouchableOpacity style={styles.forgotRow}>
                            <Text style={styles.forgotText}>Şifreni mi unuttun?</Text>
                        </TouchableOpacity>

                        <AuthButton title="Giriş Yap" onPress={handleLogin} loading={loading} />
                    </Animated.View>

                    {/* Footer Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Hesabın yok mu? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
                            <Text style={styles.footerLink}>Kayıt Ol</Text>
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
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: AuthTheme.accentDim,
        borderWidth: 2,
        borderColor: AuthTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: AuthTheme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    appName: {
        color: AuthTheme.text,
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: 1,
    },
    appTagline: {
        color: AuthTheme.textSecondary,
        fontSize: 14,
        marginTop: 4,
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
    errorBannerText: {
        color: AuthTheme.error,
        fontSize: 13,
        flex: 1,
    },
    forgotRow: {
        alignItems: 'flex-end',
        marginBottom: 20,
        marginTop: -8,
    },
    forgotText: {
        color: AuthTheme.accent,
        fontSize: 13,
        fontWeight: '600',
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
