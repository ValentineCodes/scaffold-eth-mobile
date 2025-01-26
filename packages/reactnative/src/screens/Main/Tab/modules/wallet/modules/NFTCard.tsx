import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { NFTToken } from '../../../../../../store/reducers/NFTs';
import { parseIPFS } from '../../../../../../utils/helperFunctions';

type Props = {
  token: NFTToken;
};

export default function NFTCard({ token }: Props) {
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
      onPress={() => openModal('NFTDetailsModal')}
      style={styles.nftImage}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: '100%' }}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nftImage: {
    width: 100,
    height: 100,
    backgroundColor: 'cyan',
    borderRadius: 10
  }
});
