import { Image, View } from "react-native";
import { Button, Text } from "react-native-paper";

export const Modal = ({ onClose, qrCodeUrl }) => {
  return (
    <View
      style={{
        alignItems: "center",
        position: "relative",
      }}
    >
      <Text style={{ fontFamily: "Noto-Sans-Condensed", fontSize: 22 }}>
        Seu QRCode :)
      </Text>
      <Image
        style={{ width: 300, height: 300 }}
        source={{
          uri: qrCodeUrl,
        }}
      />
      <Button
        mode="contained"
        onPress={onClose}
        labelStyle={{ color: "white" }}
        style={{ backgroundColor: "black", borderRadius: 50 }}
      >
        Fechar
      </Button>
    </View>
  );
};
