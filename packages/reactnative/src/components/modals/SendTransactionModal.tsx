import { SignClientTypes } from '@walletconnect/types';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import {
  approveEIP155Request,
  rejectEIP155Request
} from '../../utils/EIP155Request';
import { handleDeepLinkRedirect } from '../../utils/LinkingUtils';
import { web3wallet } from '../../utils/Web3WalletClient';
import { AcceptRejectButton } from '../AcceptRejectButton';
import { Tag } from '../Tag';
import { Message } from './modules/Message';
import { Methods } from './modules/Methods';
import { ModalHeader } from './modules/ModalHeader';

interface SendTransactionModalProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  requestEvent: SignClientTypes.EventArguments['session_request'] | undefined;
  requestSession: any;
}

export function SendTransactionModal({
  visible,
  setVisible,
  requestEvent,
  requestSession
}: SendTransactionModalProps) {
  const chainID = requestEvent?.params?.chainId?.toUpperCase();
  const method = requestEvent?.params?.request?.method;

  const requestName = requestSession?.peer?.metadata?.name;
  const requestIcon = requestSession?.peer?.metadata?.icons[0];
  const requestURL = requestSession?.peer?.metadata?.url;
  const requestMetadata: SignClientTypes.Metadata =
    requestSession?.peer?.metadata;

  const { topic, params } = requestEvent;
  const { request } = params;
  const transaction = request.params[0];

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  function onRedirect() {
    handleDeepLinkRedirect(requestMetadata?.redirect);
  }

  async function onApprove() {
    if (requestEvent) {
      try {
        setIsApproving(true);
        const response = await approveEIP155Request(requestEvent);
        await web3wallet.respondSessionRequest({
          topic,
          response
        });
        setVisible(false);
        onRedirect();
      } catch (error) {
        console.error(error);
      } finally {
        setIsApproving(false);
      }
    }
  }

  async function onReject() {
    if (requestEvent) {
      try {
        setIsRejecting(true);
        const response = rejectEIP155Request(requestEvent);
        await web3wallet.respondSessionRequest({
          topic,
          response
        });
        setVisible(false);
        onRedirect();
      } catch (error) {
        console.error(error);
      } finally {
        setIsRejecting(false);
      }
    }
  }

  return (
    <Modal isVisible={visible}>
      <View style={styles.modalContainer}>
        <ModalHeader name={requestName} url={requestURL} icon={requestIcon} />

        <View style={styles.divider} />

        <View style={styles.chainContainer}>
          <View style={styles.flexRowWrapped}>
            <Tag value={chainID} grey={true} />
          </View>
          <Methods methods={[method]} />
          <Message message={JSON.stringify(transaction, null, 2)} />
        </View>

        <View style={styles.flexRow}>
          <AcceptRejectButton
            accept={false}
            onPress={onReject}
            isLoading={isRejecting}
          />
          <AcceptRejectButton
            accept={true}
            onPress={onApprove}
            disabled={!Boolean(requestEvent)}
            isLoading={isApproving}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  chainContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(80, 80, 89, 0.1)'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  flexRowWrapped: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
    paddingTop: 30,
    backgroundColor: 'white',
    width: '100%',
    position: 'absolute',
    bottom: 44
  },
  rejectButton: {
    color: 'red'
  },
  dappTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700'
  },
  imageContainer: {
    width: 48,
    height: 48
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
    marginVertical: 16
  }
});
