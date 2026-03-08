import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Eklendi
import { CoachTheme } from '@/constants/theme';

interface FABSpeedDialProps {
    onAddAthlete: () => void;
    onAddCompetitor: () => void;
}

export default function FABSpeedDial({ onAddAthlete, onAddCompetitor }: FABSpeedDialProps) {
    const insets = useSafeAreaInsets(); // Cihazın alt menü boşluğunu alıyoruz
    const [open, setOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = open ? 0 : 1;
        Animated.parallel([
            Animated.spring(animation, {
                toValue,
                useNativeDriver: true,
                speed: 14,
                bounciness: 5,
            }),
            Animated.timing(rotateAnim, {
                toValue,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
        setOpen(!open);
    };

    const handleAction = (action: () => void) => {
        toggleMenu();
        action();
    };

    // Animasyon değerleri aynı kalıyor...
    const athleteTranslateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -130],
    });

    const competitorTranslateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -70],
    });

    const itemScale = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.3, 1],
    });

    const itemOpacity = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    const backdropOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <>
            {open && (
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={toggleMenu}
                    />
                </Animated.View>
            )}

            {/* Alt boşluğu dinamik olarak ayarlıyoruz */}
            <View style={[styles.container, { bottom: insets.bottom + 16 }]} pointerEvents="box-none">

                {/* Sporcu Ekleme Butonu */}
                <Animated.View
                    style={[
                        styles.menuItem,
                        {
                            transform: [
                                { translateY: athleteTranslateY },
                                { scale: itemScale },
                            ],
                            opacity: itemOpacity,
                        },
                    ]}
                    pointerEvents={open ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        style={styles.labelContainer}
                        onPress={() => handleAction(onAddAthlete)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.labelText}>Sporcu Ekle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.smallFab, { backgroundColor: CoachTheme.badgeAthlete }]}
                        onPress={() => handleAction(onAddAthlete)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="person-add-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Yarışmacı Ekleme Butonu */}
                <Animated.View
                    style={[
                        styles.menuItem,
                        {
                            transform: [
                                { translateY: competitorTranslateY },
                                { scale: itemScale },
                            ],
                            opacity: itemOpacity,
                        },
                    ]}
                    pointerEvents={open ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        style={styles.labelContainer}
                        onPress={() => handleAction(onAddCompetitor)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.labelText}>Yarışmacı Ekle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.smallFab, { backgroundColor: CoachTheme.badgeCompetitor }]}
                        onPress={() => handleAction(onAddCompetitor)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trophy-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Ana FAB */}
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={toggleMenu}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={28} color="#0A0E10" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 14, 16, 0.8)', // Biraz daha koyu yaparak odağı artırdık
        zIndex: 998,
    },
    container: {
        position: 'absolute',
        // SOL ve SAĞI 0 yaparak tüm genişliği kaplıyoruz
        left: 0,
        right: 0,
        // İçindeki her şeyi (ana buton ve menü elemanları) ortalıyoruz
        alignItems: 'center',
        zIndex: 999,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: CoachTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        // Merkeze aldığımızda gölgeyi her yöne eşit dağıtmak daha şık durur
        shadowColor: CoachTheme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        // right: 0 değerini SİLİYORUZ (merkezde durması için)
        gap: 10,
        // Etiket ve buton grubunu kendi içinde dengelemek için:
        justifyContent: 'center',
    },
    smallFab: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: 6 değerini SİLEBİLİRSİN veya azaltabilirsin
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    labelContainer: {
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        // Etiketlerin yanındaki gölgeyi kaldırdık veya azalttık daha temiz görünüm için
    },
    labelText: {
        color: CoachTheme.text,
        fontSize: 13,
        fontWeight: '700', // Biraz daha kalınlaştırdık
    },
});