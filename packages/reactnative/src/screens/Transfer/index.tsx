import { useIsFocused, useNavigation } from "@react-navigation/native";
import { View, StyleSheet, TouchableOpacity, BackHandler, Image, FlatList } from "react-native";
import { Text, TextInput, Divider, IconButton } from "react-native-paper";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FONT_SIZE } from "../../utils/styles"; 
import { ALCHEMY_KEY, COLORS } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Account } from "../../store/reducers/Accounts";
import { Network } from "../../store/reducers/Networks";
// @ts-ignore
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import Button from "../../components/Button";
import Blockie from "../../components/Blockie";

import "react-native-get-random-values";
import "@ethersproject/shims";
import { JsonRpcProvider, formatEther, parseEther, isAddress } from "ethers";
import QRCodeScanner from "../../components/modals/QRCodeScanner";
import AccountsModal from "./modules/AccountsModal";
import redstone from "redstone-api";
import ConfirmationModal from "./modules/ConfirmationModal";
import { useToast } from "react-native-toast-notifications";
import { isENS, parseFloat } from "../../utils/helperFunctions";
import ConsentModal from "../../components/modals/ConsentModal";
import { clearRecipients } from "../../store/reducers/Recipients";

type Props = {};

export default function Transfer({}: Props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const toast = useToast();

  const accounts: Account[] = useSelector((state: any) => state.accounts);
  const connectedNetwork: Network = useSelector((state: any) =>
    state.networks.find((network: Network) => network.isConnected),
  );
  const connectedAccount: Account = useSelector((state: any) =>
    state.accounts.find((account: Account) => account.isConnected),
  );
  const recipients: string[] = useSelector((state: any) => state.recipients);

  const [balance, setBalance] = useState<bigint | null>(null);
  const [gasCost, setGasCost] = useState<bigint | null>(null);
  const [dollarRate, setDollarRate] = useState<number | null>(null);

  const [from, setFrom] = useState<Account>(connectedAccount);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [showFromAccountsModal, setShowFromAccountsModal] = useState(false);
  const [showToAccountsModal, setShowToAccountsModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showClearRecipientsConsentModal, setShowClearRecipientsConsentModal] =
    useState(false);
  const [toAddressError, setToAddressError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [isAmountInCrypto, setIsAmountInCrypto] = useState(true);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 13)}...${address.slice(address.length - 13, address.length)}`;
  };

  const getBalance = async () => {
    try {
      const provider = new JsonRpcProvider(connectedNetwork.provider);
      const balance = await provider.getBalance(from.address);
      const gasPrice = await provider.getFeeData();

      const gasCost = gasPrice.gasPrice! * BigInt(21000);

      setGasCost(gasCost);
      setBalance(balance);
    } catch (error) {
      return;
    }
  };

  const getAmountConversion = useCallback(() => {
    if (dollarRate === null || isNaN(Number(amount))) return;

    if (isAmountInCrypto) {
      const dollarValue = Number(amount) * dollarRate;
      return "$" + (dollarValue ? parseFloat(dollarValue.toString(), 8) : "0");
    } else {
      const dollarValue = Number(amount) / dollarRate;
      return `${dollarValue ? parseFloat(dollarValue.toString(), 8) : "0"} ${connectedNetwork.currencySymbol}`;
    }
  }, [dollarRate, amount, isAmountInCrypto]);

  const confirm = () => {
    if (!isAddress(toAddress)) {
      toast.show("Invalid address", {
        type: "danger",
      });
      return;
    }

    let _amount = amount;

    if (!isAmountInCrypto) {
      if (dollarRate) {
        _amount = (Number(_amount) / dollarRate).toString();
      } else if (amountError) {
        setAmountError("");
      }
    }

    if (isNaN(Number(_amount)) || Number(_amount) < 0) {
      toast.show("Invalid amount", {
        type: "danger",
      });
      return;
    }

    if (_amount.trim() && balance && gasCost && !isNaN(Number(_amount))) {
      if (Number(_amount) >= Number(formatEther(balance))) {
        toast.show("Insufficient amount", {
          type: "danger",
        });
        return;
      } else if (
        Number(formatEther(balance - gasCost)) < Number(_amount)
      ) {
        toast.show("Insufficient amount for gas", {
          type: "danger",
        });
        return;
      }
    }

    setShowConfirmationModal(true);
  };

  const formatBalance = () => {
    return Number(formatEther(balance!))
      ? parseFloat(Number(formatEther(balance!)).toString(), 4)
      : 0;
  };

  const handleToAddressChange = async (value: string) => {
    setToAddress(value);

    if (toAddressError) {
      setToAddressError("");
    }

    if (isENS(value)) {
      try {
        const provider = new JsonRpcProvider(
          `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
        );

        const address = await provider.resolveName(value);

        if (address && isAddress(address)) {
          setToAddress(address);
        } else {
          setToAddressError("Invalid ENS");
        }
      } catch (error) {
        setToAddressError("Could not resolve ENS");
        return;
      }
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);

    let amount = Number(value);

    if (!isAmountInCrypto) {
      if (dollarRate) {
        amount = Number(amount) / dollarRate;
      } else if (amountError) {
        setAmountError("");
      }
    }

    if (value.trim() && balance && !isNaN(amount) && gasCost) {
      if (amount >= Number(formatEther(balance))) {
        setAmountError("Insufficient amount");
      } else if (
        Number(formatEther(balance - gasCost)) < amount
      ) {
        setAmountError("Insufficient amount for gas");
      } else if (amountError) {
        setAmountError("");
      }
    } else if (amountError) {
      setAmountError("");
    }
  };

  const setMaxAmount = () => {
    if (balance && gasCost && balance > gasCost) {
      const max = formatEther(balance - gasCost);
      handleAmountChange(max);
      setIsAmountInCrypto(true);
    }
  };

  const convertCurrency = () => {
    // allow users to start from preferred currency
    if (!amount && dollarRate) {
      setIsAmountInCrypto(!isAmountInCrypto);
      return;
    }

    // validate input
    if (!amount || !dollarRate) return;
    if (isNaN(Number(amount)) || Number(amount) < 0) {
      toast.show("Invalid amount", {
        type: "danger",
      });
      return;
    }

    setIsAmountInCrypto(!isAmountInCrypto);

    if (isAmountInCrypto) {
      setAmount((Number(amount) * dollarRate).toString());
    } else {
      setAmount((Number(amount) / dollarRate).toString());
    }
  };

  const getToAddressName = () => {
    const toAccount = accounts.find(
      (account) => account.address?.toLowerCase() === toAddress?.toLowerCase(),
    );

    if (!toAccount) return;
    return `(${toAccount.name})`;
  };

  const logo = useMemo(() => {
    let _logo = require("../../assets/images/eth-icon.png");

    if (["Polygon", "Mumbai"].includes(connectedNetwork.name)) {
      _logo = require("../../assets/images/polygon-icon.png");
    } else if (
      ["Arbitrum", "Arbitrum Goerli"].includes(connectedNetwork.name)
    ) {
      _logo = require("../../assets/images/arbitrum-icon.png");
    } else if (
      ["Optimism", "Optimism Goerli"].includes(connectedNetwork.name)
    ) {
      _logo = require("../../assets/images/optimism-icon.png");
    }

    return (
      <Image
        key={`${_logo}`}
        source={_logo}
        alt={connectedNetwork.name}
        style={styles.networkLogo}
      />
    );
  }, [connectedNetwork]);

  const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
    navigation.goBack();

    return true;
  });

  useEffect(() => {
    if (!isFocused) return;
    const provider = new JsonRpcProvider(connectedNetwork.provider);

    provider.removeAllListeners();

    provider.on("block", () => {
      getBalance();
    });

    return () => {
      provider.removeAllListeners();
      backHandler.remove();
    };
  }, [from]);

  if (!isFocused) return;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineMedium" style={styles.headerText}>
          Send {connectedNetwork.currencySymbol}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium">From:</Text>

        <TouchableOpacity
          disabled={accounts.length === 1}
          onPress={() => setShowFromAccountsModal(true)}
          style={[
            styles.fromAccountContainer,
            {backgroundColor: accounts.length === 1 ? '#f5f5f5' : '#fff'}
          ]}
        >
          <View style={styles.accountInfo}>
            <Blockie
              address={from.address}
              size={1.8 * FONT_SIZE["xl"]}
            />

            <View style={styles.accountDetails}>
              <Text variant="titleMedium">{from.name}</Text>
              <Text variant="bodyMedium">
                Balance:{" "}
                {balance !== null &&
                  `${formatBalance()} ${connectedNetwork.currencySymbol}`}
              </Text>
            </View>
          </View>

          {accounts.length > 1 && (
            <IconButton
              icon="chevron-down"
              size={24}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.toHeader}>
          <Text variant="titleMedium">To:</Text>
          <TouchableOpacity
            onPress={() => {
              if (accounts.length > 1) {
                setShowToAccountsModal(true);
              } else {
                setToAddress(connectedAccount.address);
              }
            }}
          >
            <Text style={styles.myAccountText}>
              My account<Text style={styles.accountName}>{getToAddressName()}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          value={toAddress}
          mode="outlined"
          style={styles.input}
          placeholder="Recipient Address"
          onChangeText={handleToAddressChange}
          left={isAddress(toAddress) ? (
            <TextInput.Icon icon={() => (
              <Blockie address={toAddress} size={1.8 * FONT_SIZE["xl"]} />
            )} />
          ) : null}
          right={
            <TextInput.Icon 
              icon="qrcode-scan"
              onPress={() => setShowScanner(true)}
            />
          }
          error={!!toAddressError}
        />
        {toAddressError && (
          <Text variant="bodySmall" style={styles.errorText}>
            {toAddressError}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.amountHeader}>
          <Text variant="titleMedium">Amount:</Text>
          {balance && gasCost && balance > gasCost ? (
            <TouchableOpacity onPress={setMaxAmount}>
              <Text style={styles.maxText}>Max</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TextInput
          value={amount}
          mode="outlined"
          style={styles.input}
          placeholder={`0 ${isAmountInCrypto ? connectedNetwork.currencySymbol : "USD"}`}
          onChangeText={handleAmountChange}
          keyboardType="number-pad"
          left={
            <TextInput.Icon
              icon={() => (
                isAmountInCrypto ? (
                  logo
                ) : (
                  <FontAwesome5 name="dollar-sign" size={24} color={COLORS.primary} />
                )
              )}
              onPress={convertCurrency}
              disabled={!Boolean(dollarRate)}
            />
          }
          right={dollarRate !== null ? (
            <TextInput.Affix
              text={getAmountConversion()}
            />
          ) : null}
          error={!!amountError}
        />

        {amountError && (
          <Text variant="bodySmall" style={styles.errorText}>
            {amountError}
          </Text>
        )}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.recipientsContainer}>
        {recipients.length > 0 && (
          <>
            <View style={styles.recipientsHeader}>
              <Text variant="titleLarge">Recents</Text>
              <TouchableOpacity
                onPress={() => setShowClearRecipientsConsentModal(true)}
              >
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              keyExtractor={(item) => item}
              data={recipients}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setToAddress(item)}
                  style={styles.recipientItem}
                >
                  <Blockie address={item} size={1.7 * FONT_SIZE["xl"]} />
                  <Text variant="titleMedium" style={styles.recipientAddress}>
                    {truncateAddress(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>

      {showScanner && (
        <QRCodeScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onReadCode={(address) => {
            setToAddress(address);
            setShowScanner(false);
          }}
        />
      )}

      <Button text="Next" onPress={confirm} />

      <ConsentModal
        isVisible={showClearRecipientsConsentModal}
        title="Clear Recents!"
        subTitle="This action cannot be reversed. Are you sure you want to go through with this?"
        okText="Yes, I'm sure"
        cancelText="Not really"
        onClose={() => setShowClearRecipientsConsentModal(false)}
        onAccept={() => {
          setShowClearRecipientsConsentModal(false);
          dispatch(clearRecipients());
        }}
      />

      {showConfirmationModal && (
        <ConfirmationModal
          isVisible={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          txData={{
            from,
            to: toAddress,
            amount:
              !isAmountInCrypto && dollarRate
                ? parseFloat((Number(amount) / dollarRate).toString(), 8)
                : parseFloat(amount, 8),
            fromBalance: balance,
          }}
          estimateGasCost={gasCost}
        />
      )}

      <AccountsModal
        isVisible={showFromAccountsModal || showToAccountsModal}
        selectedAccount={showFromAccountsModal ? from.address : toAddress}
        onClose={() => {
          if (showFromAccountsModal) {
            setShowFromAccountsModal(false);
          } else {
            setShowToAccountsModal(false);
          }
        }}
        onSelect={(account: Account) => {
          if (showFromAccountsModal) {
            if (account.address === from.address) return;
            setFrom(account);
            setShowFromAccountsModal(false);
          } else {
            if (account.address === toAddress) return;
            setToAddress(account.address);
            setShowToAccountsModal(false);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  headerText: {
    marginLeft: 8
  },
  section: {
    marginBottom: 24
  },
  fromAccountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 10,
    marginTop: 8
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountDetails: {
    marginLeft: 8,
    width: '75%'
  },
  toHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  myAccountText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '500',
    marginLeft: 8
  },
  accountName: {
    color: 'black'
  },
  input: {
    backgroundColor: '#f5f5f5'
  },
  errorText: {
    color: 'red',
    marginTop: 4
  },
  amountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  maxText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '500',
    marginLeft: 8
  },
  divider: {
    backgroundColor: '#e0e0e0',
    marginVertical: 16
  },
  recipientsContainer: {
    flex: 1
  },
  recipientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  clearText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '500'
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  recipientAddress: {
    marginLeft: 16
  },
  networkLogo: {
    width: 2 * FONT_SIZE["xl"],
    height: 2 * FONT_SIZE["xl"],
  },
});
