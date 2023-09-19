import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { getHunt, storeHunt } from "../util/http";
import * as Location from "expo-location";
import { useRoute, useNavigation } from "@react-navigation/native";

export function MapHuntScreen() {
  const [huntData, setHuntData] = useState(null); // State för jakten
  const route = useRoute();
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null); // State för användarens position
  const [selectedDestination, setSelectedDestination] = useState(null); // State för den valda destinationen
  const [routePoints, setRoutePoints] = useState([]); // State för att lagra punkter på kartan
  const [addingDestination, setAddingDestination] = useState(false); // State för att lägga till destinationer

  // Funktion för att hämta jaktdetaljer
  const fetchHuntDetails = async () => {
    try {
      const huntDetails = await getHunt(); // Anropa funktionen från http.js
      setHuntData(huntDetails);
    } catch (error) {
      console.error("Error fetching hunt details:", error);
    }
  };

  // Funktion för att hämta användarens position
  const fetchUserLocation = async () => {
    try {
      // Implementera logiken för att hämta användarens position här, t.ex. med Expo Location API
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
    // Anropa funktioner för att hämta jaktdetaljer och användarens position
    fetchHuntDetails();
    fetchUserLocation();

    const { hunt } = route.params;
    if (hunt) {
      setHuntData(hunt);
    }
  }, []);

  // Lägg till en funktion för att markera en destination när användaren klickar på kartan
  const handleMapPress = (event) => {
    if (addingDestination) {
      const newDestination = {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
      };

      // Lägg till den markerade destinationen i state
      setRoutePoints([...routePoints, newDestination]);
    }
  };

  // Lägg till en knapp för att bekräfta och skapa rutten
  const handleConfirmRoute = () => {
    if (routePoints.length > 1) {
      // Skapa rutten med de markerade destinationerna och andra uppgifter
      const routeToStore = {
        name: huntData.name,
        duration: huntData.duration,
        destinations: routePoints,
        days: huntData.duration,
      };

      // Lagra rutten i Firebase eller din valda lagringstjänst
      // Navigera till översiktsvyn eller gör andra relevanta åtgärder
      navigation.navigate("OverviewScreen", { route: routeToStore });
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
          onPress={handleMapPress} // Anropa funktionen när användaren trycker på kartan
        >
          {/* Visa användarens position på kartan */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Din position"
          />

          {/* Visa markörer för destinationer om jakten finns */}
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

          {/* Visa rutt mellan de valda punkterna */}
          {routePoints.length > 1 && (
            <Polyline
              coordinates={routePoints}
              strokeWidth={3}
              strokeColor="blue"
            />
          )}
        </MapView>
      )}

      {/* Visa knapp för att lägga till destination */}
      {!addingDestination && (
        <TouchableOpacity onPress={() => setAddingDestination(true)}>
          <View style={styles.buttonAdd}>
            <Text style={styles.buttonText}>Lägg till destination</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Visa knapp för att bekräfta och skapa rutten */}
      {routePoints.length > 1 && (
        <TouchableOpacity onPress={handleConfirmRoute}>
          <View style={styles.buttonFinish}>
            <Text style={styles.buttonText}>Bekräfta rutten</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Visa knapp för att avbryta läget att lägga till destination */}
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
    color: 'white',
    fontWeight: 'bold'
  }
});
