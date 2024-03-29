import {
    EIP155_CHAINS,
    EIP155_SIGNING_METHODS,
    TEIP155Chain,
  } from '../data/EIP155';
  import {eip155Wallets} from './EIP155Wallet';
  import {
    getSignParamsMessage,
    getSignTypedDataParamsData,
    getWalletAddressFromParams,
  } from './helperFunctions';
  import {formatJsonRpcError, formatJsonRpcResult} from '@json-rpc-tools/utils';
  import {SignClientTypes} from '@walletconnect/types';
  import {getSdkError} from '@walletconnect/utils';
  import {Wallet, providers, ethers} from 'ethers';
  import SInfo from "react-native-sensitive-info";
  
  export async function approveEIP155Request(
    requestEvent: SignClientTypes.EventArguments['session_request'],
  ) {
    const {params, id} = requestEvent;
    const {chainId, request} = params;

    let connectedAccount: string;

    if(request.method === "personal_sign") {
      connectedAccount = request.params[1]
    } else if(request.method === "eth_sendTransaction") {
      connectedAccount = request.params[0].from
    } else {
      connectedAccount = ""
    }

    const accounts = await SInfo.getItem("accounts", {
        sharedPreferencesName: "sern.android.storage",
        keychainService: "sern.ios.storage",
    })

    const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == connectedAccount.toLowerCase())

    const wallet = new ethers.Wallet(activeAccount.privateKey)

    switch (request.method) {
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        const message = getSignParamsMessage(request.params);
        const signedMessage = await wallet.signMessage(message);
        return formatJsonRpcResult(id, signedMessage);
  
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        const {
          domain,
          types,
          message: data,
        } = getSignTypedDataParamsData(request.params);
        // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
        delete types.EIP712Domain;
        const signedData = await wallet._signTypedData(domain, types, data);
        return formatJsonRpcResult(id, signedData);
  
      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        const provider = new providers.JsonRpcProvider(
          EIP155_CHAINS[chainId as TEIP155Chain].rpc,
        );
        const sendTransaction = request.params[0];

        if(sendTransaction.hasOwnProperty("gas")) {
          delete sendTransaction.gas
        }

        const connectedWallet = wallet.connect(provider);
        const {hash} = await connectedWallet.sendTransaction(sendTransaction);
        return formatJsonRpcResult(id, hash);
  
      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        const signTransaction = request.params[0];
        const signature = await wallet.signTransaction(signTransaction);
        return formatJsonRpcResult(id, signature);
  
      default:
        throw new Error(getSdkError('INVALID_METHOD').message);
    }
  }
  
  export function rejectEIP155Request(
    request: SignClientTypes.EventArguments['session_request'],
  ) {
    const {id} = request;
  
    return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message);
  }
  