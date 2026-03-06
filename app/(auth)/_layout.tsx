import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthTheme } from '@/constants/theme';

export default function AuthLayout() {
    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: AuthTheme.background },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}
