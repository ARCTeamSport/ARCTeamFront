import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CompetitorTheme } from '@/constants/theme';
import CompetitorTabBar from './components/CompetitorTabBar';

export default function CompetitorLayout() {
    return (
        <>
            <Tabs
                tabBar={(props) => <CompetitorTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                    sceneStyle: { backgroundColor: CompetitorTheme.background },
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="training" />
                <Tabs.Screen name="messages" />
                <Tabs.Screen name="profile" />
            </Tabs>
            <StatusBar style="light" />
        </>
    );
}
