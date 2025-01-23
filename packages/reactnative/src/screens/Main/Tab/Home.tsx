import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { COLORS } from '../../../utils/constants';
import { WINDOW_WIDTH } from '../../../utils/styles';

type Props = {};

function HighlightedText({ children }: { children: string }) {
  return (
    <Surface
      style={{ backgroundColor: COLORS.primaryLight, paddingHorizontal: 4 }}
    >
      <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
        {children}
      </Text>
    </Surface>
  );
}

export default function Example({}: Props) {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 8, paddingVertical: 32, alignItems: 'center' }}>
        <Text variant="headlineSmall" style={{ fontWeight: '300' }}>
          Welcome to
        </Text>
        <Text variant="displaySmall" style={{ fontWeight: 'bold' }}>
          Scaffold-ETH
        </Text>

        <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 4 }}>
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
          <Text variant="titleMedium">Edit your smart contract</Text>
          <HighlightedText>YourContract.sol</HighlightedText>
          <Text variant="titleMedium">in</Text>
        </View>
        <HighlightedText>packages/hardhat/contracts</HighlightedText>
      </View>

      <View
        style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}
      >
        <Surface
          style={{
            padding: 16,
            paddingVertical: 32,
            width: '80%',
            borderWidth: 1,
            borderColor: '#e5e5e5',
            borderRadius: 24,
            alignItems: 'center',
            gap: 24
          }}
        >
          <Ionicons
            name="bug-outline"
            color={'grey'}
            size={WINDOW_WIDTH * 0.08}
          />

          <Text variant="titleMedium" style={{ textAlign: 'center' }}>
            Tinker with your smart contracts using the
            <Text
              variant="titleMedium"
              style={{ textDecorationLine: 'underline', fontWeight: '500' }}
              onPress={() => navigation.navigate('DebugContracts')}
            >
              {' '}
              DebugContracts{' '}
            </Text>
            tab
          </Text>
        </Surface>
      </View>
    </ScrollView>
  );
}
