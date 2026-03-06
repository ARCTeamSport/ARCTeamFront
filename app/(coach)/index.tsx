import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoachTheme } from '@/constants/theme';
import GreetingHeader from './components/GreetingHeader';
import RecommendationCard from './components/RecommendationCard';
import ActivitySection from './components/ActivitySection';
import MealPlanCard from './components/MealPlanCard';

export default function CoachDashboard() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <GreetingHeader />
            <RecommendationCard />
            <ActivitySection
                stepsProgress={0.6}
                calories={480}
                waterGlasses={12}
                steps={6000}
            />
            <MealPlanCard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    content: {
        paddingBottom: 20,
    },
});
