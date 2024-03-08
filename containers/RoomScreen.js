import {
  Text,
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Rating from "../components/Rating";
import { FontAwesome } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import Swiper from "react-native-swiper";
import MapView, { Marker } from "react-native-maps";

const RoomScreen = ({ route }) => {
  const styles = useStyle();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [nthOfLines, setNthOfLines] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("ROUTE", route);
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${route.params.id}`
        );
        console.log(JSON.stringify(response.data, null, 2));
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <View style={styles.pageContainer}>
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
    <ScrollView style={styles.pageContainer}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Swiper
            horizontal
            paginationStyle={{ bottom: 15, gap: 10 }}
            dotStyle={{ height: 16, width: 16, borderRadius: 8, opacity: 0.7 }}
            activeDotStyle={{
              height: 16,
              width: 16,
              borderRadius: 8,
            }}
            activeDotColor="#EB5A61"
            dotColor="#C7C7CC"
          >
            {data.photos.map((photo) => {
              return (
                <Image
                  source={{ uri: photo.url }}
                  style={styles.picture}
                  resizeMode="contain"
                  key={photo.picture_id}
                />
              );
            })}
          </Swiper>
          <Text style={styles.price}>{data.price} €</Text>
        </View>
        <View style={[styles.flexRow, styles.informationContainer]}>
          <View style={styles.infoLeft}>
            <Text style={styles.title} numberOfLines={1}>
              {data.title}
            </Text>
            <View style={[styles.flexRow, styles.rates]}>
              <View style={[styles.flexRow, styles.stars]}>
                <Rating item={data} />
              </View>
              <Text style={styles.reviews}>{data.reviews} reviews</Text>
            </View>
          </View>
          <Image
            source={{ uri: data.user.account.photo.url }}
            style={styles.userPicture}
            resizeMode="cover"
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text numberOfLines={nthOfLines}>{data.description}</Text>
          {nthOfLines === 3 ? (
            <TouchableOpacity onPress={() => setNthOfLines(0)}>
              <Text style={styles.textBtn}>
                Show more{" "}
                <FontAwesome name="caret-down" size={18} color="#717171" />
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setNthOfLines(3)}>
              <Text style={styles.textBtn}>
                Show less{" "}
                <FontAwesome name="caret-up" size={18} color="#717171" />
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <MapView
            style={styles.map}
            initialRegion={{
              longitude: data.location[0],
              latitude: data.location[1],
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                longitude: data.location[0],
                latitude: data.location[1],
              }}
            />
          </MapView>
        </View>
      </View>
    </ScrollView>
  );
};

export default RoomScreen;

const useStyle = () => {
  const { height, width } = useWindowDimensions();

  const styles = StyleSheet.create({
    flexRow: {
      flexDirection: "row",
    },
    pageContainer: {
      backgroundColor: "white",
      height: "100%",
    },
    container: {
      width: width,
      alignItems: "center",
    },
    imageContainer: {
      position: "relative",
      width: "100%",
    },
    picture: {
      height: 250,
      width: "100%",
      objectFit: "cover",
    },
    price: {
      position: "absolute",
      bottom: 15,
      left: 0,
      backgroundColor: "black",
      color: "white",
      fontSize: 24,
      paddingVertical: 10,
      width: 100,
      textAlign: "center",
    },
    informationContainer: {
      width: "90%",
      paddingVertical: 10,
      justifyContent: "space-between",
      gap: 15,
      alignSelf: "center",
    },
    infoLeft: {
      flex: 1,
      justifyContent: "space-around",
    },
    title: {
      fontSize: 16,
    },
    rates: {
      alignItems: "center",
      gap: 10,
    },
    stars: {
      gap: 4,
    },
    reviews: {
      color: "#BFBFBF",
    },
    userPicture: {
      height: 70,
      width: 70,
      borderRadius: 35,
    },
    separator: {
      height: 20,
      borderTopColor: "#BFBFBF",
      borderTopWidth: 1,
    },
    descriptionContainer: {
      width: "90%",
      gap: 10,
      marginBottom: 15,
    },
    textBtn: {
      color: "#717171",
    },
    wrapper: {
      height: 250,
    },
    slides: {
      width: width,
    },
    map: {
      height: 200,
      width: width,
    },
  });

  return styles;
};
