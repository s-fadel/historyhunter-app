import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';

export function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);

  const handleImagePicker = () => {
    const options = {
      title: 'Take Profile Picture',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      allowsEditing: true,
      quality: 0.7,
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        // User cancelled camera capture
      } else if (response.error) {
        // Camera capture error
      } else {
        // Set the captured image as the profile image
        setProfileImage(response.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <TouchableOpacity onPress={handleImagePicker}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/historyhunt.jpg')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>John Doe</Text>
      </View>
      {/* ... Other content ... */}
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
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#456268',
  },
  // ... Other styles ...
});

export default ProfileScreen;


