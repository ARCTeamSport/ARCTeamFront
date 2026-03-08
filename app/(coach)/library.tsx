import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import ExerciseListItem from './components/ExerciseListItem';
import NutritionListItem from './components/NutritionListItem';

type Tab = 'exercises' | 'nutrition';

const EXERCISE_CATEGORIES = [
    {
        title: 'Göğüs',
        items: [
            { name: 'Bench Press', hasVideo: true },
            { name: 'İncline Dumbbell Press', hasVideo: true },
            { name: 'Cable Fly', hasVideo: false },
            { name: 'Push-Up', hasVideo: true },
        ],
    },
    {
        title: 'Sırt',
        items: [
            { name: 'Deadlift', hasVideo: true },
            { name: 'Barbell Row', hasVideo: true },
            { name: 'Lat Pulldown', hasVideo: false },
            { name: 'T-Bar Row', hasVideo: true },
        ],
    },
    {
        title: 'Bacak',
        items: [
            { name: 'Squat', hasVideo: true },
            { name: 'Leg Press', hasVideo: false },
            { name: 'Romanian Deadlift', hasVideo: true },
            { name: 'Leg Curl', hasVideo: false },
        ],
    },
    {
        title: 'Omuz',
        items: [
            { name: 'Overhead Press', hasVideo: true },
            { name: 'Lateral Raise', hasVideo: false },
            { name: 'Face Pull', hasVideo: true },
        ],
    },
    {
        title: 'Kol',
        items: [
            { name: 'Barbell Curl', hasVideo: true },
            { name: 'Tricep Pushdown', hasVideo: false },
            { name: 'Hammer Curl', hasVideo: true },
        ],
    },
];

const NUTRITION_ITEMS = [
    { name: 'Tavuklu Pilav', calories: 520, protein: 42, carbs: 55, fat: 12 },
    { name: 'Yulaf Ezmesi & Muz', calories: 380, protein: 14, carbs: 62, fat: 8 },
    { name: 'Ton Balıklı Salata', calories: 320, protein: 35, carbs: 15, fat: 14 },
    { name: 'Protein Shake', calories: 280, protein: 40, carbs: 18, fat: 6 },
    { name: 'Yumurta & Avokado Tost', calories: 450, protein: 22, carbs: 35, fat: 25 },
    { name: 'Kıymalı Makarna', calories: 580, protein: 32, carbs: 68, fat: 16 },
    { name: 'Somon & Sebze', calories: 420, protein: 38, carbs: 22, fat: 18 },
    { name: 'BCAA Supplement', calories: 15, protein: 0, carbs: 3, fat: 0 },
    { name: 'Kreatin (5g)', calories: 0, protein: 0, carbs: 0, fat: 0 },
];

export default function LibraryScreen() {
    const insets = useSafeAreaInsets();
    const [tab, setTab] = useState<Tab>('exercises');
    const [search, setSearch] = useState('');

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Kütüphane</Text>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'exercises' && styles.tabActive]}
                    onPress={() => setTab('exercises')}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="barbell"
                        size={16}
                        color={tab === 'exercises' ? CoachTheme.accent : CoachTheme.textMuted}
                    />
                    <Text style={[styles.tabText, tab === 'exercises' && styles.tabTextActive]}>
                        Egzersizler
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'nutrition' && styles.tabActive]}
                    onPress={() => setTab('nutrition')}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="nutrition"
                        size={16}
                        color={tab === 'nutrition' ? CoachTheme.statCalorie : CoachTheme.textMuted}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            tab === 'nutrition' && [styles.tabTextActive, { color: CoachTheme.statCalorie }],
                        ]}
                    >
                        Beslenme
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={CoachTheme.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={tab === 'exercises' ? 'Egzersiz ara...' : 'Yemek ara...'}
                    placeholderTextColor={CoachTheme.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {tab === 'exercises' ? (
                    EXERCISE_CATEGORIES.map((cat) => {
                        const filtered = cat.items.filter((i) =>
                            i.name.toLowerCase().includes(search.toLowerCase())
                        );
                        if (filtered.length === 0) return null;
                        return (
                            <View key={cat.title}>
                                <Text style={styles.sectionTitle}>{cat.title}</Text>
                                {filtered.map((item) => (
                                    <ExerciseListItem
                                        key={item.name}
                                        name={item.name}
                                        category={cat.title}
                                        hasVideo={item.hasVideo}
                                    />
                                ))}
                            </View>
                        );
                    })
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Hazır Öğünler</Text>
                        {NUTRITION_ITEMS.filter((i) =>
                            i.name.toLowerCase().includes(search.toLowerCase())
                        ).map((item) => (
                            <NutritionListItem key={item.name} {...item} />
                        ))}
                    </>
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
                <Ionicons name="add" size={28} color={CoachTheme.background} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: CoachTheme.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 4,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: CoachTheme.cardBg,
    },
    tabText: {
        color: CoachTheme.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
    tabTextActive: {
        color: CoachTheme.accent,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        marginHorizontal: 20,
        paddingHorizontal: 14,
        gap: 10,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        color: CoachTheme.text,
        fontSize: 14,
        paddingVertical: 11,
    },
    listContent: {
        paddingBottom: 100,
    },
    sectionTitle: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 10,
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: CoachTheme.fabBg,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: CoachTheme.fabShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
});
