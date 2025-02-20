import { useNavigation, useRoute } from '@react-navigation/native';
import { ethers } from 'ethers';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { IconButton, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch } from 'react-redux';
import BackButton from '../../components/buttons/BackButton';
import CopyableText from '../../components/CopyableText';
import Blockie from '../../components/scaffold-eth/Blockie';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import { removeToken } from '../../store/reducers/Tokens';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function TokenDetails({}: Props) {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { openModal } = useModal();

  const network = useNetwork();
  const account = useAccount();
  // @ts-ignore
  const token = route.params.token;

  const { tokenMetadata } = useTokenMetadata({ token: token.address });

  const { balance } = useTokenBalance({ token: token.address });

  const remove = () => {
    dispatch(
      removeToken({
        networkId: network.id.toString(),
        accountAddress: account.address,
        tokenAddress: token.address
      })
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <BackButton />
          <Text variant="titleLarge" style={globalStyles.textSemiBold}>
            {token.name} ({token.symbol})
          </Text>
        </View>

        <Ionicons
          name="trash-outline"
          size={FONT_SIZE['xl'] * 1.2}
          color={COLORS.error}
          onPress={remove}
        />
      </View>

      <View style={styles.tokenInfoContainer}>
        <View style={styles.tokenInfoContainer}>
          <Blockie address={token.address} size={2.5 * FONT_SIZE['xl']} />

          <Text variant="headlineLarge" style={styles.balanceText}>
            {balance !== null &&
              `${Number(ethers.formatUnits(balance, token.decimals)).toLocaleString('en-US')} ${token.symbol}`}
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <View style={styles.actionButton}>
            <IconButton
              icon={() => (
                <Ionicons
                  name="paper-plane-outline"
                  size={24}
                  color={COLORS.primary}
                />
              )}
              mode="contained"
              containerColor={COLORS.primaryLight}
              size={48}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('ERC20TokenTransfer', { token });
              }}
            />
            <Text variant="titleMedium" style={styles.actionText}>
              Send
            </Text>
          </View>

          <View style={styles.actionButton}>
            <IconButton
              icon={() => (
                <Ionicons
                  name="download-outline"
                  size={24}
                  color={COLORS.primary}
                />
              )}
              mode="contained"
              containerColor={COLORS.primaryLight}
              size={48}
              onPress={() =>
                openModal('ReceiveModal', {
                  tokenSymbol: token.symbol
                })
              }
            />
            <Text variant="titleMedium" style={styles.actionText}>
              Receive
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.tokenDetailsText}>Token Details</Text>
      <View style={styles.tokenDetailContainer}>
        <Text style={styles.tokenDetailTitle}>Contract address</Text>
        <CopyableText
          displayText={truncateAddress(token.address)}
          value={token.address}
          containerStyle={styles.addressContainer}
          textStyle={styles.addressText}
          iconStyle={{ color: COLORS.primary }}
        />
      </View>
      <View style={styles.tokenDetailContainer}>
        <Text style={styles.tokenDetailTitle}>Token decimal</Text>
        <Text style={styles.tokenDetailDecimals}>
          {tokenMetadata?.decimals?.toString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  tokenInfoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 8
  },
  balanceText: {
    textAlign: 'center',
    marginTop: 8,
    ...globalStyles.textMedium
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    marginVertical: 8
  },
  actionButton: {
    alignItems: 'center'
  },
  actionText: {
    marginTop: 8,
    ...globalStyles.textMedium
  },
  tokenDetailsText: {
    marginTop: 24,
    fontSize: FONT_SIZE['xl'],
    ...globalStyles.textMedium
  },
  tokenDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  tokenDetailTitle: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.textMedium
  },
  tokenDetailDecimals: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.textMedium
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 2,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 24
  },
  addressText: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.textMedium,
    marginBottom: -2,
    color: COLORS.primary
  }
});
