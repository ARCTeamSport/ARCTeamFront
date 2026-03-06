import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AthleteTheme } from '@/constants/theme';

interface AthleteActivityRingProps {
    progress: number; // 0–1
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export default function AthleteActivityRing({
    progress,
    size = 120,
    strokeWidth = 10,
    color = AthleteTheme.ringStroke,
}: AthleteActivityRingProps) {
    const animVal = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animVal, {
            toValue: progress,
            duration: 1200,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const half = size / 2;

    const topRightRotate = animVal.interpolate({
        inputRange: [0, 0.25, 1],
        outputRange: ['0deg', '90deg', '90deg'],
        extrapolate: 'clamp',
    });
    const topRightOpacity = animVal.interpolate({
        inputRange: [0, 0.01, 1],
        outputRange: [0, 1, 1],
        extrapolate: 'clamp',
    });

    const bottomRightRotate = animVal.interpolate({
        inputRange: [0, 0.25, 0.5, 1],
        outputRange: ['0deg', '0deg', '90deg', '90deg'],
        extrapolate: 'clamp',
    });
    const bottomRightOpacity = animVal.interpolate({
        inputRange: [0, 0.25, 0.26, 1],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
    });

    const bottomLeftRotate = animVal.interpolate({
        inputRange: [0, 0.5, 0.75, 1],
        outputRange: ['0deg', '0deg', '90deg', '90deg'],
        extrapolate: 'clamp',
    });
    const bottomLeftOpacity = animVal.interpolate({
        inputRange: [0, 0.5, 0.51, 1],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
    });

    const topLeftRotate = animVal.interpolate({
        inputRange: [0, 0.75, 1],
        outputRange: ['0deg', '0deg', '90deg'],
        extrapolate: 'clamp',
    });
    const topLeftOpacity = animVal.interpolate({
        inputRange: [0, 0.75, 0.76, 1],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
    });

    const quadrantStyle = {
        position: 'absolute' as const,
        width: half,
        height: half,
        overflow: 'hidden' as const,
    };

    const arcStyle = {
        width: size,
        height: size,
        borderRadius: half,
        borderWidth: strokeWidth,
        borderColor: 'transparent',
        position: 'absolute' as const,
    };

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View
                style={[
                    styles.ring,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: AthleteTheme.ringTrack,
                    },
                ]}
            />
            <View style={[StyleSheet.absoluteFill]}>
                <View style={[quadrantStyle, { top: 0, left: half }]}>
                    <Animated.View
                        style={[
                            arcStyle,
                            {
                                top: 0,
                                left: -half,
                                borderTopColor: color,
                                opacity: topRightOpacity,
                                transform: [
                                    { translateX: half },
                                    { translateY: half },
                                    { rotate: topRightRotate },
                                    { translateX: -half },
                                    { translateY: -half },
                                ],
                            },
                        ]}
                    />
                </View>
                <View style={[quadrantStyle, { top: half, left: half }]}>
                    <Animated.View
                        style={[
                            arcStyle,
                            {
                                top: -half,
                                left: -half,
                                borderRightColor: color,
                                opacity: bottomRightOpacity,
                                transform: [
                                    { translateX: half },
                                    { translateY: half },
                                    { rotate: bottomRightRotate },
                                    { translateX: -half },
                                    { translateY: -half },
                                ],
                            },
                        ]}
                    />
                </View>
                <View style={[quadrantStyle, { top: half, left: 0 }]}>
                    <Animated.View
                        style={[
                            arcStyle,
                            {
                                top: -half,
                                left: 0,
                                borderBottomColor: color,
                                opacity: bottomLeftOpacity,
                                transform: [
                                    { translateX: half },
                                    { translateY: half },
                                    { rotate: bottomLeftRotate },
                                    { translateX: -half },
                                    { translateY: -half },
                                ],
                            },
                        ]}
                    />
                </View>
                <View style={[quadrantStyle, { top: 0, left: 0 }]}>
                    <Animated.View
                        style={[
                            arcStyle,
                            {
                                top: 0,
                                left: 0,
                                borderLeftColor: color,
                                opacity: topLeftOpacity,
                                transform: [
                                    { translateX: half },
                                    { translateY: half },
                                    { rotate: topLeftRotate },
                                    { translateX: -half },
                                    { translateY: -half },
                                ],
                            },
                        ]}
                    />
                </View>
            </View>
            <View style={[styles.centerDot, { top: half - 5, left: half - 5, backgroundColor: color, shadowColor: color }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    ring: {
        position: 'absolute',
    },
    centerDot: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 4,
    },
});
