import { useNavigation } from "@react-navigation/core";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      return setErrorMessage("Please fill all fields");
    }
    try {
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
        {
          email: email.toLowerCase(),
          password: password,
        }
      );
      console.log(JSON.stringify(response.data, null, 2));
      await AsyncStorage.setItem("userId", response.data.id);
      setToken(response.data.token);
    } catch (error) {
      if (error.response.data.error === "Unauthorized") {
        setErrorMessage("Email or password is incorrect");
      } else if (error.response.data.error === "Missing parameter(s)") {
        setErrorMessage("Please fill all fields");
      } else if (error.response.data.error === "This account doesn't exist !") {
        setErrorMessage("Email or password is incorrect");
      } else {
        console.log("ERROR", JSON.stringify(error.response.data, null, 2));
      }
    }
  };

  const handlePasswordVisibility = () => {
    if (eyeIcon === "eye") {
      setEyeIcon("eye-slash");
      setPasswordVisibility(!passwordVisibility);
    } else if (eyeIcon === "eye-slash") {
      setEyeIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.section}>
          <FontAwesome6 name="airbnb" size={100} color="#EB5A61" />
          <Text style={[styles.title, styles.textGrey]}>Sign in</Text>
        </View>
        <View style={styles.section}>
          <TextInput
            inputMode="email"
            placeholder="email"
            placeholderTextColor={"#C7C7CC"}
            value={email}
            onChangeText={(text) => {
              setErrorMessage("");
              setEmail(text);
            }}
            style={styles.input}
          />
          <View style={[styles.input, styles.inputContainer]}>
            <TextInput
              placeholder="password"
              placeholderTextColor={"#C7C7CC"}
              secureTextEntry={passwordVisibility}
              value={password}
              onChangeText={(text) => {
                setErrorMessage("");
                setPassword(text);
              }}
              style={styles.inputText}
            />
            <TouchableOpacity onPress={handlePasswordVisibility}>
              <FontAwesome5 name={eyeIcon} size={18} color="#717171" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.textRed}>{errorMessage}</Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
            <Text style={[styles.textGrey, styles.btnText]}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.textGrey}>No account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    backgroundColor: "white",
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  textGrey: {
    color: "#717171",
  },
  textRed: {
    color: "#EB5A61",
  },
  section: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  input: {
    borderBottomColor: "#FCBAC0",
    borderBottomWidth: 2,
    width: "80%",
    height: 40,
    fontSize: 16,
  },
  inputText: {
    fontSize: 16,
    width: "90%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    borderColor: "#EB5A61",
    borderWidth: 3,
    borderRadius: 30,
    paddingVertical: 10,
    width: "40%",
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#717171",
  },
});
