import { StatusBar } from "expo-status-bar";
import { Alert, Keyboard, StyleSheet, View } from "react-native";
import * as Network from "expo-network";

import {
  PaperProvider,
  Text,
  Button,
  Modal,
  TextInput,
  Dialog,
  Paragraph,
  Portal,
  Provider,
} from "react-native-paper";
import { useFonts } from "expo-font";
import { useRef, useState } from "react";
import { Loading, Modal as QrCodeModal } from "./components";
import axios from "axios";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Noto-Sans-Condensed": require("./assets/fonts/NotoSans_Condensed-Black.ttf"),
    "Noto-Sans": require("./assets/fonts/NotoSans-Regular.ttf"),
  });

  const refInput = useRef(null);
  const [name, setName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  const resetStates = () => {
    setCellphone("");
    setName("");
  };
  const handleGetQrCode = async () => {
    try {
      setLoading(true);
      const normalized = `55${cellphone}`;
      const { data } = await axios.post(
        "https://brf-ce-app-api-chatbotperdigao-qas.19i6203zuabo.us-south.codeengine.appdomain.cloud/api/qrcode/generate",
        {
          name: name,
          fone: normalized,
        },
        {
          headers: {
            Authorization: "Api-Key 4e074c02-6f0f-4d80-8eb2-9db012bd3439",
          },
        }
      );
      if (data?.data) {
        setQrCodeUrl(data.data);
        return true;
      } else {
        return false;
      }
    } catch (er) {
      console.log(er);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const networkState = await Network.getNetworkStateAsync();

    if (!networkState?.isConnected) {
      Alert.alert(
        "Ops...",
        "Você não está conectado à internet. Conecte-se e tente novamente"
      );
      return;
    }
    if (!name.length) {
      Alert.alert("Erro", "Prencha o nome!");
      return;
    }
    if (!cellphone.length) {
      Alert.alert("Erro", "Prencha o celular!");
      return;
    }
    if (isNaN(Number(cellphone))) {
      Alert.alert("Erro", "Preencha apenas com números!");
      return;
    }
    const succeed = await handleGetQrCode();
    if (succeed) {
      resetStates();
      showModal();
    } else {
      Alert.alert(
        "Ops...",
        "Verifique se seu telefone está correto e tente novamente"
      );
    }
  };

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  return (
    <PaperProvider theme={{ colors: { primary: "#000000" } }}>
      <View style={styles.container(visible)}>
        <StatusBar style="light" />
        <View
          style={{
            backgroundColor: "white",
            width: "90%",
            paddingVertical: 48,
            paddingHorizontal: 18,
            borderRadius: 18,
            minHeight: 400,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 36 }}>
            <Text
              variant="displaySmall"
              style={{ fontFamily: "Noto-Sans-Condensed" }}
            >
              NFL In Brasa 🔥
            </Text>
          </View>
          {loading && <Loading />}
          {!loading && (
            <View>
              <TextInput
                autoFocus
                placeholder="Nome"
                value={name}
                mode="outlined"
                style={{ marginBottom: 18 }}
                onSubmitEditing={(text) => {
                  if (refInput.current) {
                    refInput.current.focus();
                  }
                }}
                onChangeText={(text) => setName(text)}
              />
              <TextInput
                placeholder="Telefone com DDD"
                mode="outlined"
                value={cellphone}
                ref={refInput}
                onChangeText={(text) => setCellphone(text)}
              />
              <View style={{ alignItems: "center", marginTop: 24 }}>
                <Portal>
                  <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={{
                      backgroundColor: "white",
                      padding: 20,
                    }}
                  >
                    <QrCodeModal onClose={hideModal} qrCodeUrl={qrCodeUrl} />
                  </Modal>
                </Portal>
                <Button
                  mode="contained"
                  labelStyle={{ color: "white" }}
                  style={{ marginTop: 30 }}
                  onPress={handleSubmit}
                >
                  Gerar QrCode
                </Button>
              </View>
            </View>
          )}
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: (reduceOpacity) => ({
    opacity: reduceOpacity ? 0.7 : 1,
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  }),
});
