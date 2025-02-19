import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { useModal } from 'react-native-modalfy';
import { IconButton, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import CopyableText from '../../../../../components/CopyableText';
import useAccount from '../../../../../hooks/scaffold-eth/useAccount';
import useBalance from '../../../../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../../../../hooks/scaffold-eth/useNetwork';
import { useCryptoPrice } from '../../../../../hooks/useCryptoPrice';
import globalStyles from '../../../../../styles/globalStyles';
import { COLORS } from '../../../../../utils/constants';
import {
  parseBalance,
  truncateAddress
} from '../../../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../../../utils/styles';

type Props = {
  backHandler: any;
};

function MainBalance({ backHandler }: Props) {
  const network = useNetwork();
  const account = useAccount();
  const { balance, isRefetching, refetch } = useBalance({
    address: account.address
  });
  const { price, fetchPrice } = useCryptoPrice({ enabled: false });

  const navigation = useNavigation();

  const { openModal } = useModal();

  const logo = useMemo(() => {
    let _logo = require('../../../../../assets/images/eth-icon.png');

    if (['Polygon', 'Mumbai'].includes(network.name)) {
      _logo = require('../../../../../assets/images/polygon-icon.png');
    } else if (['Arbitrum', 'Arbitrum Goerli'].includes(network.name)) {
      _logo = require('../../../../../assets/images/arbitrum-icon.png');
    } else if (['Optimism', 'Optimism Goerli'].includes(network.name)) {
      _logo = require('../../../../../assets/images/optimism-icon.png');
    }

    return (
      <View style={styles.logoContainer}>
        <Image source={_logo} style={styles.networkLogo} />
      </View>
    );
  }, [network]);

  const handleNav = () => {
    // @ts-ignore
    navigation.navigate('NetworkTokenTransfer');
    backHandler?.remove();
  };

  useEffect(() => {
    if (!!balance && parseBalance(balance).length > 0) return;
    fetchPrice();
  }, [balance, network]);

  const refresh = () => {
    refetch();
    fetchPrice();
  };

  return (
    <ScrollView
      style={{ flexGrow: 0 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.nameText}>
          {account.name}
        </Text>

        <CopyableText
          displayText={truncateAddress(account.address)}
          value={account.address}
          containerStyle={styles.addressContainer}
          textStyle={styles.addressText}
          iconStyle={{ color: COLORS.primary }}
        />

        {logo}

        <View style={styles.balanceContainer}>
          <Text variant="headlineLarge" style={styles.balanceText}>
            {balance !== null
              ? `${parseBalance(balance)} ${network.currencySymbol}`
              : null}
          </Text>

          <Text
            style={{
              color: 'grey',
              fontSize: FONT_SIZE['lg'],
              ...globalStyles.text
            }}
          >
            {price &&
              balance !== null &&
              parseBalance(balance).length > 0 &&
              `$${(price * Number(parseBalance(balance))).toFixed(2)}`}
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
              onPress={handleNav}
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
              onPress={() => openModal('ReceiveModal')}
            />
            <Text variant="titleMedium" style={styles.actionText}>
              Receive
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 8
  },
  nameText: {
    textAlign: 'center',
    ...globalStyles.textMedium
  },
  logoContainer: {
    marginVertical: 8
  },
  networkLogo: {
    width: 4 * FONT_SIZE['xl'],
    height: 4 * FONT_SIZE['xl']
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 24
  },
  addressText: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.textMedium,
    marginBottom: -2,
    color: COLORS.primary
  },
  balanceContainer: {
    alignItems: 'center'
  },
  balanceText: {
    textAlign: 'center',
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
  }
});

export default MainBalance;
