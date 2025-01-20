import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ethers } from "../../patches/ethers";
import { addAccount } from "../store/reducers/Accounts";
import { useSecureStorage } from "./useSecureStorage";

export interface Controller {
  address: string;
  privateKey: string;
}

/**
 * @notice hook to read and write mnemonic
 */
export default function useWallet() {
  const [mnemonic, setMnemonic] = useState("");
  const [controller, setAccounts] = useState<Controller[]>([]);

  const { saveItem, getItem } = useSecureStorage();

  const dispatch = useDispatch();

  /**
   * @notice reads mnemonic from secure storage
   * @returns mnemonic string
   */
  async function _getMnemonic(): Promise<string> {
    // read mnemonic from secure storage
    const _mnemonic = (await getItem("mnemonic")) as string;

    setMnemonic(_mnemonic);

    return _mnemonic;
  }

  async function getController(): Promise<Controller> {
    // read controller from secure storage
    const controller = (await getItem("controller")) as Controller;

    setAccounts([controller]);

    return controller;
  }

  /**
   * @notice encrypts and stores mnemonic in secure storage
   * @param _mnemonic mnemonic string
   */
  async function _storeMnemonic(_mnemonic: string) {
    setMnemonic(_mnemonic);

    // encrypt and store mnemonic
    await saveItem("mnemonic", _mnemonic);
  }

  /**
   * encrypts and stores account data in secure and redux storage
   * @param _controller address and private key of account
   * @param _isImported `true` if account was imported using private key
   */
  async function _storeAccount(_controller: Controller, _isImported: boolean) {
    // read controller from secure storage
    const controller = (await getItem("controller")) as Controller;

    const newAccounts = [controller, _controller];

    // encrypt and store controller
    await saveItem("controller", JSON.stringify(newAccounts));

    setAccounts(newAccounts);

    dispatch(
      addAccount({ address: _controller.address, isImported: _isImported }),
    );
  }

  async function createWallet() {
    let privateSeed = ethers.randomBytes(16);

    //2048 words
    const mnemonic = ethers.Mnemonic.entropyToPhrase(privateSeed);

    const hdnode = ethers.HDNodeWallet.fromPhrase(
      mnemonic,
      "mnemonicPassword",
      "m/44'/60'/0'/0/0",
    );

    return {
      mnemonic,
      address: hdnode.address,
      privateKey: hdnode.privateKey,
    };
  }

  async function importWallet(_mnemonic: string, _index: number) {
    const hdnode = ethers.HDNodeWallet.fromPhrase(
      mnemonic,
      "mnemonicPassword",
      `m/44'/60'/0'/0/${_index}`,
    );

    return {
      mnemonic,
      address: hdnode.address,
      privateKey: hdnode.privateKey,
    };
  }

  useEffect(() => {
    _getMnemonic();
    getController();
  }, []);

  return {
    mnemonic,
    controller,
    getMnemonic: _getMnemonic,
    getController: getController,
    storeMnemonic: _storeMnemonic,
    storeAccount: _storeAccount,
    createWallet,
    importWallet,
  };
}
