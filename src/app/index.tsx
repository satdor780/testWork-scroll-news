import { Colors } from "@/constants/theme";
import Feed from "@/modules/Feed/Feed";

import { useWindowDimensions, View } from "react-native";

export default function FeedScreen() {
  const { height } = useWindowDimensions();
  return (
    <View
      style={{
        paddingTop: 50,
        backgroundColor: Colors.background,
        height: height,
      }}
    >
      <Feed />
    </View>
  );
}
