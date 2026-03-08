import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import TemplateCard from './components/TemplateCard';

const MOCK_TEMPLATES = [
    {
        name: '12 Hafta Hipertrofi Planı',
        duration: '12 Hafta',
        type: 'workout' as const,
        description: 'Kas gelişimi odaklı aşamalı yüklenme programı. Push/Pull/Legs split ile haftada 6 gün antrenman.',
    },
    {
        name: 'Yarışma Hazırlık Diyeti',
        duration: '16 Hafta',
        type: 'nutrition' as const,
        description: 'Yarışma öncesi kademeli kalori düşürme ve karb döngüsü ile sahne hazırlığı.',
    },
    {
        name: 'Yeni Sporcu Başlangıç',
        duration: '8 Hafta',
        type: 'both' as const,
        description: 'Yeni başlayanlar için temel hareketler ve dengeli beslenme planı. Full-body antrenman programı.',
    },
    {
        name: 'Güç Kazanım Programı',
        duration: '6 Hafta',
        type: 'workout' as const,
        description: '5x5 temelli güç artırma programı. Deadlift, Squat ve Bench Press odaklı.',
    },
    {
        name: 'Bulk Beslenme Planı',
        duration: '12 Hafta',
        type: 'nutrition' as const,
        description: 'Kalori fazlası ile kas kütlesi artırma programı. Haftalık kalori artışlı yapı.',
    },
];

export default function TemplatesScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Şablonlar</Text>
                    <Text style={styles.subtitle}>Hazır planları sporcularınıza atayın</Text>
                </View>
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
                    <Ionicons name="add" size={22} color={CoachTheme.background} />
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{MOCK_TEMPLATES.length}</Text>
                    <Text style={styles.statLabel}>Şablon</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        {MOCK_TEMPLATES.filter((t) => t.type === 'workout').length}
                    </Text>
                    <Text style={styles.statLabel}>Antrenman</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        {MOCK_TEMPLATES.filter((t) => t.type === 'nutrition').length}
                    </Text>
                    <Text style={styles.statLabel}>Beslenme</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        {MOCK_TEMPLATES.filter((t) => t.type === 'both').length}
                    </Text>
                    <Text style={styles.statLabel}>Tam Plan</Text>
                </View>
            </View>

            {/* Template List */}
            <ScrollView
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {MOCK_TEMPLATES.map((template, idx) => (
                    <TemplateCard
                        key={idx}
                        name={template.name}
                        duration={template.duration}
                        type={template.type}
                        description={template.description}
                        onAssign={() => { }}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    title: {
        color: CoachTheme.text,
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        marginTop: 4,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: CoachTheme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: CoachTheme.fabShadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        marginHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 20,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        color: CoachTheme.accent,
        fontSize: 20,
        fontWeight: '800',
    },
    statLabel: {
        color: CoachTheme.textMuted,
        fontSize: 11,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 28,
        backgroundColor: CoachTheme.divider,
    },
    listContent: {
        paddingBottom: 100,
    },
});
