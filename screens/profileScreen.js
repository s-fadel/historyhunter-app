import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../storage/AuthContext";
import * as http from "../util/http";
import { EvilIcons } from "@expo/vector-icons";
import { getHunt } from "../util/http";
import { historyHunts } from "./HistoryHunterContent";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [profileImage, setProfileImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const [hunts, setHunts] = useState([]);

  const handleCameraLaunch = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
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

  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await http.getUserById(authCtx.token); // Fetch user from Firebase
        const foundUser = userData.find(
          (u) => u.email.toLowerCase() === authCtx.email.toLowerCase()
        ); // Modify according to your data structure

        if (foundUser) {
          setUsername(foundUser.displayName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchHunt = async (userId) => {
      try {
        const hunt = await getHunt(userId);
        if (hunt) {
          setHunts(hunt);
        }
        return hunt;
      } catch (error) {
        console.error("Error fetching hunt data:", error);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchHunt(authCtx.email);
    });

    fetchHunt(authCtx.email);

    return unsubscribe;
  }, [route.params, authCtx.email, navigation]);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const storedImageUri = await AsyncStorage.getItem("profileImageUri");
        if (storedImageUri && storedImageUri.user === authCtx.email) {
          setProfileImage(storedImageUri.profileImage);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    };

    loadProfileImage();
  }, []);

  useEffect(() => {
    const saveProfileImage = async () => {
      try {
        if (profileImage) {
          await AsyncStorage.setItem(
            "profileImageUri",
            JSON.stringify({
              user: authCtx.email,
              profileImage,
            })
          );
        }
      } catch (error) {
        console.error("Error saving profile image:", error);
      }
    };

    saveProfileImage();
  }, [profileImage]);

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        {!isCameraOpen && (
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handleCameraLaunch}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text style={styles.defaultProfileText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        {isCameraOpen && (
          <Camera
            style={styles.camera}
            ref={(ref) => setCameraRef(ref)}
            type={Camera.Constants.Type.back}
          >
            <View style={styles.cameraContent}>
              <View style={styles.cameraCaptureContainer}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={handleCapture}
                >
                  <EvilIcons name="camera" size={40} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        )}
        <Text style={styles.username}>{username}</Text>
        <TouchableOpacity
          style={styles.createHuntButton}
          onPress={() => navigation.navigate("createHunt")}
        >
          <Text style={styles.createHuntButtonText}>Create Hunt</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>{historyHunts[0].title}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionDescription}>
            {historyHunts[0].description}
          </Text>
        </View>
        {hunts.map((hunt, index) => {
          if (!hunt.activeHunt) {
            return (
              <View style={styles.section} key={index}>
                <TouchableOpacity
                  style={styles.huntCard}
                  onPress={() =>
                    navigation.navigate("overviewMap", { hunt: hunt })
                  }
                >
                  <Text
                    style={[
                      styles.sectionTitleRoute,
                      {
                        color: "#ffa953",
                        textDecorationLine: "underline",
                        fontWeight: "regular",
                      },
                    ]}
                  >
                    {hunt.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          } else {
            return null;
          }
        })}

        <Text style={styles.sectionTitle}>{historyHunts[1].title}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionDescription}>
            {historyHunts[1].description}
          </Text>
        </View>
        {hunts.map((hunt, index) => {
          if (hunt.activeHunt) {
            return (
              <View style={styles.section} key={index}>
                <TouchableOpacity
                  style={styles.huntCard}
                  onPress={() =>
                    navigation.navigate("map", {
                      hunt: hunt,
                      hideDestinationBtn: true,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.sectionTitleRoute,
                      {
                        color: "#ffa953",
                        textDecorationLine: "underline",
                        fontWeight: "regular",
                      },
                    ]}
                  >
                    {hunt.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          } else {
            return null;
          }
        })}
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
    backgroundColor: "#F3EFE7",
  },
  profileInfo: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  camera: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  captureContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: "#456268",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
  },
  captureButtonText: {
    color: "white",
    fontSize: 18,
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultProfileText: {
    fontSize: 16,
    color: "#456268",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#456268",
    marginTop: 15,
  },
  createHuntButton: {
    marginTop: 10,
    backgroundColor: "#456268",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 40,
  },
  createHuntButtonText: {
    color: "white",
    fontSize: 16,
  },
  section: {
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#456268",
    width: 300,
    marginTop: 10,
  },
  sectionDescription: {
    fontSize: 14,
    width: 300,
    color: "#456268",
    marginBottom: 10,
  },
  sectionTitleRoute: {
    fontSize: 14,
    color: "#456268",
    width: 300,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  sectionCenter: {
    alignItems: "center",
    marginVertical: 20,
  },
  centeredSectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#456268",
  },
  line: {
    width: 50,
    height: 2,
    backgroundColor: "#456268",
    marginVertical: 5,
  },
});
