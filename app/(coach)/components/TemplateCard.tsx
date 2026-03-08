import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';

interface Props {
    name: string;
    duration: string;
    type: 'workout' | 'nutrition' | 'both';
    description: string;
    onAssign: () => void;
}

const typeConfig = {
    workout: { label: 'Antrenman', color: CoachTheme.accent, icon: 'barbell' as const },
    nutrition: { label: 'Beslenme', color: CoachTheme.statCalorie, icon: 'nutrition' as const },
    both: { label: 'Tam Program', color: CoachTheme.neonBlue, icon: 'layers' as const },
};

export default function TemplateCard({
    name,
    duration,
    type,
    description,
    onAssign,
}: Props) {
    const config = typeConfig[type];
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const borderOpacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View style={[styles.card, { borderColor: config.color, borderWidth: 1 }]}>
            {/* Accent strip */}
            <View style={[styles.strip, { backgroundColor: config.color }]} />

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={[styles.typeBadge, { backgroundColor: `${config.color}20` }]}>
                        <Ionicons name={config.icon} size={14} color={config.color} />
                        <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>
                    </View>
                    <Text style={styles.duration}>{duration}</Text>
                </View>

                <Text style={styles.name}>{name}</Text>
                <Text style={styles.description}>{description}</Text>

                <TouchableOpacity style={styles.assignBtn} onPress={onAssign} activeOpacity={0.7}>
                    <Ionicons name="person-add" size={16} color={CoachTheme.background} />
                    <Text style={styles.assignText}>Sporcuya Ata</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 18,
        marginHorizontal: 20,
        marginBottom: 14,
        overflow: 'hidden',
    },
    strip: {
        height: 3,
        width: '100%',
    },
    content: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    typeLabel: {
        fontSize: 11,
        fontWeight: '700',
    },
    duration: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    name: {
        color: CoachTheme.text,
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 6,
    },
    description: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 14,
    },
    assignBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: CoachTheme.accent,
        paddingVertical: 12,
        borderRadius: 12,
    },
    assignText: {
        color: CoachTheme.background,
        fontSize: 14,
        fontWeight: '700',
    },
});
