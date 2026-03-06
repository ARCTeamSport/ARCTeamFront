import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompetitorTheme } from '@/constants/theme';
import CompetitorGreetingHeader from './components/CompetitorGreetingHeader';
import CompetitionCountdownCard from './components/CompetitionCountdownCard';
import CompetitorActivitySection from './components/CompetitorActivitySection';
import TrainingIntensityCard from './components/TrainingIntensityCard';
import PerformanceMetricsCard from './components/PerformanceMetricsCard';
import CompetitorWorkoutCard from './components/CompetitorWorkoutCard';

export default function CompetitorDashboard() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <CompetitorGreetingHeader />
            <CompetitionCountdownCard />
            <CompetitorActivitySection
                stepsProgress={0.78}
                calories={680}
                trainingMin={95}
                heartRate={142}
            />
            <TrainingIntensityCard />
            <PerformanceMetricsCard />
            <CompetitorWorkoutCard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CompetitorTheme.background,
    },
    content: {
        paddingBottom: 20,
    },
});
