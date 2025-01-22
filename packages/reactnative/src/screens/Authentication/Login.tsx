import {
  Image,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { FONT_SIZE, WINDOW_WIDTH } from "../../utils/styles";
import { COLORS } from "../../utils/constants";
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons";
import { Text, TextInput, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../../store/reducers/Auth";
import ConsentModal from "../../components/modals/ConsentModal";
import { clearRecipients } from "../../store/reducers/Recipients";
import ReactNativeBiometrics from "react-native-biometrics";
import { useSecureStorage } from "../../hooks/useSecureStorage";

type Props = {};

export default function Login({}: Props) {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { getItem, removeItem } = useSecureStorage();

  const auth = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [showResetWalletConsentModal, setShowResetWalletConsentModal] =
    useState(false);

  const initWallet = async () => {
    try {
      setIsInitializing(true);
      // await createWeb3Wallet()

      if (!auth.isLoggedIn) {
        dispatch(loginUser());
      }

      if (password) {
        setPassword("");
      }

      navigation.navigate("Main");
    } catch (error) {
      toast.show("Failed to initialize wallet", {
        type: "danger",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const unlockWithPassword = async () => {
    if (!password) {
      toast.show("Password cannot be empty!", {
        type: "danger",
      });
      return;
    }

    const security = await getItem("security");
    if (password !== security.password) {
      toast.show("Incorrect password!", {
        type: "danger",
      });
      return;
    }

    await initWallet();
  };

  const unlockWithBiometrics = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const signInWithBio = async () => {
        let epochTimeSeconds = Math.round(
          new Date().getTime() / 1000,
        ).toString();
        let payload = epochTimeSeconds + "some message";

        try {
          const response = await rnBiometrics.createSignature({
            promptMessage: "Sign in",
            payload: payload,
          });

          if (response.success) {
            await initWallet();
          }
        } catch (error) {
          return;
        }
      };

      const { available } = await rnBiometrics.isSensorAvailable();

      if (available) {
        const { keysExist } = await rnBiometrics.biometricKeysExist();

        if (!keysExist) {
          await rnBiometrics.createKeys();
        }

        signInWithBio();
      }
    } catch (error) {
      toast.show("Could not sign in with biometrics", {
        type: "danger",
      });
    }
  };

  const resetWallet = async () => {
    await removeItem("seedPhrase");
    await removeItem("accounts");
    await removeItem("security");
    dispatch(clearRecipients());
    dispatch(logoutUser());
    setTimeout(() => {
      navigation.navigate("Onboarding");
    }, 100);
  };

  useEffect(() => {
    (async () => {
      const security = await getItem("security");
      setIsBiometricsEnabled(security.isBiometricsEnabled);
      if (security.isBiometricsEnabled) {
        unlockWithBiometrics();
      }
    })();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      style={styles.container}
    >
      <Image
        source={require("../../assets/images/logo.png")}
        style={{
          width: WINDOW_WIDTH * 0.3,
          height: WINDOW_WIDTH * 0.3,
          marginBottom: 40
        }}
      />
      <Text 
        variant="headlineLarge" 
        style={{ 
          color: COLORS.primary,
          fontWeight: 'bold'
        }}
      >
        Welcome Back!
      </Text>

      <View style={styles.inputContainer}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
          Password
        </Text>
        <TextInput
          value={password}
          mode="outlined"
          style={styles.input}
          outlineColor={COLORS.primary}
          activeOutlineColor={COLORS.primary}
          left={<TextInput.Icon icon="lock" />}
          secureTextEntry
          placeholder="Password"
          onChangeText={setPassword}
          onSubmitEditing={unlockWithPassword}
        />
      </View>

      <Button
        mode="contained"
        onPress={
          isBiometricsEnabled && !password
            ? unlockWithBiometrics
            : unlockWithPassword
        }
        loading={isInitializing}
        style={styles.button}
      >
        {isBiometricsEnabled && !password ? "SIGN IN WITH BIOMETRICS" : "SIGN IN"}
      </Button>

      <Text 
        variant="bodyLarge" 
        style={styles.resetText}
      >
        Wallet won't unlock? You can ERASE your current wallet and setup a new one
      </Text>

      <TouchableOpacity
        onPress={() => setShowResetWalletConsentModal(true)}
        style={{ opacity: 0.8 }}
      >
        <Text 
          variant="titleLarge" 
          style={{ color: COLORS.primary }}
        >
          Reset Wallet
        </Text>
      </TouchableOpacity>

      <ConsentModal
        isVisible={showResetWalletConsentModal}
        title="Reset Wallet!"
        subTitle="This will erase all your current wallet data. Are you sure you want to go through with this?"
        onClose={() => setShowResetWalletConsentModal(false)}
        onAccept={() => {
          setShowResetWalletConsentModal(false);
          resetWallet();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "white",
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
    gap: 8
  },
  input: {
    backgroundColor: '#f5f5f5',
  },
  button: {
    marginTop: 20,
    width: '100%'
  },
  resetText: {
    textAlign: 'center',
    marginVertical: 16
  }
});
