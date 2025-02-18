import React from 'react';
import { useModal } from 'react-native-modalfy';
import { IconButton } from 'react-native-paper';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  onScan: (value: string) => void;
};

export default function ScanButton({ onScan }: Props) {
  const { openModal } = useModal();

  const scan = () => {
    openModal('QRCodeScanner', {
      onScan
    });
  };

  return (
    <IconButton
      icon={() => (
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={1.3 * FONT_SIZE['xl']}
          color="black"
        />
      )}
      onPress={scan}
    />
  );
}
