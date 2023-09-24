import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";

export function OverviewMap() {
  const route = useRoute();
  const { hunt } = route.params;
  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Hunt</Text>
      <Text style={styles.subtitle}>You picked:</Text>
      <Text style={styles.huntName}>{hunt.name}</Text>
  
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: hunt.destinations[0].latitude,
          longitude: hunt.destinations[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {hunt.destinations.map((destination, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title={destination.name}
          />
        ))}
      </MapView>
  
      <View style={styles.durationContainer}>
        <Text style={styles.durationLabel}>This should take about:</Text>
        <Text style={styles.durationValue}>{hunt.duration} minutes</Text>
      </View>
  
      {/* Lägg till Confirm-knappen */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate("map", { hunt: hunt })}
      >
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3EFE7",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#456268",
    marginTop: 40,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    color: "#456268",
  },
  huntName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffa953",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  map: {
    width: "100%",
    height: 300, // Justera höjden efter dina preferenser
    marginTop: 20, // Justera marginalen efter dina preferenser
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  durationLabel: {
    fontSize: 16,
    color: "#456268",
  },
  durationValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffa953",
    marginLeft: 5,
  },
  confirmButton: {
    backgroundColor: "#ffa953",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  
});
