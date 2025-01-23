import { ethers } from 'ethers';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Address } from 'viem';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import { addToken, Token } from '../../store/reducers/Tokens';
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
const network = useNetwork()

  const { getTokenMetadata } = useTokenMetadata();
  const { getTokenBalance } = useTokenBalance();

  const getTokenData = async () => {
    try {
      if (!ethers.isAddress(address)) {
        setAddressError('Invalid address');
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
      console.error(error)
    } finally {
      setIsImporting(false);
    }
  };

  const importToken = () => {
    const payload = {
      networkId: network.id,
      accountAddress: account.address,
      token
    }
    dispatch(addToken(payload));
    closeModal();
  };
  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={closeModal}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">Import Token</Text>
          <IconButton icon="close" onPress={closeModal} />
        </View>

        <View style={styles.content}>
          {!token ? (
            <View style={{ gap: 8 }}>
              <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
                Address
              </Text>
              <TextInput
                value={address}
                mode="outlined"
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                style={{ fontSize: FONT_SIZE.md }}
                placeholder={'0x...'}
                onChangeText={value => setAddress(value.trim())}
              />
              {addressError ? (
                <Text variant="bodySmall" style={{ color: '#ef4444' }}>
                  {addressError}
                </Text>
              ) : null}
            </View>
          ) : (
            <>
              <View style={styles.tokenHeader}>
                <Text>Token</Text>
                <Text>Balance</Text>
              </View>

              <View style={styles.tokenContainer}>
                <View style={[styles.tokenTitle, { width: '70%' }]}>
                  <Blockie
                    address={token.address}
                    size={2.5 * FONT_SIZE['xl']}
                  />
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
      </Modal>
    </Portal>
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
    marginLeft: 12
  },
  tokenBalance: {
    marginLeft: 12
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
