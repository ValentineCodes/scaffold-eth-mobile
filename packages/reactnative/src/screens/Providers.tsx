import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  createModalStack,
  ModalOptions,
  ModalProvider
} from 'react-native-modalfy';
import { Provider as PaperProvider } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider as ReduxProvider } from 'react-redux';
import AccountsSelectionModal from '../components/modals/AccountsSelectionModal';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import ImportNFTModal from '../components/modals/ImportNFTModal';
import ImportTokenModal from '../components/modals/ImportTokenModal';
import NFTDetailsModal from '../components/modals/NFTDetailsModal';
import QRCodeScanner from '../components/modals/QRCodeScanner';
import SignMessageModal from '../components/modals/SignMessageModal';
import SignTransactionModal from '../components/modals/SignTransactionModal';
import SignTransferModal from '../components/modals/SignTransferModal';
import TransferConfirmationModal from '../components/modals/TransferConfirmationModal';
import TxReceiptModal from '../components/modals/TxReceiptModal';
import { store } from '../store';

const theme = {
  colors: {
    primary: '#27B858',
    accent: '#f1c40f',
    background: '#ffffff',
    surface: '#ffffff',
    error: '#B00020'
  }
};

type Props = {
  children: React.ReactNode;
};

const modalConfig = {
  ImportTokenModal,
  ImportNFTModal,
  ChangePasswordModal,
  SignTransactionModal,
  SignMessageModal,
  TxReceiptModal,
  SignTransferModal,
  NFTDetailsModal,
  QRCodeScanner,
  TransferConfirmationModal,
  AccountsSelectionModal
};
const defaultOptions: ModalOptions = {
  backdropOpacity: 0.6,
  disableFlingGesture: true
};

const modalStack = createModalStack(modalConfig, defaultOptions);

export default function Providers({ children }: Props) {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <MenuProvider>
          <ToastProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaProvider>
                <ModalProvider stack={modalStack}>{children}</ModalProvider>
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </ToastProvider>
        </MenuProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
