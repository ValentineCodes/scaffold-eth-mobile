import { Address } from 'abitype';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch } from 'react-redux';
import { useAccount, useNetwork } from '../../hooks/scaffold-eth';
import { removeNFT } from '../../store/reducers/NFTs';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { parseIPFS } from '../../utils/scaffold-eth';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Button from '../buttons/CustomButton';

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
      onSend: () => void;
    };
  };
};

export default function NFTDetailsModal({
  modal: {
    closeModal,
    params: { nft, onSend }
  }
}: Props) {
  const dispatch = useDispatch();
  const network = useNetwork();
  const account = useAccount();

  const [image, setImage] = useState('');

  const send = () => {
    closeModal();
    onSend();
  };

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

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const _nftURI = parseIPFS(nft.uri);
        const _nft = await (await fetch(_nftURI)).json();

        if (_nft) {
          const imageURI = _nft.image.replace(
            'https://ipfs.io/ipfs/',
            'https://api.universalprofile.cloud/ipfs/'
          );

          setImage(imageURI);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchImage();
  }, [nft]);

  return (
    <Pressable onPress={closeModal} style={styles.container}>
      <View style={styles.nftImageContainer}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.nftImage}
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.nftInfoContainer}>
        <Text style={styles.nftTitle}>
          {nft.name} #{Number(nft.id).toLocaleString('en-US')}
        </Text>

        <View style={styles.actionButtonsContainer}>
          <Button
            type="outline"
            text="Send"
            onPress={send}
            style={styles.sendBtn}
          />
          <Ionicons
            name="trash-outline"
            size={WINDOW_WIDTH * 0.07}
            color={COLORS.primary}
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
    marginTop: 10
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
    fontSize: FONT_SIZE['xl'],
    ...globalStyles.textMedium
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
