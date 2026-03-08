import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoachTheme } from '@/constants/theme';
import GreetingHeader from './components/GreetingHeader';
import DailyComplianceCard from './components/DailyComplianceCard';
import ActivityFeedList from './components/ActivityFeedList';
import PendingRequestsCard from './components/PendingRequestsCard';
import RecommendationCard from './components/RecommendationCard';

export default function CoachDashboard() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <GreetingHeader />
            <DailyComplianceCard completed={8} total={12} />
            <RecommendationCard />
            <PendingRequestsCard />
            <ActivityFeedList />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CoachTheme.background,
    },
    content: {
        paddingBottom: 100,
    },
});
