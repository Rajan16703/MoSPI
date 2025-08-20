import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SurveyProvider } from '@/contexts/SurveyContext';
import { ParadataProvider } from '@/contexts/ParadataContext';
import { PrepopulationProvider } from '@/contexts/PrepopulationContext';
import { ResponseProvider } from '@/contexts/ResponseContext';
import { AdaptiveEventsProvider } from '@/contexts/AdaptiveEventsContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AuthScreen } from '@/components/AuthScreen';
import { FloatingChatLauncher } from '@/components/Chatbot';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { isDark } = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <FloatingChatLauncher />
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthProvider>
        <SurveyProvider>
          <ParadataProvider>
            <PrepopulationProvider>
            <ResponseProvider>
              <AdaptiveEventsProvider>
                <AppContent />
              </AdaptiveEventsProvider>
            </ResponseProvider>
            </PrepopulationProvider>
          </ParadataProvider>
        </SurveyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}