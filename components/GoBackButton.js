import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const GoBackButton = () => {
  const navigation = useNavigation();

  return (
    <Ionicons
      name="arrow-back"
      size={24}
      color="#717171"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
};

export default GoBackButton;
