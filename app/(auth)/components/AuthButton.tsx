import React, { useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    ActivityIndicator,
    View,
} from 'react-native';
import { AuthTheme } from '@/constants/theme';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'outline';
}

export default function AuthButton({
    title,
    onPress,
    loading = false,
    variant = 'primary',
}: AuthButtonProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const isPrimary = variant === 'primary';

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[
                    styles.button,
                    isPrimary ? styles.primaryButton : styles.outlineButton,
                    loading && styles.buttonDisabled,
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={isPrimary ? AuthTheme.background : AuthTheme.accent} />
                ) : (
                    <View style={styles.contentRow}>
                        <Text
                            style={[
                                styles.buttonText,
                                isPrimary ? styles.primaryText : styles.outlineText,
                            ]}
                        >
                            {title}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
    },
    primaryButton: {
        backgroundColor: AuthTheme.accent,
        shadowColor: AuthTheme.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: AuthTheme.cardBorder,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    primaryText: {
        color: AuthTheme.background,
    },
    outlineText: {
        color: AuthTheme.accent,
    },
});
