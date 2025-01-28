import { useNavigation, useRoute } from '@react-navigation/native';
import { ethers } from 'ethers';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch } from 'react-redux';
import Blockie from '../../components/Blockie';
import CopyableText from '../../components/CopyableText';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import { removeToken } from '../../store/reducers/Tokens';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function TokenDetails({}: Props) {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const network = useNetwork();
  const account = useAccount();
  // @ts-ignore
  const token = route.params.token;

  const { tokenMetadata } = useTokenMetadata({ token: token.address });

  const { balance } = useTokenBalance({ token: token.address });

  const remove = () => {
    dispatch(
      removeToken({
        networkId: network.id,
        accountAddress: account.address,
        tokenAddress: token.address
      })
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall" style={styles.headerText}>
            {token.name} ({token.symbol})
          </Text>
        </View>

        <IconButton icon="trash-can-outline" size={24} onPress={remove} />
      </View>

      <View style={styles.tokenInfoContainer}>
        <View style={styles.tokenInfoContainer}>
          <Blockie address={token.address} size={2.5 * FONT_SIZE['xl']} />

          <Text variant="headlineLarge" style={styles.balanceText}>
            {balance !== null &&
              `${ethers.formatUnits(balance, token.decimals)} ${token.symbol}`}
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <View style={styles.actionButton}>
            <IconButton
              icon={() => (
                <Ionicons name="paper-plane" size={24} color={COLORS.primary} />
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
                <Ionicons name="download" size={24} color={COLORS.primary} />
              )}
              mode="contained"
              containerColor={COLORS.primaryLight}
              size={48}
              onPress={() => null}
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
    padding: 8
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    marginLeft: 8
  },
  tokenInfoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 8
  },
  balanceText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    marginTop: 12
  },
  actionButton: {
    alignItems: 'center'
  },
  actionText: {
    marginTop: 8,
    fontWeight: 'bold'
  },
  tokenDetailsText: {
    marginTop: 24,
    fontWeight: 'bold',
    fontSize: FONT_SIZE['xl']
  },
  tokenDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  tokenDetailTitle: {
    fontWeight: 'bold',
    fontSize: FONT_SIZE['md']
  },
  tokenDetailDecimals: {
    fontWeight: 'bold',
    fontSize: FONT_SIZE['md']
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 15
  },
  addressText: {
    fontWeight: '700',
    fontSize: FONT_SIZE['md'],
    color: COLORS.primary
  }
});
