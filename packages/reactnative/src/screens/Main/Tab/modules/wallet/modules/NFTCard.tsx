import { useNavigation } from '@react-navigation/native';
import { Address } from 'abitype';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { parseIPFS } from '../../../../../../utils/helperFunctions';
import { WINDOW_WIDTH } from '../../../../../../utils/styles';

type Props = {
  token: {
    address: Address;
    name: string;
    symbol: string;
    id: number;
    uri: string;
  };
};

export default function NFTCard({ token }: Props) {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);

  const { openModal } = useModal();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const _tokenURI = parseIPFS(token.uri);
        const _token = await (await fetch(_tokenURI)).json();

        if (_token) {
          const imageURI = parseIPFS(_token.image);
          setImage(imageURI);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchImage();
  }, [token]);
  return (
    <Pressable
      onPress={() =>
        openModal('NFTDetailsModal', {
          nft: token,
          onSend: () => {
            navigation.navigate('NFTTokenTransfer', {
              token: {
                address: token.address,
                id: token.id,
                symbol: token.symbol
              }
            });
          }
        })
      }
      style={styles.nftImage}
    >
      <Image
        source={require('../../../../../../assets/images/nft.webp')}
        style={{ width: '100%', height: '100%' }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nftImage: {
    width: WINDOW_WIDTH * 0.25,
    height: WINDOW_WIDTH * 0.25,
    backgroundColor: 'cyan',
    borderRadius: 10
  }
});
