import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import CopyableText from '../../../../../components/CopyableText';
import ReceiveModal from '../../../../../components/modals/ReceiveModal';
import useAccount from '../../../../../hooks/scaffold-eth/useAccount';
import useBalance from '../../../../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../../../../hooks/scaffold-eth/useNetwork';
import { COLORS } from '../../../../../utils/constants';
import { truncateAddress } from '../../../../../utils/helperFunctions';
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

  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const navigation = useNavigation();

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

  return (
    <ScrollView
      style={{ flexGrow: 0 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
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
            {balance !== '' && `${balance} ${network.currencySymbol}`}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.actionContainer}>
          <View style={styles.actionButton}>
            <IconButton
              icon={() => (
                <Ionicons name="paper-plane" size={24} color={COLORS.primary} />
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
                <Ionicons name="download" size={24} color={COLORS.primary} />
              )}
              mode="contained"
              containerColor={COLORS.primaryLight}
              size={48}
              onPress={() => setShowReceiveModal(true)}
            />
            <Text variant="titleMedium" style={styles.actionText}>
              Receive
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <ReceiveModal
          isVisible={showReceiveModal}
          onClose={() => setShowReceiveModal(false)}
        />
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
    fontWeight: 'bold',
    textAlign: 'center'
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
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 15
  },
  addressText: {
    fontWeight: '700',
    fontSize: FONT_SIZE['md'],
    color: COLORS.primary
  },
  balanceContainer: {
    alignItems: 'center'
  },
  balanceText: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  divider: {
    width: '100%',
    marginVertical: 8
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40
  },
  actionButton: {
    alignItems: 'center'
  },
  actionText: {
    marginTop: 8,
    fontWeight: 'bold'
  }
});

export default MainBalance;
