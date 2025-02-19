import { ethers, formatEther, TransactionReceipt } from 'ethers';
import React, { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { Account } from '../../store/reducers/Accounts';
import globalStyles from '../../styles/globalStyles';
import { parseFloat, truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Blockie from '../Blockie';
import Fail from './modules/Fail';
import Success from './modules/Success';

interface TxData {
  from: Account;
  to: string;
  amount: number;
  balance: bigint | null;
}
type Props = {
  modal: {
    closeModal: (modal?: string, callback?: () => void) => void;
    params: {
      txData: TxData;
      estimateGasCost: bigint | null;
      token: string;
      isNativeToken: boolean;
      onTransfer: () => Promise<TransactionReceipt | undefined>;
    };
  };
};

export default function TransferConfirmationModal({
  modal: {
    closeModal,
    params: { txData, estimateGasCost, token, isNativeToken, onTransfer }
  }
}: Props) {
  const toast = useToast();

  const network = useNetwork();

  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [txReceipt, setTxReceipt] = useState<ethers.TransactionReceipt | null>(
    null
  );

  const formatBalance = () => {
    return txData.balance && Number(formatEther(txData.balance))
      ? parseFloat(Number(formatEther(txData.balance)).toString(), 4)
      : 0;
  };

  const calcTotal = () => {
    return estimateGasCost
      ? parseFloat(
          (txData.amount + Number(formatEther(estimateGasCost))).toString(),
          8
        )
      : null;
  };

  const transfer = async () => {
    if (isTransferring) return;
    try {
      setIsTransferring(true);

      const txReceipt = await onTransfer();

      if (!txReceipt) return;

      setTxReceipt(txReceipt);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      setShowFailModal(true);
      return;
    } finally {
      setIsTransferring(false);
    }
  };

  const viewTxDetails = async () => {
    if (!network.blockExplorer || !txReceipt) return;

    try {
      await Linking.openURL(`${network.blockExplorer}/tx/${txReceipt.hash}`);
    } catch (error) {
      toast.show('Cannot open url', {
        type: 'danger'
      });
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            From:
          </Text>

          <View style={styles.accountContainer}>
            <View style={styles.accountInfo}>
              <Blockie
                address={txData.from.address}
                size={1.8 * FONT_SIZE['xl']}
              />

              <View style={styles.accountDetails}>
                <Text
                  style={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}
                >
                  {txData.from.name}
                </Text>
                <Text variant="bodyMedium" style={globalStyles.text}>
                  Balance: {formatBalance()} {token}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            To:
          </Text>

          <View style={styles.recipientContainer}>
            <Blockie address={txData.to} size={1.8 * FONT_SIZE['xl']} />
            <Text style={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}>
              {truncateAddress(txData.to)}
            </Text>
          </View>
        </View>

        <Text variant="titleMedium" style={styles.amountLabel}>
          AMOUNT
        </Text>
        <Text variant="headlineLarge" style={styles.amount}>
          {txData.amount} {token}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <View>
              <Text variant="titleMedium" style={globalStyles.textMedium}>
                Estimated gas fee
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: 'green', ...globalStyles.text }}
              >
                Likely in &lt; 30 second
              </Text>
            </View>
            <Text variant="titleMedium" style={styles.detailsValue}>
              {estimateGasCost
                ? parseFloat(ethers.formatEther(estimateGasCost), 8).toString()
                : null}{' '}
              {network.currencySymbol}
            </Text>
          </View>

          {isNativeToken && (
            <>
              <Divider />

              <View style={styles.detailsRow}>
                <Text variant="titleMedium" style={globalStyles.textMedium}>
                  Total
                </Text>
                <Text variant="titleMedium" style={styles.detailsValue}>
                  {calcTotal()} {network.currencySymbol}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => (isTransferring ? null : closeModal())}
            buttonColor="#FFCDD2"
            style={{ flex: 1, paddingVertical: 4, borderRadius: 30 }}
            labelStyle={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={transfer}
            loading={isTransferring}
            style={{ flex: 1, paddingVertical: 4, borderRadius: 30 }}
            labelStyle={{
              fontSize: FONT_SIZE['lg'],
              ...globalStyles.text,
              color: 'white'
            }}
          >
            Confirm
          </Button>
        </View>
      </View>

      <Success
        isVisible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          closeModal();
        }}
        onViewDetails={viewTxDetails}
      />

      <Fail
        isVisible={showFailModal}
        onClose={() => setShowFailModal(false)}
        onRetry={() => {
          setShowFailModal(false);
          transfer();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    width: WINDOW_WIDTH * 0.9,
    gap: 16
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  },
  accountContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 8
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  accountDetails: {
    width: '75%'
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 8
  },
  amountLabel: {
    textAlign: 'center',
    marginBottom: -16,
    ...globalStyles.textMedium
  },
  amount: {
    textAlign: 'center',
    ...globalStyles.textSemiBold
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10
  },
  detailsRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  detailsValue: {
    width: '50%',
    textAlign: 'right',
    ...globalStyles.textMedium
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12
  }
});
