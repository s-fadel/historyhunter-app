import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { storeHunt, updateHuntBy } from "../util/http";
import * as Location from "expo-location";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../storage/AuthContext";
import { Camera } from "expo-camera";
import { EvilIcons } from "@expo/vector-icons";

export function MapHuntScreen() {
  const [huntData, setHuntData] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [addingDestination, setAddingDestination] = useState(false);
  const [destinationMarkers, setDestinationMarkers] = useState([]);
  const { hideDestinationBtn } = route.params;
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [previewConfirmPlace, setPreviewConfirmPlace] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [remainingDestinations, setRemainingDestinations] = useState(undefined);
  const [destinationsCompleted, setDestinationsCompleted] = useState(false);

  const authCtx = useContext(AuthContext);

  const storeHuntDetails = async (routeToStore) => {
    try {
      const storedHunt = await storeHunt(routeToStore);
      return storedHunt;
    } catch (error) {
      console.error("Error fetching hunt details:", error);
    }
  };

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        console.error("Permission to access location denied");
      }
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
  };

  useEffect(() => {
    fetchUserLocation();

    const { hunt } = route.params;
    if (hunt) {
      setHuntData(hunt);
      setRemainingDestinations(
        hunt.destinations ? hunt.destinations.length : 0
      );
    }
  }, [route.params]);

  useEffect(() => {
    if(remainingDestinations === 0) {
      updateHuntBy(authCtx.email, huntData.name, { showMedal: true });
    }
  }, [remainingDestinations])

  const handleMapPress = (event) => {
    if (addingDestination) {
      const newDestination = {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
      };
      setDestinationMarkers([...destinationMarkers, newDestination]);
    }
  };

  const handleConfirmRoute = () => {
    if (destinationMarkers.length > 1) {
      const routeToStore = {
        name: huntData.name,
        duration: huntData.duration,
        destinations: destinationMarkers,
        userId: authCtx.email,
        activeHunt: false,
        showMedal: false,
      };
      storeHuntDetails(routeToStore);
      navigation.navigate("profile", { route: routeToStore });
    } else {
      console.error("Incomplete route configuration");
    }
  };

  const handleOpenCameraModal = () => {
    setConfirmationModalVisible(false); // Stäng den befintliga modalen
    setCameraVisible(true); // Visa kameran
  };

  const handleCapture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setProfileImage(photo.uri);
      setRemainingDestinations((prevCount) =>
        prevCount !== undefined ? prevCount - 1 : undefined
      );
    }

    setCameraVisible(false);
    setConfirmationModalVisible(true);
    setPreviewConfirmPlace(true);
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Din position"
          />

          {huntData &&
            huntData.destinations &&
            huntData.destinations.map((destination, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                title={destination.name}
                onPress={() => {
                  setSelectedDestination(destination);
                  if (hideDestinationBtn) {
                    setConfirmationModalVisible(true);
                  }
                  if (remainingDestinations === 0) {
                    setCameraVisible(false);
                    setConfirmationModalVisible(true);
                    setDestinationsCompleted(true);
                    setPreviewConfirmPlace(false);
                    return null;
                  }
                }}
              />
            ))}

          {/* Lägg till röda markörer för de markerade destinationerna */}
          {destinationMarkers.map((destination, index) => (
            <Marker
              key={index}
              coordinate={destination}
              title="Röd markör"
              pinColor="red"
            />
          ))}
        </MapView>
      )}
      {/* Visa kameran när användaren klickar på "Ja" */}
      {cameraVisible && (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={(ref) => setCameraRef(ref)}
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
        </View>
      )}

      {/* Visa din befintliga modal när användaren inte har öppnat kameran */}
      {!cameraVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmationModalVisible}
        >
          {!previewConfirmPlace && !destinationsCompleted && (
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Bekräfta ankomst</Text>
                <Text style={styles.modalText}>
                  Har du nått din destination?
                </Text>
                <Button title="Ja" onPress={handleOpenCameraModal} />
                <Button
                  title="Nej"
                  onPress={() => setConfirmationModalVisible(false)}
                />
              </View>
            </View>
          )}
          {previewConfirmPlace && !destinationsCompleted && (
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>NICE PIC!</Text>
                {profileImage && (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                )}
                <Text style={styles.modalTitle}>
                  {" "}
                  {remainingDestinations} destinationer kvar
                </Text>

                <Button
                  title="Confirm"
                  onPress={() => {
                    setConfirmationModalVisible(false);
                    setPreviewConfirmPlace(false);
                  }}
                />
              </View>
            </View>
          )}
          {!previewConfirmPlace && destinationsCompleted && (
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {remainingDestinations} destinationer kvar, vänligen återgå
                  till till din profil
                </Text>

                <Button
                  title="Min profil"
                  onPress={() => {
                    setConfirmationModalVisible(false);
                    setPreviewConfirmPlace(false);
                    navigation.navigate("profile", {});
                  }}
                />
              </View>
            </View>
          )}
        </Modal>
      )}

      {!hideDestinationBtn && !addingDestination && (
        <TouchableOpacity onPress={() => setAddingDestination(true)}>
          <View style={styles.buttonAdd}>
            <Text style={styles.buttonText}>Lägg till destination</Text>
          </View>
        </TouchableOpacity>
      )}

      {destinationMarkers.length > 1 && (
        <TouchableOpacity onPress={handleConfirmRoute}>
          <View style={styles.buttonFinish}>
            <Text style={styles.buttonText}>Bekräfta rutten</Text>
          </View>
        </TouchableOpacity>
      )}

      {addingDestination && (
        <TouchableOpacity onPress={() => setAddingDestination(false)}>
          <View style={styles.buttonCancel}>
            <Text style={styles.buttonText}>Avbryt</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3EFE7",
  },
  cameraContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  cameraContent: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#456268",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    marginBottom: 40,
  },
  captureButtonText: {
    color: "white",
    fontSize: 18,
  },
  buttonAdd: {
    backgroundColor: "#456268",
    padding: 25,
    alignItems: "center",
  },
  buttonFinish: {
    backgroundColor: "#456268",
    padding: 25,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#0e3740",
    padding: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 50,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  capturedImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
});
