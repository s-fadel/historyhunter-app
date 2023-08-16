import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as http from '../util/http';


export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const authentitionHandler = async (email, password) => {
    const data = await http.signinUser(email, password);
    return data;
  };

  const handleLogin = async () => {
    const isAuthenticated = await authentitionHandler(username, password);
    if (isAuthenticated) {
      navigation.navigate('profile');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
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
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3EFE7',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#456268',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: 250,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A39480',
    backgroundColor: 'white',
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  loginButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#456268',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  linkContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  signInLink: {
    color: 'black',
    fontSize: 18,
    marginTop: 1,
    marginBottom: 5,
    textAlign: 'center',
  },
  signUpLink: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
