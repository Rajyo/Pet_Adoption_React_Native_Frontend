import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { MyContext } from '@/providers/storageProvider';
import idToken from '@/components/getIdToken';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}


export function Icon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3, }} {...props} />;
}


function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <MyContext.Provider value={{ storeToken: idToken().storeToken, storeId: idToken().storeId }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "PAWSFORYOU", gestureEnabled: false, headerTitleStyle: {color: "orange", fontSize: 22, fontWeight: "700"}, headerRight: () => <Link style={{marginRight: 20, fontSize: 16, color: "gray", fontWeight: "600"}} href={'/(auth)/sign-in'}>Skip</Link> }} />
          <Stack.Screen name="(components)" options={{ headerShown: false, title: "Components" }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false, title: "Auth", gestureEnabled: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false, title: "Main", gestureEnabled: false }} />
          <Stack.Screen name="(slides)" options={{ headerShown: false, title: "Slides" }} />
        </Stack>
      </ThemeProvider >
    </MyContext.Provider >
  );
}