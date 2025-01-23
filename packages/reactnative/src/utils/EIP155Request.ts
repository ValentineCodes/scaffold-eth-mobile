import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { JsonRpcProvider, Wallet } from 'ethers';
import {
  EIP155_CHAINS,
  EIP155_SIGNING_METHODS,
  TEIP155Chain
} from '../data/EIP155';
import { useSecureStorage } from '../hooks/useSecureStorage';
import {
  getSignParamsMessage,
  getSignTypedDataParamsData
} from './helperFunctions';

export async function approveEIP155Request(
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const { getItem } = useSecureStorage();

  let connectedAccount: string;

  if (request.method === 'personal_sign') {
    connectedAccount = request.params[1];
  } else if (request.method === 'eth_sendTransaction') {
    connectedAccount = request.params[0].from;
  } else {
    connectedAccount = '';
  }

  const accounts = await getItem('accounts');
  const activeAccount = Array.from(accounts).find(
    account => account.address.toLowerCase() == connectedAccount.toLowerCase()
  );

  const wallet = new Wallet(activeAccount.privateKey);

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
        message: data
      } = getSignTypedDataParamsData(request.params);
      delete types.EIP712Domain;
      const signedData = await wallet.signTypedData(domain, types, data);
      return formatJsonRpcResult(id, signedData);

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const provider = new JsonRpcProvider(
        EIP155_CHAINS[chainId as TEIP155Chain].rpc
      );
      const sendTransaction = request.params[0];

      if (sendTransaction.hasOwnProperty('gas')) {
        delete sendTransaction.gas;
      }

      const connectedWallet = wallet.connect(provider);
      const { hash } = await connectedWallet.sendTransaction(sendTransaction);
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
  request: SignClientTypes.EventArguments['session_request']
) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message);
}
