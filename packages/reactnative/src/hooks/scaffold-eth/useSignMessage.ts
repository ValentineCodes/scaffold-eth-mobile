import { JsonRpcProvider, Wallet } from 'ethers';
import { useModal } from 'react-native-modalfy';
import { useSecureStorage } from '../useSecureStorage';
import useAccount from './useAccount';
import useNetwork from './useNetwork';

interface UseSignMessageConfig {
  message?: string | Uint8Array<ArrayBufferLike>;
}

interface UseSignMessageReturn {
  signMessage: (config?: UseSignMessageConfig) => Promise<string>;
}

/**
 * Hook for signing messages using the connected wallet.
 *
 * @param {UseSignMessageConfig} config - Optional configuration.
 * @param {string} [config.message] - Default message to sign (can be overridden).
 * @returns {UseSignMessageReturn} An object containing the `signMessage` function.
 */
export default function useSignMessage({
  message
}: UseSignMessageConfig = {}): UseSignMessageReturn {
  const { openModal } = useModal();
  const network = useNetwork();
  const connectedAccount = useAccount();
  const { getItem } = useSecureStorage();

  /**
   * Signs a message using the connected wallet.
   *
   * @param {UseSignMessageConfig} [config] - Optional override for the default message.
   * @returns {Promise<string>} A promise that resolves to the signed message.
   * @throws {Error} If signing fails or is rejected.
   */
  const signMessage = async (
    config?: UseSignMessageConfig
  ): Promise<string> => {
    const messageToSign = config?.message || message;
    if (!messageToSign) {
      throw new Error('No message provided for signing.');
    }

    return new Promise((resolve, reject) => {
      openModal('SignMessageModal', {
        message: messageToSign,
        onReject,
        onConfirm
      });

      function onReject() {
        reject(new Error('Message signing was rejected.'));
      }

      async function onConfirm() {
        try {
          const provider = new JsonRpcProvider(network.provider);
          const accounts = await getItem('accounts');

          if (!accounts || !Array.isArray(accounts)) {
            throw new Error('No accounts found in secure storage.');
          }

          const activeAccount = accounts.find(
            (account: { address: string }) =>
              account.address.toLowerCase() ===
              connectedAccount.address.toLowerCase()
          );

          if (!activeAccount) {
            throw new Error('Active account not found.');
          }

          const wallet = new Wallet(activeAccount.privateKey, provider);
          const signature = await wallet.signMessage(messageToSign!);
          console.log(signature);
          resolve(signature);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      }
    });
  };

  return { signMessage };
}
