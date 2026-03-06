import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { CoachTheme } from '@/constants/theme';

interface ActivityRingProps {
    progress: number; // 0–1
    size?: number;
    strokeWidth?: number;
}

export default function ActivityRing({
    progress,
    size = 120,
    strokeWidth = 10,
}: ActivityRingProps) {
    const animVal = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animVal, {
            toValue: progress,
            duration: 1200,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    // We'll use a View-based ring since react-native doesn't have SVG by default
    // Using a conic gradient approach with stacked views
    const center = size / 2;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Background ring */}
            <View
                style={[
                    styles.ring,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: CoachTheme.ringTrack,
                    },
                ]}
            />
            {/* Progress ring using multiple arc segments */}
            <AnimatedArc
                size={size}
                strokeWidth={strokeWidth}
                progress={animVal}
                color={CoachTheme.ringStroke}
            />
            {/* Center glow dot */}
            <View style={[styles.centerDot, { top: center - 5, left: center - 5 }]} />
        </View>
    );
}

function AnimatedArc({
    size,
    strokeWidth,
    progress,
    color,
}: {
    size: number;
    strokeWidth: number;
    progress: Animated.Value;
    color: string;
}) {
    // We create 4 quadrant arcs for a smooth ring effect
    const half = size / 2;

    // Top-right quadrant (0-25%)
    const topRightRotate = progress.interpolate({
        inputRange: [0, 0.25, 1],
        outputRange: ['0deg', '90deg', '90deg'],
        extrapolate: 'clamp',
    });
    const topRightOpacity = progress.interpolate({
        inputRange: [0, 0.01, 1],
        outputRange: [0, 1, 1],
        extrapolate: 'clamp',
    });

    // Bottom-right quadrant (25-50%)
    const bottomRightRotate = progress.interpolate({
        inputRange: [0, 0.25, 0.5, 1],
        outputRange: ['0deg', '0deg', '90deg', '90deg'],
        extrapolate: 'clamp',
    });
    const bottomRightOpacity = progress.interpolate({
        inputRange: [0, 0.25, 0.26, 1],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
    });

    // Bottom-left quadrant (50-75%)
    const bottomLeftRotate = progress.interpolate({
        inputRange: [0, 0.5, 0.75, 1],
        outputRange: ['0deg', '0deg', '90deg', '90deg'],
        extrapolate: 'clamp',
    });
    const bottomLeftOpacity = progress.interpolate({
        inputRange: [0, 0.5, 0.51, 1],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
    });

    // Top-left quadrant (75-100%)
    const topLeftRotate = progress.interpolate({
        inputRange: [0, 0.75, 1],
        outputRange: ['0deg', '0deg', '90deg'],
        extrapolate: 'clamp',
    });
    const topLeftOpacity = progress.interpolate({
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
        <View style={[StyleSheet.absoluteFill]}>
            {/* Top-right */}
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
            {/* Bottom-right */}
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
            {/* Bottom-left */}
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
            {/* Top-left */}
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
        backgroundColor: CoachTheme.accent,
        shadowColor: CoachTheme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 4,
    },
});
