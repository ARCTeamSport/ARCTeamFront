import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthTheme } from '@/constants/theme';

interface AuthInputProps extends TextInputProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    error?: string;
    isPassword?: boolean;
}

export default function AuthInput({
    label,
    icon,
    error,
    isPassword = false,
    ...props
}: AuthInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? AuthTheme.error : AuthTheme.cardBorder, error ? AuthTheme.error : AuthTheme.accent],
    });

    return (
        <View style={styles.container}>
            <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
            <Animated.View
                style={[
                    styles.inputWrapper,
                    { borderColor },
                    isFocused && styles.inputWrapperFocused,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={isFocused ? AuthTheme.accent : AuthTheme.textSecondary}
                    style={styles.icon}
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor={AuthTheme.textSecondary}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={isPassword && !showPassword}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={AuthTheme.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </Animated.View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 18,
    },
    label: {
        color: AuthTheme.textSecondary,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    labelError: {
        color: AuthTheme.error,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AuthTheme.inputBg,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: AuthTheme.cardBorder,
        paddingHorizontal: 16,
        height: 54,
    },
    inputWrapperFocused: {
        backgroundColor: AuthTheme.cardBg,
        shadowColor: AuthTheme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: AuthTheme.text,
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        color: AuthTheme.error,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
});
