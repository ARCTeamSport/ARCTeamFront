import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CoachTheme } from '@/constants/theme';
import AnimatedTabBar from './components/AnimatedTabBar';

export default function CoachLayout() {
    return (
        <>
            <Tabs
                tabBar={(props) => <AnimatedTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                    sceneStyle: { backgroundColor: CoachTheme.background },
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="team" />
                <Tabs.Screen name="library" />
                <Tabs.Screen name="templates" />
                <Tabs.Screen name="messages" />
                <Tabs.Screen name="profile" />
            </Tabs>
            <StatusBar style="light" />
        </>
    );
}
