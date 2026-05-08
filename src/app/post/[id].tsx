import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function PostScreen() {
  const { id } = useLocalSearchParams(); // достаём id из URL

  return (
    <View>
      <Text>Пост с id: {id}</Text>
    </View>
  );
}
