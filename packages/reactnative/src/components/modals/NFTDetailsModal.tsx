import { Address } from 'abitype';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { removeNFT } from '../../store/reducers/NFTs';
import { COLORS } from '../../utils/constants';
import { WINDOW_WIDTH } from '../../utils/styles';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      nft: {
        address: Address;
        name: string;
        symbol: string;
        id: number;
        uri: string;
      };
    };
  };
};

export default function NFTDetailsModal({
  modal: {
    closeModal,
    params: { nft }
  }
}: Props) {
  const dispatch = useDispatch();
  const network = useNetwork();
  const account = useAccount();

  const remove = () => {
    closeModal();
    dispatch(
      removeNFT({
        networkId: network.id,
        accountAddress: account.address,
        nftAddress: nft.address,
        tokenId: nft.id
      })
    );
  };
  return (
    <Pressable onPress={closeModal} style={styles.container}>
      <View style={styles.nftImageContainer}>
        <Image
          source={require('../../assets/images/nft.webp')}
          style={styles.nftImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.nftInfoContainer}>
        <Text style={styles.nftTitle}>
          {nft.name} #{nft.id}
        </Text>

        <View style={styles.actionButtonsContainer}>
          <Button
            type="outline"
            text="Send"
            onPress={() => null}
            style={styles.sendBtn}
          />
          <IconButton
            icon="trash-can-outline"
            size={WINDOW_WIDTH * 0.07}
            iconColor={COLORS.primary}
            onPress={remove}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WINDOW_WIDTH
  },
  nftImageContainer: {
    width: '97%',
    height: WINDOW_WIDTH,
    backgroundColor: 'cyan',
    marginTop: 50
  },
  nftImage: {
    width: '100%',
    height: '100%'
  },
  nftInfoContainer: {
    backgroundColor: 'white',
    width: WINDOW_WIDTH,
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  nftTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  sendBtn: {
    width: '90%'
  }
});
