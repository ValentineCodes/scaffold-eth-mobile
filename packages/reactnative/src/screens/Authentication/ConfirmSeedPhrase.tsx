import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, Button, Divider, TextInput } from "react-native-paper";
import ProgressIndicatorHeader from "../../components/headers/ProgressIndicatorHeader";
import { COLORS } from "../../utils/constants";
import { FONT_SIZE } from "../../utils/styles";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/reducers/Auth";
import { useToast } from "react-native-toast-notifications";
import { shuffleArray } from "../../utils/helperFunctions";
import AccountsCountModal from "../../components/modals/AccountsCountModal";
import { initAccounts } from "../../store/reducers/Accounts";
import { useSecureStorage } from "../../hooks/useSecureStorage";
import useWallet from "../../hooks/useWallet";

type Props = {};

export default function ConfirmSeedPhrase({}: Props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { getItem, saveItem } = useSecureStorage();
  const { importWallet } = useWallet();

  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [shuffledSeedPhrase, setShuffledSeedPhrase] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAccountsCountModal, setShowAccountsCountModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const isWordSelected = (word: string): boolean => {
    let _seedPhrase = seedPhrase.slice();
    return _seedPhrase.includes(word);
  };

  const handleWordSelection = (word: string) => {
    let _seedPhrase = seedPhrase.slice();

    if (isWordSelected(word)) {
      _seedPhrase = _seedPhrase.filter((el) => el !== word);
    } else if (seedPhrase.length >= 12) {
      toast.show("Invalid seed phrase input", {
        type: "danger",
      });
      return;
    } else {
      _seedPhrase.push(word);
    }

    setSeedPhrase(_seedPhrase);
  };

  const handleValueChange = (value: string, index: number) => {
    let _seedPhrase = seedPhrase.slice();
    _seedPhrase[index] = value.trim();
    setSeedPhrase(_seedPhrase);
  };

  const validateInput = async () => {
    if (seedPhrase.length !== 12) {
      toast.show("Please complete seed phrase", {
        type: "warning",
      });
      return;
    }

    try {
      const _seedPhrase = await getItem("seedPhrase");
      const selectedSeedPhrase = seedPhrase.join(" ");

      if (_seedPhrase !== selectedSeedPhrase) {
        toast.show("Incorrect seed phrase order", {
          type: "danger",
        });
        return;
      }
      setShowAccountsCountModal(true);
    } catch (error) {
      toast.show("Failed to get mnemonic. Please try again.", {
        type: "danger",
      });
    }
  };

  const confirm = async (accountsCount: number) => {
    try {
      setIsConfirming(true);
      const seedPhrase = (await getItem("seedPhrase")) as string;

      let wallets = [];
      for (let i = 0; i < accountsCount; i++) {
        const newWallet = await importWallet(seedPhrase, i);
        wallets.push({
          address: newWallet.address,
          privateKey: newWallet.privateKey,
        });
      }

      await saveItem("accounts", wallets);
      dispatch(
        initAccounts(
          wallets.map((wallet) => ({ ...wallet, isImported: false })),
        ),
      );
      setShowSuccessModal(true);
    } catch (error) {
      toast.show(
        "Failed to create wallet. Please ensure you have a stable network connection and try again.",
        {
          type: "danger",
        },
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccessModal(false);
    dispatch(loginUser());
    // @ts-ignore
    navigation.navigate("Main");
  };

  useEffect(() => {
    (async () => {
      const seedPhrase = await getItem("seedPhrase");
      if (seedPhrase) {
        const _seedPhrase: string[] = seedPhrase.split(" ");
        const shuffledSeedPhrase = shuffleArray(_seedPhrase);
        setShuffledSeedPhrase(shuffledSeedPhrase);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ProgressIndicatorHeader progress={3} />

      <Divider style={{ marginTop: 32, marginBottom: 16 }} />

      <ScrollView style={{ flex: 1 }}>
        <Text
          variant="headlineMedium"
          style={styles.title}
        >
          Confirm Seed Phrase
        </Text>
        <Text
          variant="bodyLarge"
          style={styles.subtitle}
        >
          Select each word in the order it was presented to you.
        </Text>

        <Divider style={{ marginVertical: 16 }} />

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.seedPhraseWrapper}
            style={styles.seedPhraseContainer}
          >
            {shuffledSeedPhrase.map((word) => (
              <TouchableOpacity
                key={word}
                activeOpacity={0.4}
                onPress={() => handleWordSelection(word)}
                style={{ width: "45%" }}
              >
                <Text
                  style={[
                    styles.word,
                    {
                      backgroundColor: isWordSelected(word)
                        ? COLORS.primary
                        : "#F5F5F5",
                      color: isWordSelected(word) ? "white" : "black",
                    },
                  ]}
                >
                  {word}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.progressContainer}>
          {shuffledSeedPhrase.map((word, index) => (
            <View
              key={word}
              style={[
                styles.progressBar,
                {
                  backgroundColor:
                    index <=
                    seedPhrase.filter(
                      (word) => word && shuffledSeedPhrase.includes(word),
                    ).length -
                      1
                      ? COLORS.primary
                      : "#E5E5E5",
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.inputContainer}>
          {Array(12)
            .fill(null)
            .map((_, index) => (
              <TextInput
                key={index}
                mode="outlined"
                style={styles.input}
                value={seedPhrase[index]}
                onChangeText={(value) => handleValueChange(value, index)}
                left={<TextInput.Affix text={`${index + 1}.`} />}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
              />
            ))}
        </View>

        <Button
          mode="contained"
          onPress={validateInput}
          loading={isConfirming}
          style={styles.confirmButton}
        >
          Confirm
        </Button>

        <Modal
          isVisible={showSuccessModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Congratulations
            </Text>
            <Text variant="bodyLarge" style={styles.modalText}>
              You've successfully protected your wallet. Remember to keep your seed
              phrase safe, it's your responsibility!
            </Text>
            <Button
              mode="contained"
              onPress={handleSuccess}
              style={styles.modalButton}
            >
              Done
            </Button>
          </View>
        </Modal>

        {showAccountsCountModal && (
          <AccountsCountModal
            isVisible={showAccountsCountModal}
            onClose={() => setShowAccountsCountModal(false)}
            onFinish={(accountsCount: number) => {
              confirm(accountsCount);
              setShowAccountsCountModal(false);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 1.7 * FONT_SIZE["xl"],
    fontWeight: 'bold',
    lineHeight: 40
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 8
  },
  loader: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  seedPhraseContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 40,
    padding: 15,
  },
  seedPhraseWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  word: {
    width: "100%",
    padding: 10,
    borderRadius: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 40,
    width: '100%'
  },
  progressBar: {
    width: `${100 / 15}%`,
    height: 2
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8
  },
  input: {
    width: '32%',
    marginBottom: 8,
    backgroundColor: '#F5F5F5'
  },
  confirmButton: {
    marginTop: 20,
    marginBottom: 50
  },
  modal: {
    justifyContent: 'center',
    margin: 0,
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    gap: 16
  },
  modalTitle: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalText: {
    textAlign: 'center'
  },
  modalButton: {
    marginTop: 8
  }
});
