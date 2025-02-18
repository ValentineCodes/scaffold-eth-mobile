import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { Network, switchNetwork } from '../../store/reducers/Networks';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function SwitchNetworkModal({ modal: { closeModal } }: Props) {
  const networks: Network[] = useSelector((state: any) => state.networks);

  const dispatch = useDispatch();

  const handleNetworkSelecttion = (id: number) => {
    closeModal();
    dispatch(switchNetwork(id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={globalStyles.text}>
          Switch Network
        </Text>

        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={closeModal}
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
              <Ionicons
                name="checkmark-outline"
                size={24}
                color={COLORS.primary}
              />
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
    fontSize: FONT_SIZE.lg,
    ...globalStyles.textMedium
  },
  networkNameActive: {
    color: COLORS.primary
  },
  networkChainId: {
    color: '#666',
    ...globalStyles.text
  },
  networkChainIdActive: {
    color: COLORS.primary
  }
});
