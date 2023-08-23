import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { historyHunts } from './HistoryHunterContent'; // Importera innehållet

export function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCameraLaunch = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === 'granted') {
      setHasPermission(true);
      setIsCameraOpen(true);
    } else {
      setHasPermission(false);
      setIsCameraOpen(false);
    }
  };

  const handleCapture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setProfileImage(photo.uri);
      setIsCameraOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        {!isCameraOpen && (
          <TouchableOpacity onPress={handleCameraLaunch}>
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text style={styles.defaultProfileText}>Add Photo</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}

        {isCameraOpen && (
          <Camera
            style={styles.camera}
            ref={(ref) => setCameraRef(ref)}
            type={Camera.Constants.Type.back}
          >
            <View style={styles.captureContainer}>
             
            </View>
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
           <Text style={styles.captureButtonText}>Capture</Text>
         </TouchableOpacity>
          </Camera>
           
        )}

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
          profileImageContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            overflow: 'hidden',
          },
          camera: {
            width: 300,
            height: 300,
          },
          captureContainer: {
            flex: 1,
            alignItems: 'center',
            marginBottom: 20,

          },
          captureButton: {
            backgroundColor: '#456268',
            padding: 20,
            alignItems: 'center',

          },
          captureButtonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,

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
        });
        
