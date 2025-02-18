import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../../utils/styles';

type Props = {};

function HighlightedText({ children }: { children: string }) {
  return (
    <View
      style={{ backgroundColor: COLORS.primaryLight, paddingHorizontal: 4 }}
    >
      <Text
        style={{
          textAlign: 'center',
          fontSize: FONT_SIZE['md'],
          ...globalStyles.text
        }}
      >
        {children}
      </Text>
    </View>
  );
}

export default function Home({}: Props) {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 10 }}
    >
      <View style={{ paddingVertical: 32, alignItems: 'center' }}>
        <Text variant="headlineSmall" style={globalStyles.text}>
          Welcome to
        </Text>
        <Text variant="displaySmall" style={globalStyles.textSemiBold}>
          Scaffold-ETH
        </Text>

        <Text
          style={{
            marginTop: 16,
            marginBottom: 4,
            fontSize: FONT_SIZE['lg'],
            ...globalStyles.text
          }}
        >
          Get started by editing
        </Text>
        <HighlightedText>
          packages/reactnative/src/screens/Main/Tab/Home.tsx
        </HighlightedText>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 16,
            marginBottom: 4,
            gap: 4,
            maxWidth: '100%'
          }}
        >
          <Text style={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}>
            Edit your smart contract
          </Text>
          <HighlightedText>YourContract.sol</HighlightedText>
          <Text style={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}>
            in
          </Text>
        </View>
        <HighlightedText>packages/hardhat/contracts</HighlightedText>
      </View>

      <View style={styles.featuresContainer}>
        {/* Contract Debugger */}
        <Card style={styles.feature}>
          <Card.Content
            style={{
              alignItems: 'center',
              gap: 10
            }}
          >
            <Ionicons
              name="bug-outline"
              color={'grey'}
              size={WINDOW_WIDTH * 0.09}
            />

            <Text style={styles.featureCaption}>
              Tinker with your smart contracts using the
              <Text
                style={styles.featureLink}
                onPress={() => navigation.navigate('DebugContracts')}
              >
                {' '}
                DebugContracts{' '}
              </Text>
              tab
            </Text>
          </Card.Content>
        </Card>

        {/* Wallet */}
        <Card style={styles.feature}>
          <Card.Content
            style={{
              alignItems: 'center',
              gap: 10
            }}
          >
            <Ionicons
              name="wallet-outline"
              color={'grey'}
              size={WINDOW_WIDTH * 0.09}
            />

            <Text style={styles.featureCaption}>
              Manage your accounts, funds, and tokens in your
              <Text
                style={styles.featureLink}
                onPress={() => navigation.navigate('Wallet')}
              >
                {' '}
                Wallet
              </Text>
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  featuresContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  feature: {
    paddingVertical: 32,
    width: '90%',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 24,
    backgroundColor: 'white',
    gap: 24
  },
  featureCaption: {
    textAlign: 'center',
    width: WINDOW_WIDTH * 0.6,
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  },
  featureLink: {
    textDecorationLine: 'underline',
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.textSemiBold
  }
});
