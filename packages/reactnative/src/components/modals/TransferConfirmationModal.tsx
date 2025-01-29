import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {
  ethers,
  formatEther,
  JsonRpcProvider,
  parseEther,
  TransactionReceipt,
  Wallet
} from 'ethers';
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { Account } from '../../store/reducers/Accounts';
import { addRecipient } from '../../store/reducers/Recipients';
import { parseFloat, truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';
import Blockie from '../Blockie';
import CustomButton from '../Button';
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
    return String(
      estimateGasCost &&
        parseFloat(
          (txData.amount + Number(formatEther(estimateGasCost))).toString(),
          8
        )
    );
  };

  const transfer = async () => {
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
                <Text variant="titleLarge" style={styles.accountName}>
                  {txData.from.name}
                </Text>
                <Text variant="bodyMedium">
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
            <Text variant="titleLarge" style={styles.accountName}>
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
              <Text variant="titleMedium">Estimated gas fee</Text>
              <Text variant="bodySmall" style={styles.gasEstimate}>
                Likely in &lt; 30 second
              </Text>
            </View>
            <Text variant="titleMedium" style={styles.detailsValue}>
              {String(
                estimateGasCost &&
                  parseFloat(ethers.formatEther(estimateGasCost), 8)
              )}{' '}
              {network.currencySymbol}
            </Text>
          </View>

          {isNativeToken && (
            <>
              <Divider />

              <View style={styles.detailsRow}>
                <Text variant="titleMedium">Total</Text>
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
            buttonColor="#ffebee"
            style={styles.cancelButton}
            onPress={() => closeModal()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Button>
          <CustomButton
            text="Confirm"
            loading={isTransferring}
            onPress={transfer}
            style={styles.confirmButton}
          />
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
    gap: 16
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    fontWeight: '500'
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
  accountName: {
    fontWeight: '500'
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
    fontWeight: '500',
    marginBottom: -16
  },
  amount: {
    textAlign: 'center',
    fontWeight: 'bold'
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
  gasEstimate: {
    color: '#27B858'
  },
  detailsValue: {
    width: '50%',
    textAlign: 'right'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cancelButton: {
    width: '50%',
    borderRadius: 0
  },
  cancelButtonText: {
    color: '#ef5350'
  },
  confirmButton: {
    width: '50%',
    borderRadius: 0
  }
});
