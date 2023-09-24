import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { storeHunt } from "../util/http";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker"; // Importera ImagePicker
import { useRoute, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../storage/AuthContext";

export function MapHuntScreen() {
  const [huntData, setHuntData] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [addingDestination, setAddingDestination] = useState(false);
  const [destinationMarkers, setDestinationMarkers] = useState([]); // State för att lagra markerade destinationer
  console.log(destinationMarkers, "destinationMarkers");

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
    }
  }, [route.params]);

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
      };
      console.log(huntData, "HUNTDATA-NY");
      storeHuntDetails(routeToStore);
      navigation.navigate("profile", { route: routeToStore });
    } else {
      console.error("Incomplete route configuration");
    }
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
                onPress={() => setSelectedDestination(destination)}
              />
            ))}

          {/* Lägg till röda markörer för de markerade destinationerna */}
          {destinationMarkers.map((destination, index) => (
            <Marker
              key={index}
              coordinate={destination}
              title="Röd markör"
              pinColor="red"
              //onPress={() => openCamera(destination)} // Öppna kameran när användaren klickar på markören
            />
          ))}
        </MapView>
      )}

      {!addingDestination && (
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
});
