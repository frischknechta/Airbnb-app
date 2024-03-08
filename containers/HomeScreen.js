import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Rating from "../components/Rating";
import LottieView from "lottie-react-native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const styles = useStyle();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
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
    <View style={styles.lottieContainer}>
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
    <View>
      <FlatList
        style={{ backgroundColor: "white" }}
        contentContainerStyle={styles.flatListContainer}
        ItemSeparatorComponent={<View style={styles.separator}></View>}
        data={data}
        keyExtractor={(item = data._id)}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.container}
              onPress={() =>
                navigation.navigate("Room", {
                  id: item._id,
                })
              }
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.photos[0].url }}
                  style={styles.picture}
                  resizeMode="contain"
                />
                <Text style={styles.price}>{item.price} €</Text>
              </View>

              <View style={[styles.flexRow, styles.informationContainer]}>
                <View style={styles.infoLeft}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={[styles.flexRow, styles.rates]}>
                    <View style={[styles.flexRow, styles.stars]}>
                      <Rating item={item} />
                    </View>
                    <Text style={styles.reviews}>{item.reviews} reviews</Text>
                  </View>
                </View>
                <Image
                  source={{ uri: item.user.account.photo.url }}
                  style={styles.userPicture}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const useStyle = () => {
  const { height, width } = useWindowDimensions();

  const styles = StyleSheet.create({
    flexRow: {
      flexDirection: "row",
    },
    flatListContainer: {
      backgroundColor: "white",
      alignItems: "center",
      paddingVertical: 10,
    },
    container: {
      width: width * 0.9,
    },
    lottieContainer: {
      flex: 1,
      backgroundColor: "white",
    },
    imageContainer: {
      position: "relative",
    },
    picture: {
      height: 200,
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
      width: "100%",
      paddingVertical: 10,
      justifyContent: "space-between",
      gap: 15,
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
  });

  return styles;
};
