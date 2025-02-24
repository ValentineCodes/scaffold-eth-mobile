import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useModal } from 'react-native-modalfy';
import { Button, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import PasswordInput from '../../components/forms/PasswordInput';
import Logo from '../../components/Logo';
import { ConsentModalParams } from '../../components/modals/ConsentModal';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { loginUser, logoutUser } from '../../store/reducers/Auth';
import { clearRecipients } from '../../store/reducers/Recipients';
import globalStyles from '../../styles/globalStyles';
import { Security } from '../../types/security';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function Login({}: Props) {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { getItem, removeItem } = useSecureStorage();

  const auth = useSelector((state: any) => state.auth);

  const [password, setPassword] = useState('');
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  const { openModal } = useModal();

  const initWallet = () => {
    if (!auth.isLoggedIn) {
      dispatch(loginUser());
    }

    if (password) {
      setPassword('');
    }

    // @ts-ignore
    navigation.navigate('Main');
  };

  const unlockWithPassword = async () => {
    if (!password) {
      toast.show('Password cannot be empty!', {
        type: 'danger'
      });
      return;
    }

    const security = (await getItem('security')) as Security;
    if (password !== security.password) {
      toast.show('Incorrect password!', {
        type: 'danger'
      });
      return;
    }

    initWallet();
  };

  const unlockWithBiometrics = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const signInWithBio = async () => {
        let epochTimeSeconds = Math.round(
          new Date().getTime() / 1000
        ).toString();
        let payload = epochTimeSeconds + 'some message';

        try {
          const response = await rnBiometrics.createSignature({
            promptMessage: 'Sign in',
            payload: payload
          });

          if (response.success) {
            initWallet();
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
      toast.show('Could not sign in with biometrics', {
        type: 'danger'
      });
    }
  };

  const resetWallet = async () => {
    await removeItem('seedPhrase');
    await removeItem('accounts');
    await removeItem('security');
    dispatch(clearRecipients());
    dispatch(logoutUser());
    setTimeout(() => {
      // @ts-ignore
      navigation.navigate('Onboarding');
    }, 100);
  };

  useEffect(() => {
    (async () => {
      const security = (await getItem('security')) as Security;
      setIsBiometricsEnabled(security.isBiometricsEnabled);
      if (security.isBiometricsEnabled) {
        unlockWithBiometrics();
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          BackHandler.exitApp();

          return true;
        }
      );

      return () => backhandler.remove();
    }, [])
  );

  const handleResetWallet = () => {
    const params: ConsentModalParams = {
      title: 'Reset Wallet',
      subTitle:
        'This will erase all your current wallet data. Are you sure you want to go through with this?',
      iconColor: COLORS.error,
      titleStyle: { color: COLORS.error },
      subTitleStyle: { color: COLORS.error },
      onAccept: resetWallet
    };
    openModal('ConsentModal', params);
  };
  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContentContainer}
      style={styles.container}
    >
      <Logo />
      <Text
        variant="headlineLarge"
        style={{
          color: COLORS.primary,
          marginTop: 40,
          ...globalStyles.textBold
        }}
      >
        Welcome Back!
      </Text>

      <View style={styles.inputContainer}>
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          onSubmit={unlockWithPassword}
        />
      </View>

      <Button
        mode="contained"
        onPress={
          isBiometricsEnabled && !password
            ? unlockWithBiometrics
            : unlockWithPassword
        }
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        {isBiometricsEnabled && !password
          ? 'SIGN IN WITH BIOMETRICS'
          : 'SIGN IN'}
      </Button>

      <Text variant="bodyLarge" style={styles.resetText}>
        Wallet won't unlock? You can ERASE your current wallet and setup a new
        one
      </Text>

      <TouchableOpacity onPress={handleResetWallet} style={{ opacity: 0.8 }}>
        <Text
          variant="titleLarge"
          style={{ color: COLORS.primary, ...globalStyles.text }}
        >
          Reset Wallet
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white'
  },
  inputContainer: {
    width: '100%',
    marginTop: 20
  },
  button: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 5
  },
  buttonText: {
    fontSize: FONT_SIZE['lg'],
    color: 'white',
    ...globalStyles.text
  },
  resetText: {
    textAlign: 'center',
    marginVertical: 16,
    ...globalStyles.text
  }
});
