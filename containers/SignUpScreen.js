import { useNavigation } from "@react-navigation/core";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [eyeIcon1, setEyeIcon1] = useState("eye");
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);
  const [eyeIcon2, setEyeIcon2] = useState("eye");

  const handleSubmit = async () => {
    if (!email || !username || !description || !password || !confirmPassword) {
      return setErrorMessage("Please fill all fields");
    } else if (password !== confirmPassword) {
      return setErrorMessage("Passwords must be the same");
    }
    try {
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
        {
          email: email.toLowerCase(),
          username: username,
          description: description,
          password: password,
        }
      );
      console.log(JSON.stringify(response.data, null, 2));
      await AsyncStorage.setItem("userId", response.data.id);
      setToken(response.data.token);
    } catch (error) {
      console.log("ERROR", JSON.stringify(error.response.data, null, 2));
      setErrorMessage(error.response.data.error);
    }
  };

  const handlePasswordVisibility = () => {
    if (eyeIcon1 === "eye") {
      setEyeIcon1("eye-slash");
      setPasswordVisibility(!passwordVisibility);
    } else if (eyeIcon1 === "eye-slash") {
      setEyeIcon1("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const handleConfirmPasswordVisibility = () => {
    if (eyeIcon2 === "eye") {
      setEyeIcon2("eye-slash");
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (eyeIcon2 === "eye-slash") {
      setEyeIcon2("eye");
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.section}>
          <FontAwesome6 name="airbnb" size={100} color="#EB5A61" />
          <Text style={[styles.title, styles.textGrey]}>Sign up</Text>
        </View>
        <View style={styles.section}>
          <TextInput
            placeholder="email"
            placeholderTextColor={"#C7C7CC"}
            inputMode="email"
            value={email}
            onChangeText={(text) => {
              setErrorMessage("");
              setEmail(text);
            }}
            style={styles.input}
          />
          <TextInput
            placeholder="username"
            placeholderTextColor={"#C7C7CC"}
            value={username}
            onChangeText={(text) => {
              setErrorMessage("");
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
              setErrorMessage("");
              setDescription(text);
            }}
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
              <FontAwesome5 name={eyeIcon1} size={18} color="#717171" />
            </TouchableOpacity>
          </View>
          <View style={[styles.input, styles.inputContainer]}>
            <TextInput
              placeholder="confirm password"
              placeholderTextColor={"#C7C7CC"}
              secureTextEntry={confirmPasswordVisibility}
              value={confirmPassword}
              onChangeText={(text) => {
                setErrorMessage("");
                setConfirmPassword(text);
              }}
              style={styles.inputText}
            />
            <TouchableOpacity onPress={handleConfirmPasswordVisibility}>
              <FontAwesome5 name={eyeIcon2} size={18} color="#717171" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.textRed}>{errorMessage}</Text>
          <TouchableOpacity
            title="Sign up"
            onPress={handleSubmit}
            style={styles.btn}
          >
            <Text style={[styles.textGrey, styles.btnText]}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.textGrey}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
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
