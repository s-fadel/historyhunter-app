import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { historyHunts } from './HistoryHunterContent'; // Importera innehållet

export function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);

  const handleImagePicker = () => {
    const options = {
      title: 'Select Profile Picture',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.7,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // User cancelled image selection
      } else if (response.error) {
        // Image selection error
      } else {
        // Set the selected image as the profile image
        setProfileImage(response.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <TouchableOpacity onPress={handleImagePicker}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Text style={styles.defaultProfileText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.username}>John Doe</Text>
        <TouchableOpacity style={styles.createHuntButton}>
          <Text style={styles.createHuntButtonText}>Create Hunt</Text>
        </TouchableOpacity>
       
        {historyHunts.map((hunt, index) => (
  <View style={styles.section} key={index}>
    <Text style={styles.sectionTitle}>{hunt.title}</Text>
    <View style={styles.descriptionContainer}>
      <Image source={hunt.image} style={styles.descriptionImage} />
      <Text style={styles.sectionDescription}>{hunt.description}</Text>
    </View>
  </View>
))}


        
        <View style={styles.sectionCenter}>
          <Text style={styles.centeredSectionTitle}>Medals</Text>
          <View style={styles.line} />
        </View>
      </View>
      {/* ... Other content ... */}
    </View>
  );
        }

        const styles = StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: '#F3EFE7',
          },
          profileInfo: {
            flex: 1,
            alignItems: 'center',
            marginTop: 20,
          },
          defaultProfileImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          },
          defaultProfileText: {
            fontSize: 16,
            color: '#456268',
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
            marginTop: 15,
          },
          createHuntButton: {
            marginTop: 10,
            backgroundColor: '#456268',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginBottom: 40,
          },
          createHuntButtonText: {
            color: 'white',
            fontSize: 16,
          },
          section: {
            marginVertical: 15,
            paddingHorizontal: 20,
          },
          sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#456268',
            width: 300,
          },
          sectionDescription: {
            fontSize: 14,
            width: 300,
            color: '#456268',
          },
          descriptionContainer: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          descriptionImage: {
            width: 30,
            height: 30,
            borderRadius: 50,
            marginRight: 10,
          },
          sectionCenter: {
            alignItems: 'center',
            marginVertical: 20,
          },
          centeredSectionTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#456268',
          },
          line: {
            width: 50,
            height: 2,
            backgroundColor: '#456268',
            marginVertical: 5,
          },
          // ... Other styles ...
        });
        
