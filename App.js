import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "./screens/loginScreen";
import { SignUpScreen } from "./screens/signUpScreen";
import { ProfileScreen } from "./screens/profileScreen";
import { CreateHuntScreen } from "./screens/createHunt";
import { InviteFriendsScreen } from "./screens/inviteFriendsScreen";
import { MapHuntScreen } from "./screens/mapHunt"; // Importera MapHunt-skärmen
import AuthContextProvider from "./storage/AuthContext";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <AuthContextProvider>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="createHunt" component={CreateHuntScreen} />
          <Stack.Screen name="inviteFriends" component={InviteFriendsScreen} />
          <Stack.Screen name="map" component={MapHuntScreen} /> 
        </Stack.Navigator>
      </AuthContextProvider>
    </NavigationContainer>
  );
}
