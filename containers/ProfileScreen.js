import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome6 } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export default function ProfileScreen({ setToken }) {
  const [userToken, setUserToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedPicture, setSelectedPicture] = useState();

  const getPermissionAndGetPicture = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
        });

        if (result.canceled === true) {
          alert("You haven't selected a picture");
        } else {
          setSelectedPicture(result.assets[0].uri);
        }
      } else {
        alert("Access refused");
      }
    } catch (error) {
      console.log("CATCH>>>", error.response);
    }
  };

  const getPermissionAndTakePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync();

        if (result.canceled === true) {
          alert("You haven't selected a picture");
        } else {
          setSelectedPicture(result.assets[0].uri);
        }
      } else {
        alert("Access refused");
      }
    } catch (error) {
      console.log("CATCH>>>", error.response);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (selectedPicture) {
        const extension = selectedPicture.split(".").at(-1);

        const formData = new FormData();
        formData.append("photo", {
          uri: selectedPicture,
          name: `my-avatar.${extension}`,
          type: `image/${extension}`,
        });

        const { data } = await axios.put(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("IMAGE UPLOAD", data);
      }

      const response = await axios.put(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
        {
          email: email,
          username: username,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("RESPONSE>>>>>", response.data);
      setIsLoading(false);
      alert("Profile has been updated");
    } catch (error) {
      console.log("CATCH>>>", error.response);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      const id = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("userToken");
      const { data } = await axios.get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("RESPONSE>>>>>", data);
      setUserToken(token);
      setEmail(data.email);
      setUsername(data.username);
      setDescription(data.description);
      setPhoto(data.photo);
      setIsLoading(false);
    };
    getProfile();
  }, []);

  return isLoading ? (
    <>
      <View style={styles.container}>
        <LottieView
          autoPlay
          style={{
            width: 80,
            height: 80,
            alignSelf: "center",
            marginTop: 120,
          }}
          source={require("../assets/AnimationProfile.json")}
        />
      </View>
    </>
  ) : (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.flexRow}>
        <Image
          source={
            selectedPicture
              ? { uri: selectedPicture }
              : photo
              ? { uri: photo.url }
              : require("../assets/avatar.webp")
          }
          style={styles.avatar}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={getPermissionAndGetPicture}>
            <FontAwesome6 name="images" size={24} color="#717171" />
          </TouchableOpacity>
          <TouchableOpacity onPress={getPermissionAndTakePicture}>
            <FontAwesome6 name="camera" size={24} color="#717171" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <TextInput
          placeholder="email"
          placeholderTextColor={"#C7C7CC"}
          inputMode="email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          style={styles.input}
        />
        <TextInput
          placeholder="username"
          placeholderTextColor={"#C7C7CC"}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
          }}
          style={styles.input}
        />
        <TextInput
          placeholder="Describe yourself in a few words..."
          placeholderTextColor={"#C7C7CC"}
          multiline
          style={styles.textArea}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
          }}
        />
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setToken(null);
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 20,
  },
  avatar: {
    height: 160,
    width: 160,
    borderRadius: 80,
    borderColor: "#FCBAC0",
    borderWidth: 2,
  },
  btnContainer: {
    position: "absolute",
    right: -50,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    height: "100%",
  },
  section: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    borderBottomColor: "#FCBAC0",
    borderBottomWidth: 2,
    width: "80%",
    height: 40,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    width: "80%",
    borderColor: "#FCBAC0",
    borderWidth: 2,
    textAlignVertical: "top",
    padding: 10,
    marginTop: 20,
    fontSize: 16,
  },

  btn: {
    borderColor: "#EB5A61",
    borderWidth: 3,
    borderRadius: 30,
    paddingVertical: 10,
    marginVertical: 10,
    width: "40%",
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#717171",
  },
});
