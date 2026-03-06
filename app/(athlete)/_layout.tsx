import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AthleteTheme } from '@/constants/theme';
import AthleteTabBar from './components/AthleteTabBar';

export default function AthleteLayout() {
    return (
        <>
            <Tabs
                tabBar={(props) => <AthleteTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                    sceneStyle: { backgroundColor: AthleteTheme.background },
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="program" />
                <Tabs.Screen name="messages" />
                <Tabs.Screen name="profile" />
            </Tabs>
            <StatusBar style="light" />
        </>
    );
}
