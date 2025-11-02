import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './theme/theme';

// Screens
import HomeScreen from './screens/HomeScreen';
import DocumentsScreen from './screens/DocumentsScreen';
import WalletScreen from './screens/WalletScreen';
import AIScreen from './screens/AIScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

// Services
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'I am',
        }}
      />
      <Tab.Screen 
        name="Documents" 
        component={DocumentsScreen}
        options={{
          tabBarLabel: 'Documents',
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{
          tabBarLabel: 'Wallet',
        }}
      />
      <Tab.Screen 
        name="AI" 
        component={AIScreen}
        options={{
          tabBarLabel: 'AI',
        }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceScreen}
        options={{
          tabBarLabel: 'Castle',
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}

