import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as http from '../util/http';

export function CreateHuntScreen() {
  const navigation = useNavigation();
  const [huntDuration, setHuntDuration] = useState('');
  const [huntName, setHuntName] = useState('');
  const [showError, setShowError] = useState(false);


  const handleContinue = async () => {
    if (huntDuration.trim() === '' || huntName.trim() === '') {
      setShowError(true);
    } else {

      // Navigate to the next screen
      navigation.navigate("inviteFriends");
    }
    const hunt = {
      duration: huntDuration,
      name: huntName,

    };
    await http.storeHunt(hunt);

  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Customize</Text>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>How long should it be?</Text>
        <TextInput
          style={styles.answerField}
          placeholder="3 hours? 2 days? You pick"
          value={huntDuration}
          onChangeText={text => setHuntDuration(text)}
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>What do you want to call your hunt?</Text>
        <TextInput
          style={styles.answerField}
          placeholder="Enter your Name"
          value={huntName}
          onChangeText={text => setHuntName(text)}
        />
      </View>

      {showError && (
        <Text style={styles.errorText}>Please fill in both fields before continuing.</Text>
      )}

      <View style={styles.centeredContainer}>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('map')}>
  <Text style={styles.loginButtonText}>Continue</Text>
</TouchableOpacity>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    backgroundColor: '#F5F7FA',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 20,

  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
    textAlign: 'center',
  },
  answerField: {
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#456268',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',

  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default CreateHuntScreen;


