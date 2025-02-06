import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { Network, switchNetwork } from '../../store/reducers/Networks';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function SwitchNetworkModal({ modal: { closeModal } }: Props) {
  const networks: Network[] = useSelector((state: any) => state.networks);
  const network = useNetwork();

  const dispatch = useDispatch();

  const handleNetworkSelecttion = (id: number) => {
    closeModal();
    dispatch(switchNetwork(id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge">Switch Network</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            You are currently connected to {network.name}
          </Text>
        </View>

        <IconButton
          icon="close"
          size={FONT_SIZE['xl'] * 1.5}
          onPress={closeModal}
          style={{ alignSelf: 'center' }}
        />
      </View>

      <ScrollView>
        {networks.map((_network: Network) => (
          <Pressable
            key={_network.id}
            onPress={() =>
              !_network.isConnected && handleNetworkSelecttion(_network.id)
            }
            style={styles.networkContainer}
          >
            <View style={styles.networkInfo}>
              <Text
                variant="titleMedium"
                style={[
                  styles.networkName,
                  _network.isConnected && styles.networkNameActive
                ]}
              >
                {_network.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.networkChainId,
                  _network.isConnected && styles.networkChainIdActive
                ]}
              >
                Chain ID: {_network.id.toString()}
              </Text>
            </View>
            {_network.isConnected && (
              <IconButton icon="check" size={24} iconColor={COLORS.primary} />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: WINDOW_WIDTH * 0.9,
    maxHeight: WINDOW_HEIGHT * 0.7
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  subtitle: {
    color: '#666'
  },
  networkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  },
  networkItemActive: {
    backgroundColor: COLORS.primaryLight
  },
  networkInfo: {
    gap: 4
  },
  networkName: {
    fontSize: FONT_SIZE.lg
  },
  networkNameActive: {
    color: COLORS.primary
  },
  networkChainId: {
    color: '#666'
  },
  networkChainIdActive: {
    color: COLORS.primary
  }
});
