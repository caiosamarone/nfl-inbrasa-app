import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const Loading = () => {
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 48,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
      }}
    >
      <Text
        style={{
          fontSize: 22,
        }}
      >
        Gerando seu QR Code
      </Text>
      <ActivityIndicator />
    </View>
  );
};
