import { VStack, Text, HStack, Icon, Divider, Switch, View, ScrollView, Pressable } from 'native-base'
import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons"
import { useNavigation } from '@react-navigation/native'
import SInfo from "react-native-sensitive-info";

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

import styles from "../../styles/authentication/importWallet"
import SeedPhraseInput from '../../components/forms/SeedPhraseInput'
import PasswordInput from '../../components/forms/PasswordInput'
import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import QRCodeScanner from '../../components/modals/QRCodeScanner'
import { initAccounts } from '../../store/reducers/Accounts'
import { loginUser } from '../../store/reducers/Auth'
import { FONT_SIZE } from '../../utils/styles'
import { generate } from "random-words";
import AccountsCountModal from '../../components/modals/AccountsCountModal'
import ReactNativeBiometrics from 'react-native-biometrics'
import { TouchableOpacity } from 'react-native'
import { importMnemonic } from 'react-native-web3-wallet'

function ImportWallet() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const toast = useToast()

  const [seedPhrase, setSeedPhrase] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showAccountsCountModal, setShowAccountsCountModal] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false)

  const renderSeedPhraseError = useCallback(() => {
    if (seedPhrase.trim().split(" ").length < 12) return

    if (!ethers.utils.isValidMnemonic(seedPhrase)) {
      return "Invalid Seed Phrase"
    } else {
      return null
    }
  }, [seedPhrase])

  const validateInput = () => {
    // input validation
    if (!ethers.utils.isValidMnemonic(seedPhrase)) {
      toast.show("Invalid Seed Phrase", {
        type: "danger"
      })
      return
    }
    if (!password) {
      toast.show("Password cannot be empty!", {
        type: "danger"
      })
      return
    }

    if (password.length < 8) {
      toast.show("Password must be at least 8 characters", {
        type: "danger"
      })
      return
    }

    if (password !== confirmPassword) {
      toast.show("Passwords do not match!", {
        type: "danger"
      })
      return
    }

    setShowAccountsCountModal(true)
  }

  const importWallet = async (accountsCount: number) => {
    let wallets = []

    setIsImporting(true)
    for (let i = 0; i < accountsCount; i++) {
      const newWallet = await importMnemonic(seedPhrase, "", `m/44'/60'/0'/0/${i}`, true)

      wallets.push({
        address: newWallet.address,
        privateKey: newWallet.privateKey
      })
    }

    const security = {
      password,
      isBiometricsEnabled
    }

    try {
      // Save wallet
      await SInfo.setItem("mnemonic", seedPhrase, {
        sharedPreferencesName: "sern.android.storage",
        keychainService: "sern.ios.storage",
      });
      await SInfo.setItem("accounts", JSON.stringify(wallets), {
        sharedPreferencesName: "sern.android.storage",
        keychainService: "sern.ios.storage",
      })

      // Save password
      await SInfo.setItem("security", JSON.stringify(security), {
        sharedPreferencesName: "sern.android.storage",
        keychainService: "sern.ios.storage",
      });

      dispatch(initAccounts(wallets.map(wallet => ({ ...wallet, isImported: false }))))
      dispatch(loginUser())

      navigation.navigate("Main")
    } catch (error) {
      toast.show("Failed to import wallet. Please ensure you have a stable network connection and try again", {
        type: "danger"
      })
    } finally {
      setIsImporting(false)
    }
  }

  useEffect(() => {
    (async () => {
      // set suggested password
      setSuggestion(generate({ exactly: 2, join: "", minLength: 4, maxLength: 5 }))

      // check biometrics availability
      const rnBiometrics = new ReactNativeBiometrics()

      const { available } = await rnBiometrics.isSensorAvailable()

      if (available) {
        setIsBiometricsAvailable(available)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <HStack alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" space={2}>
          <Pressable onPress={() => navigation.goBack()} _pressed={{ opacity: 0.4 }}>
            <Icon as={<Ionicons name="arrow-back-outline" />} size={1.3 * FONT_SIZE['xl']} color="black" />
          </Pressable>
          <Text fontSize={1.2 * FONT_SIZE["xl"]} bold>Import From Seed</Text>
        </HStack>

        <TouchableOpacity activeOpacity={0.4} onPress={() => setShowScanner(true)}>
          <Icon as={<MaterialCommunityIcons name="qrcode-scan" />} size={1.3 * FONT_SIZE['xl']} color="black" />
        </TouchableOpacity>
      </HStack>

      <ScrollView flex="1">
        <VStack space={6} mt="6" mb="50">
          <SeedPhraseInput value={seedPhrase} onChange={setSeedPhrase} errorText={renderSeedPhraseError()} />
          <PasswordInput label="New Password" value={password} suggestion={suggestion} infoText={password.length < 8 && 'Must be at least 8 characters'} onChange={setPassword} />
          <PasswordInput label="Confirm New Password" value={confirmPassword} suggestion={suggestion} infoText={password && confirmPassword && password !== confirmPassword && 'Password must match'} onChange={setConfirmPassword} />

          {isBiometricsAvailable && (
            <>
              <Divider bgColor="muted.100" />

              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize={FONT_SIZE['lg']}>Sign in with Biometrics</Text>
                <Switch size="md" trackColor={{ true: COLORS.primary, false: "#E5E5E5" }} isChecked={isBiometricsEnabled} onToggle={setIsBiometricsEnabled} />
              </HStack>
            </>
          )}

          <Divider bgColor="muted.100" />

          <Button text="Import" loading={isImporting} onPress={validateInput} />
        </VStack>

        {showAccountsCountModal && <AccountsCountModal isVisible={showAccountsCountModal} onClose={() => setShowAccountsCountModal(false)} onFinish={(accountsCount: number) => {
          importWallet(accountsCount)
          setShowAccountsCountModal(false)
        }} />}

        {showScanner && <QRCodeScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onReadCode={value => {
          setSeedPhrase(value)
          setShowScanner(false)
        }} />}
      </ScrollView>
    </View >
  )
}

export default ImportWallet