import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  BackHandler,
  NativeEventSubscription,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import Logo from '../../components/Logo';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

let backHandler: NativeEventSubscription;

type Props = {};

export default function Onboarding({}: Props) {
  const navigation = useNavigation();

  const handleNav = () => {
    // @ts-ignore
    navigation.navigate('WalletSetup');
    backHandler?.remove();
  };

  useFocusEffect(() => {
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();

      return true;
    });
  });

  useEffect(() => {
    return () => {
      backHandler?.remove();
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      style={styles.container}
    >
      <Logo />
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Happy Coding!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          First, we'll need to setup a wallet. This will be unique to you and
          will be used to sign transactions, messages, and manage funds
        </Text>

        <Button
          mode="contained"
          onPress={handleNav}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Get Started
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  content: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 10
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 2 * FONT_SIZE['xl'],
    fontWeight: 'bold',
    ...globalStyles.text
  },
  subtitle: {
    textAlign: 'center',
    fontSize: FONT_SIZE['md'],
    marginVertical: 16,
    ...globalStyles.text
  },
  button: {
    marginTop: 20,
    marginBottom: 50,
    paddingVertical: 5
  },
  buttonText: {
    color: 'white',
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  }
});
