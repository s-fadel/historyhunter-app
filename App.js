import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './screens/loginScreen';
import { SignInScreen } from './screens/signInScreen';
import { ProfileScreen } from './screens/profileScreen';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignInScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

