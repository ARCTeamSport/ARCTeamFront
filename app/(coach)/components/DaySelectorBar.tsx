import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CoachTheme } from '@/constants/theme';

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

interface Props {
    selectedDay: number;
    onDayChange: (index: number) => void;
}

export default function DaySelectorBar({ selectedDay, onDayChange }: Props) {
    const scaleAnims = useRef(DAYS.map(() => new Animated.Value(1))).current;

    useEffect(() => {
        scaleAnims.forEach((anim, i) => {
            Animated.spring(anim, {
                toValue: i === selectedDay ? 1.08 : 1,
                useNativeDriver: true,
                speed: 20,
                bounciness: 8,
            }).start();
        });
    }, [selectedDay]);

    return (
        <View style={styles.container}>
            {DAYS.map((day, index) => {
                const isActive = index === selectedDay;
                return (
                    <Animated.View
                        key={day}
                        style={{ transform: [{ scale: scaleAnims[index] }] }}
                    >
                        <TouchableOpacity
                            style={[styles.dayBtn, isActive && styles.dayBtnActive]}
                            onPress={() => onDayChange(index)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                                {day}
                            </Text>
                            {isActive && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: CoachTheme.surface,
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
    },
    dayBtn: {
        width: 40,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    dayBtnActive: {
        backgroundColor: CoachTheme.accentDim,
        borderWidth: 1,
        borderColor: CoachTheme.accent,
    },
    dayText: {
        color: CoachTheme.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
    dayTextActive: {
        color: CoachTheme.accent,
        fontWeight: '700',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: CoachTheme.accent,
        marginTop: 4,
    },
});
