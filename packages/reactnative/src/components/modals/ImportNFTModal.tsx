import { Address } from 'abitype';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch } from 'react-redux';
import {
  useAccount,
  useERC721Metadata,
  useNetwork,
  useNFTs
} from '../../hooks/scaffold-eth';
import { addNFT } from '../../store/reducers/NFTs';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Button from '../buttons/CustomButton';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function ImportNFTModal({ modal: { closeModal } }: Props) {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [tokenId, setTokenId] = useState<string | undefined>(undefined);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [tokenIdError, setTokenIdError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const account = useAccount();
  const network = useNetwork();

  const dispatch = useDispatch();

  const { getERC721Metadata } = useERC721Metadata();

  const { nftExists } = useNFTs();

  const toast = useToast();

  const importNFT = async () => {
    try {
      if (!ethers.isAddress(address)) {
        setAddressError('Invalid address');
        return;
      }

      if (!tokenId) {
        setTokenIdError('Invalid token id');
        return;
      }

      if (nftExists(address, Number(tokenId))) {
        toast.show('Token already exists!', { type: 'danger' });
        return;
      }

      if (addressError || tokenIdError) {
        setAddressError(null);
        setTokenIdError(null);
      }

      setIsImporting(true);

      const nftMetadata = await getERC721Metadata(
        address as Address,
        tokenId as Address
      );

      const payload = {
        networkId: network.id,
        accountAddress: account.address,
        nft: {
          address: address as Address,
          name: nftMetadata?.name,
          symbol: nftMetadata?.symbol,
          tokenId: tokenId as Address,
          tokenURI: nftMetadata?.tokenURI
        }
      };

      closeModal();
      dispatch(addNFT(payload));
    } catch (error) {
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: FONT_SIZE['xl'], ...globalStyles.text }}>
          Import NFT
        </Text>
        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={closeModal}
        />
      </View>

      <View style={styles.content}>
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium" style={globalStyles.textMedium}>
            Address
          </Text>
          <TextInput
            value={address}
            mode="outlined"
            outlineColor={COLORS.primary}
            activeOutlineColor={COLORS.primary}
            outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
            contentStyle={globalStyles.text}
            placeholder={'0x...'}
            onChangeText={setAddress}
            onSubmitEditing={importNFT}
          />
          {addressError ? (
            <Text
              variant="bodySmall"
              style={{ color: COLORS.error, ...globalStyles.text }}
            >
              {addressError}
            </Text>
          ) : null}
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="titleMedium" style={globalStyles.textMedium}>
            Token ID
          </Text>
          <TextInput
            value={tokenId}
            mode="outlined"
            outlineColor={COLORS.primary}
            activeOutlineColor={COLORS.primary}
            outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
            contentStyle={globalStyles.text}
            placeholder={'Enter the token id'}
            onChangeText={setTokenId}
            onSubmitEditing={importNFT}
          />
          {tokenIdError ? (
            <Text
              variant="bodySmall"
              style={{ color: COLORS.error, ...globalStyles.text }}
            >
              {tokenIdError}
            </Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            type="outline"
            text="Cancel"
            onPress={closeModal}
            style={styles.button}
          />
          <Button
            text="Import"
            onPress={importNFT}
            loading={isImporting}
            disabled={isImporting}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20,
    width: WINDOW_WIDTH * 0.9
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  content: {
    gap: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%'
  },
  button: {
    marginTop: 10,
    width: '50%'
  }
});
