import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as http from "../util/http";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../storage/AuthContext";

export function LoginScreen({ route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const authCtx = useContext(AuthContext);

  const authentitionHandler = async (email, password) => {
    try {
      const resp = await http.signinUser(email, password); // resp är token
      authCtx.authenticate(resp, email);
      return resp;
    } catch (error) {
      throw error; // Kasta om felet för att hantera det senare
    }
  };
  const handleLogin = async () => {
    const { name } = route.params || {};
    const storeUserData = async (name, token) => {
      try {
        await AsyncStorage.setItem("username", name);
        await AsyncStorage.setItem("token", token);
      } catch (error) {
        console.error("Error storing user data:", error);
      }
    };

    const isAuthenticated = await authentitionHandler(username, password);

    if (isAuthenticated) {
      const token = isAuthenticated.token; 
      navigation.navigate("profile", { name: username });
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>History Hunter</Text>
        <Text style={styles.loginTitle}>Welcome back!</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <View style={styles.linkContainer}>
            <Text style={styles.signInLink}>Need to create an account?</Text>
            <Text style={styles.signUpLink}>Sign Up Here</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3EFE7",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#456268",
    marginBottom: 20,
    textAlign: "center",
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: 250,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A39480",
    backgroundColor: "white",
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  loginButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#456268",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  linkContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  signInLink: {
    color: "black",
    fontSize: 18,
    marginTop: 1,
    marginBottom: 5,
    textAlign: "center",
  },
  signUpLink: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginScreen;
