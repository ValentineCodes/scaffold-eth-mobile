import { ethers } from 'ethers';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch } from 'react-redux';
import { Address } from 'viem';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useTokens } from '../../hooks/store/useTokens';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import { addToken, Token } from '../../store/reducers/Tokens';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Blockie from '../Blockie';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function ImportTokenModal({ modal: { closeModal } }: Props) {
  const dispatch = useDispatch();

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const [token, setToken] = useState<Token>();
  const [balance, setBalance] = useState<string>();

  const account = useAccount();
  const network = useNetwork();

  const { getTokenMetadata } = useTokenMetadata();
  const { getTokenBalance } = useTokenBalance();

  const { tokens } = useTokens();

  const getTokenData = async () => {
    try {
      if (!ethers.isAddress(address)) {
        setAddressError('Invalid address');
        return;
      }

      if (
        tokens &&
        tokens.some(
          existingToken =>
            existingToken.address.toLowerCase() === address.toLowerCase()
        )
      ) {
        setAddressError('Token already exists.');
        return;
      }

      if (addressError) {
        setAddressError(null);
      }

      setIsImporting(true);

      const tokenMetadata = await getTokenMetadata(address as Address);

      const tokenBalance = await getTokenBalance(
        address as Address,
        account.address as Address
      );

      const token = {
        address,
        name: tokenMetadata?.name,
        symbol: tokenMetadata?.symbol
      };

      setToken(token);
      setBalance(ethers.formatUnits(tokenBalance, tokenMetadata?.decimals));
    } catch (error) {
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const importToken = () => {
    const payload = {
      networkId: network.id,
      accountAddress: account.address,
      token
    };
    dispatch(addToken(payload));
    closeModal();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: FONT_SIZE['xl'], ...globalStyles.text }}>
          Import Token
        </Text>
        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={closeModal}
        />
      </View>

      <View style={styles.content}>
        {!token ? (
          <View style={{ gap: 8 }}>
            <Text variant="titleMedium" style={globalStyles.textMedium}>
              Address
            </Text>
            <TextInput
              value={address}
              mode="outlined"
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
              outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
              contentStyle={globalStyles.text}
              placeholder={'0x...'}
              onChangeText={value => setAddress(value.trim())}
              onSubmitEditing={getTokenData}
            />
            {addressError ? (
              <Text
                variant="bodySmall"
                style={{ color: COLORS.error, ...globalStyles.text }}
              >
                {addressError}
              </Text>
            ) : null}
          </View>
        ) : (
          <>
            <View style={styles.tokenHeader}>
              <Text style={{ fontSize: FONT_SIZE['md'], ...globalStyles.text }}>
                Token
              </Text>
              <Text style={{ fontSize: FONT_SIZE['md'], ...globalStyles.text }}>
                Balance
              </Text>
            </View>

            <View style={styles.tokenContainer}>
              <View style={[styles.tokenTitle, { width: '70%' }]}>
                <Blockie address={token.address} size={2.5 * FONT_SIZE['xl']} />
                <Text style={styles.tokenName}>{token.name}</Text>
              </View>

              <Text style={styles.tokenBalance}>
                {balance} {token.symbol}
              </Text>
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <Button
            type="outline"
            text="Cancel"
            onPress={closeModal}
            style={styles.button}
          />
          <Button
            text={token ? 'Import' : 'Continue'}
            onPress={token ? importToken : getTokenData}
            style={styles.button}
            loading={isImporting}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20,
    width: WINDOW_WIDTH * 0.9
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  content: {
    gap: 16
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tokenTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tokenName: {
    marginLeft: 12,
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  },
  tokenBalance: {
    marginLeft: 12,
    fontSize: FONT_SIZE['md'],
    ...globalStyles.text
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%'
  },
  button: {
    marginTop: 10,
    width: '50%'
  }
});
