import { Ionicons } from "@expo/vector-icons";

const Rating = ({ item }) => {
  let rating = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= item.ratingValue) {
      rating.push(<Ionicons name="star" size={20} color="#FAB100" key={i} />);
    } else {
      rating.push(<Ionicons name="star" size={20} color="#BBBBBB" key={i} />);
    }
  }

  return rating;
};

export default Rating;
