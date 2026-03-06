import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AthleteTheme } from '@/constants/theme';
import AthleteGreetingHeader from './components/AthleteGreetingHeader';
import CalorieSummaryCard from './components/CalorieSummaryCard';
import AthleteActivitySection from './components/AthleteActivitySection';
import DailyNutritionCard from './components/DailyNutritionCard';
import WorkoutPlanCard from './components/WorkoutPlanCard';

export default function AthleteDashboard() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <AthleteGreetingHeader />
            <CalorieSummaryCard />
            <AthleteActivitySection
                stepsProgress={0.65}
                calories={420}
                waterGlasses={8}
                steps={6500}
            />
            <WorkoutPlanCard />
            <DailyNutritionCard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: AthleteTheme.background,
    },
    content: {
        paddingBottom: 20,
    },
});
