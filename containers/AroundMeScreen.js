import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import axios from "axios";
import LottieView from "lottie-react-native";
import * as Location from "expo-location";

const AroundMeScreen = ({ navigation }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState({
    latitude: 48.856614,
    longitude: 2.3522219,
  });

  useEffect(() => {
    const askPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log("STATUS>>>>>", status);

        if (status === "granted") {
          const { coords } = await Location.getCurrentPositionAsync({});
          console.log("LOCATION======>>>>>", coords);
          setUserCoords({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          const { data } = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );
          console.log("DATA>>>>>>", data);

          setData(data);
        } else {
          const { data } = await axios.get(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
          );
          setData(data);
        }
      } catch (error) {
        console.log("CATCH>>>>>>", error.response);
      }
      setIsLoading(false);
    };
    askPermission();
  }, []);

  return isLoading ? (
    <View style={styles.container}>
      <LottieView
        autoPlay
        style={{
          width: 80,
          height: 80,
          alignSelf: "center",
          marginTop: 120,
        }}
        source={require("../assets/AnimationHome.json")}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation
      >
        {data.map((item) => {
          return (
            <Marker
              key={item._id}
              coordinate={{
                longitude: item.location[0],
                latitude: item.location[1],
              }}
              onPress={() => {
                navigation.navigate("RoomAroundMe", {
                  id: item._id,
                });
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};

export default AroundMeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  map: {
    height: "100%",
    width: "100%",
  },
});
