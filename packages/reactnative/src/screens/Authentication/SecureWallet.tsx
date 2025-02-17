import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Divider, Text } from 'react-native-paper';
import BulletText from '../../components/BulletText';
import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function SecureWallet({}: Props) {
  const navigation = useNavigation();

  const [isSeedPhraseDescriptionVisible, setIsSeedPhraseDescriptionVisible] =
    useState(false);

  return (
    <View style={styles.container}>
      <ProgressIndicatorHeader progress={2} />

      <Divider style={{ marginTop: 32, marginBottom: 16 }} />

      <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text variant="headlineLarge" style={styles.title}>
          Secure Your Wallet
        </Text>
        <View style={styles.seedPhraseContainer}>
          <Text variant="bodyLarge" style={globalStyles.text}>
            Secure your wallet's "
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: COLORS.primary, ...globalStyles.text }}
            onPress={() => setIsSeedPhraseDescriptionVisible(true)}
          >
            Seed Phrase
          </Text>
          <Text variant="bodyLarge" style={globalStyles.text}>
            "
          </Text>
        </View>

        <Divider style={{ marginVertical: 16 }} />

        <View style={{ marginBottom: 50, gap: 16 }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: 'bold', ...globalStyles.text }}
          >
            Manual
          </Text>
          <Text variant="bodyLarge" style={globalStyles.text}>
            Write down your seed phrase on a piece of paper and store in a safe
            place.
          </Text>

          <Text variant="bodyLarge" style={globalStyles.text}>
            Security level: Very strong
          </Text>

          <View style={styles.securityIndicator}>
            {Array(3)
              .fill(null)
              .map(_ => (
                <View
                  key={Math.random().toString()}
                  style={styles.securityBar}
                />
              ))}
          </View>

          <View style={{ gap: 8 }}>
            <Text variant="bodyLarge" style={globalStyles.text}>
              Risks are:
            </Text>
            <BulletText text="You lose it" />
            <BulletText text="You forget where you put it" />
            <BulletText text="Someone else finds it" />
          </View>

          <Text variant="bodyLarge" style={globalStyles.text}>
            Other options: Doesn't have to be paper!
          </Text>

          <View style={{ gap: 8 }}>
            <Text variant="bodyLarge" style={globalStyles.text}>
              Tips:
            </Text>
            <BulletText text="Store in bank vault" />
            <BulletText text="Store in a safe" />
            <BulletText text="Store in multiple secret places" />
          </View>

          <Divider style={{ marginTop: 40 }} />

          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateWallet')}
          >
            Start
          </Button>
        </View>

        <Modal
          isVisible={isSeedPhraseDescriptionVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onBackdropPress={() => setIsSeedPhraseDescriptionVisible(false)}
          onBackButtonPress={() => setIsSeedPhraseDescriptionVisible(false)}
          style={{ justifyContent: 'flex-end' }}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              What is a "Seed Phrase"?
            </Text>

            <Divider style={{ marginVertical: 8 }} />

            <View style={{ gap: 16 }}>
              <Text variant="bodyMedium">
                A seed phrase is a set of twelve words that contains all the
                information about your wallet, including your funds. It's like a
                secret code used to access your entire wallet.
              </Text>
              <Text variant="bodyMedium">
                You must keep your seed phrase secret and safe. If someone gets
                your seed phrase, they'll gain control over your accounts.
              </Text>
              <Text variant="bodyMedium">
                Save it in a place where only you can access it. If you lose it,
                not even Paux can help you recover it.
              </Text>
            </View>

            <Divider style={{ marginVertical: 8 }} />

            <Button
              mode="contained"
              onPress={() => setIsSeedPhraseDescriptionVisible(false)}
            >
              OK, I Got It
            </Button>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 15
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 1.7 * FONT_SIZE['xl'],
    fontWeight: 'bold',
    ...globalStyles.text
  },
  seedPhraseContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  securityBar: {
    width: 48,
    height: 4,
    backgroundColor: COLORS.primary
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    gap: 16
  },
  modalTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    ...globalStyles.text
  }
});
