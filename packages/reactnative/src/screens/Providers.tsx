import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";
import { store } from "../store";
import { ToastProvider } from "react-native-toast-notifications";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ModalOptions,
  ModalProvider,
  createModalStack,
} from "react-native-modalfy";

import SignTransactionModal from "../components/modals/SignTransactionModal";
import SignMessageModal from "../components/modals/SignMessageModal";
import TxReceiptModal from "../components/modals/TxReceiptModal";
import SignTransferModal from "../components/modals/SignTransferModal";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";

const theme = {
  colors: {
    primary: '#27B858',
    accent: '#f1c40f',
    background: '#ffffff',
    surface: '#ffffff',
    error: '#B00020',
  },
};

type Props = {
  children: React.ReactNode;
};

const modalConfig = {
  ChangePasswordModal,
  SignTransactionModal,
  SignMessageModal,
  TxReceiptModal,
  SignTransferModal,
};
const defaultOptions: ModalOptions = {
  backdropOpacity: 0.6,
  disableFlingGesture: true,
};

const modalStack = createModalStack(modalConfig, defaultOptions);

export default function Providers({ children }: Props) {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <MenuProvider>
          <ToastProvider>
            <SafeAreaProvider>
              <ModalProvider stack={modalStack}>{children}</ModalProvider>
            </SafeAreaProvider>
          </ToastProvider>
        </MenuProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
