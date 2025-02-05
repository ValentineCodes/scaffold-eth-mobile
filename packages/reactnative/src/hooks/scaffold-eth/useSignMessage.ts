import { JsonRpcProvider, Wallet } from 'ethers';
import { useModal } from 'react-native-modalfy';
import { useSecureStorage } from '../useSecureStorage';
import useAccount from './useAccount';
import useNetwork from './useNetwork';

interface UseSignMessageConfig {
  message?: string;
}

/**
 *
 * @param config - The config settings
 * @param config.message - The message to sign
 */
export default function useSignMessage({ message }: UseSignMessageConfig) {
  const messageToSign = message;

  const { openModal } = useModal();
  const network = useNetwork();
  const connectedAccount = useAccount();
  const { getItem } = useSecureStorage();

  const signMessage = async (
    config: UseSignMessageConfig = {
      message: undefined
    }
  ): Promise<string> => {
    const { message } = config;
    const _message = message || messageToSign;

    return new Promise((resolve, reject) => {
      openModal('SignMessageModal', { message: _message, onReject, onConfirm });

      function onReject() {
        reject('Signing Rejected!');
      }

      async function onConfirm() {
        try {
          const provider = new JsonRpcProvider(network.provider);

          const accounts = await getItem('accounts');

          const activeAccount = Array.from(accounts).find(
            account =>
              account.address.toLowerCase() ==
              connectedAccount.address.toLowerCase()
          );

          const wallet = new Wallet(activeAccount.privateKey, provider);

          const signature = await wallet.signMessage(_message);

          resolve(signature);
        } catch (error) {
          reject(error);
        }
      }
    });
  };

  return {
    signMessage
  };
}
