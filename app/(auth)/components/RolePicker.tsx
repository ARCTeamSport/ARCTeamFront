import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthTheme } from '@/constants/theme';

type Role = 'Coach' | 'Athlete' | 'Competitor';

interface RolePickerProps {
    selectedRole: Role;
    onSelect: (role: Role) => void;
}

const roles: { key: Role; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'Coach', label: 'Koç', icon: 'people-outline' },
    { key: 'Athlete', label: 'Sporcu', icon: 'fitness-outline' },
    { key: 'Competitor', label: 'Yarışmacı', icon: 'trophy-outline' },
];

export default function RolePicker({ selectedRole, onSelect }: RolePickerProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>ROL SEÇİNİZ</Text>
            <View style={styles.chipRow}>
                {roles.map((role) => {
                    const isActive = selectedRole === role.key;
                    return (
                        <TouchableOpacity
                            key={role.key}
                            style={[styles.chip, isActive && styles.chipActive]}
                            onPress={() => onSelect(role.key)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={role.icon}
                                size={18}
                                color={isActive ? AuthTheme.accent : AuthTheme.textSecondary}
                            />
                            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                {role.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
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
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    chipRow: {
        flexDirection: 'row',
        gap: 10,
    },
    chip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: AuthTheme.inputBg,
        borderWidth: 1.5,
        borderColor: AuthTheme.cardBorder,
    },
    chipActive: {
        backgroundColor: AuthTheme.accentDim,
        borderColor: AuthTheme.accent,
    },
    chipText: {
        color: AuthTheme.textSecondary,
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: AuthTheme.accent,
    },
});
