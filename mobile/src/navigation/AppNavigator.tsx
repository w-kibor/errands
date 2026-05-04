import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { useAppContext } from '../contexts/AppContext';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function icon(label: string) {
  return ({ color }: { color: string }) => <Text style={{ color, fontSize: 16 }}>{label}</Text>;
}

function MainTabs() {
  const { setActiveTab } = useAppContext();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0B2545',
        tabBarInactiveTintColor: '#7A7A7A',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 62,
          paddingTop: 8,
          backgroundColor: '#FFFFFF'
        }
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        listeners={{ focus: () => setActiveTab('home') }}
        options={{ tabBarIcon: icon('Home') }}
      />
      <Tabs.Screen
        name="Orders"
        component={OrdersScreen}
        listeners={{ focus: () => setActiveTab('orders') }}
        options={{ tabBarIcon: icon('Orders') }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={{ focus: () => setActiveTab('profile') }}
        options={{ tabBarIcon: icon('Profile') }}
      />
    </Tabs.Navigator>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F4F8FB'
  }
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
