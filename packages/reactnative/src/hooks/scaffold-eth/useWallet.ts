import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSecureStorage } from '.';
import { ethers } from '../../../patches/ethers';
import { addAccount } from '../../store/reducers/Accounts';

export interface Wallet {
  address: string;
  privateKey: string;
}

/**
 * @notice hook to read and write mnemonic
 */
export const useWallet = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallet, setAccounts] = useState<Wallet[]>([]);

  const { saveItem, getItem } = useSecureStorage();

  const dispatch = useDispatch();

  /**
   * @notice reads mnemonic from secure storage
   * @returns mnemonic string
   */
  async function _getMnemonic(): Promise<string> {
    // read mnemonic from secure storage
    const _mnemonic = (await getItem('seedPhrase')) as string;

    setMnemonic(_mnemonic);

    return _mnemonic;
  }

  async function getWallet(): Promise<Wallet> {
    // read wallet from secure storage
    const wallet = (await getItem('wallet')) as Wallet;

    setAccounts([wallet]);

    return wallet;
  }

  /**
   * @notice encrypts and stores mnemonic in secure storage
   * @param _mnemonic mnemonic string
   */
  async function _storeMnemonic(_mnemonic: string) {
    setMnemonic(_mnemonic);

    // encrypt and store mnemonic
    await saveItem('mnemonic', _mnemonic);
  }

  /**
   * encrypts and stores account data in secure and redux storage
   * @param _wallet address and private key of account
   */
  async function _storeAccount(_wallet: Wallet) {
    // read wallet from secure storage
    const wallet = (await getItem('wallet')) as Wallet;

    const newAccounts = [wallet, _wallet];

    // encrypt and store wallet
    await saveItem('wallet', JSON.stringify(newAccounts));

    setAccounts(newAccounts);

    dispatch(addAccount({ address: _wallet.address }));
  }

  function createWallet() {
    let privateSeed = ethers.randomBytes(16);

    //2048 words
    const mnemonic = ethers.Mnemonic.entropyToPhrase(privateSeed);

    const hdnode = ethers.HDNodeWallet.fromPhrase(
      mnemonic,
      undefined,
      "m/44'/60'/0'/0/0"
    );

    return {
      mnemonic,
      address: hdnode.address,
      privateKey: hdnode.privateKey
    };
  }

  function importWallet(_mnemonic: string, _index: number) {
    const hdnode = ethers.HDNodeWallet.fromPhrase(
      _mnemonic,
      undefined,
      `m/44'/60'/0'/0/${_index}`
    );

    return {
      mnemonic: _mnemonic,
      address: hdnode.address,
      privateKey: hdnode.privateKey
    };
  }

  useEffect(() => {
    _getMnemonic();
    getWallet();
  }, []);

  return {
    mnemonic,
    wallet,
    getMnemonic: _getMnemonic,
    getWallet: getWallet,
    storeMnemonic: _storeMnemonic,
    storeAccount: _storeAccount,
    createWallet,
    importWallet
  };
};
