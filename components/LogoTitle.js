import { FontAwesome6 } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

const LogoTitle = () => {
  return (
    <View style={styles.alignCenter}>
      <FontAwesome6 name="airbnb" size={30} color="#EB5A61" />
    </View>
  );
};

export default LogoTitle;

const styles = StyleSheet.create({
  alignCenter: {
    alignItems: "center",
  },
});
