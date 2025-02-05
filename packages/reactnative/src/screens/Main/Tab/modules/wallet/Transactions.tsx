import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import TransactionsAPI from '../../../../../apis/transactions';
import Transaction from '../../../../../components/Transaction';
import useAccount from '../../../../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../../../../hooks/scaffold-eth/useNetwork';
import { COLORS } from '../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../utils/styles';

export type LoadingTxStatusProps = 'loading' | 'success' | 'error';

export default function Transactions() {
  const account = useAccount();
  const network = useNetwork();
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingTxStatusProps>('loading');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTxPage, setCurrentTxPage] = useState(1);

  const removeDuplicateTx = (txResults: any[]): any[] => {
    const newTransactions = txResults.filter(
      (result: any) =>
        !transactions.some(
          (transaction: any) => transaction.hash === result.hash
        )
    );
    return newTransactions;
  };

  const sortTx = (transactions: any[]): any[] => {
    return transactions.sort((txA, txB) => txB.timeStamp - txA.timeStamp);
  };

  const loadMore = async () => {
    if (
      isLoadingMore ||
      transactions.length < 20 ||
      !network.txApiDomain ||
      !network.txApiKey
    )
      return;

    setIsLoadingMore(true);

    try {
      const transactions = await TransactionsAPI.getTransactions(
        network.txApiDomain,
        network.txApiKey,
        account.address,
        currentTxPage
      );

      const newTransactions = removeDuplicateTx(transactions);

      if (newTransactions.length > 0) {
        setTransactions(oldTransactions =>
          sortTx([...oldTransactions, ...newTransactions])
        );
        setCurrentTxPage(currentPage => currentPage + 1);
      }
    } catch (error) {
      return;
    } finally {
      setIsLoadingMore(false);
    }
  };

  const refresh = async () => {
    if (!network.txApiDomain || !network.txApiKey) return;
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      const transactions = await TransactionsAPI.getTransactions(
        network.txApiDomain,
        network.txApiKey,
        account.address,
        1
      );

      setTransactions(sortTx(transactions));
      setCurrentTxPage(2);
    } catch (error) {
      toast.show('Failed to get transactions', {
        type: 'danger'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTransactions = async () => {
    if (loadingStatus == 'error') {
      setLoadingStatus('loading');
    }

    try {
      const transactions = await TransactionsAPI.getTransactions(
        network.txApiDomain!,
        network.txApiKey!,
        account.address,
        1
      );

      const newTransactions = removeDuplicateTx(transactions);

      setTransactions(oldTransactions =>
        sortTx([...newTransactions, ...oldTransactions])
      );

      setLoadingStatus('success');

      if (newTransactions.length > 0) {
        setCurrentTxPage(2);
      }
    } catch (error) {
      setLoadingStatus('error');
    }
  };

  useEffect(() => {
    setLoadingStatus('loading');

    if (transactions.length > 0) {
      setTransactions([]);
    }
  }, [account, network]);

  useEffect(() => {
    if (!network.txApiDomain || !network.txApiKey) {
      setLoadingStatus('error');
      return;
    }

    const provider = new ethers.JsonRpcProvider(network.provider);

    provider.removeAllListeners('block');

    provider.on('block', blockNumber => {
      getTransactions();
    });

    return () => {
      provider.off('block');
    };
  }, [account, network, transactions]);

  return (
    <View style={{ flex: 1 }}>
      {loadingStatus === 'loading' ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator
            size={3 * FONT_SIZE['xl']}
            color={COLORS.primary}
          />
        </View>
      ) : loadingStatus === 'error' ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16
          }}
        >
          <IconButton
            icon="alert"
            size={7 * FONT_SIZE['xl']}
            iconColor={COLORS.primary}
            style={styles.failedIcon}
          />
          <Text variant="titleLarge">
            Failed to load transactions.{' '}
            <Text
              onPress={getTransactions}
              style={{ color: COLORS.primary, fontWeight: 'bold' }}
            >
              Retry
            </Text>
          </Text>
        </View>
      ) : transactions.length > 0 ? (
        <>
          <FlatList
            keyExtractor={item => item.timeStamp}
            data={transactions}
            renderItem={({ item }) => <Transaction tx={item} />}
            ItemSeparatorComponent={() => (
              <Divider style={{ marginVertical: 8 }} />
            )}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={{ paddingVertical: 16 }}>
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={styles.loadingIndicator}
                  />
                </View>
              ) : null
            }
            refreshControl={
              <RefreshControl
                onRefresh={refresh}
                refreshing={isRefreshing}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16
          }}
        >
          <IconButton
            icon="swap-horizontal"
            size={3 * FONT_SIZE['xl']}
            iconColor={COLORS.primary}
            style={{ backgroundColor: COLORS.primaryLight, borderRadius: 50 }}
          />
          <Text
            variant="headlineSmall"
            style={{ color: '#a1a1aa', fontWeight: 'bold' }}
          >
            No Transactions
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingIndicator: {},
  failedIcon: {
    width: 7 * FONT_SIZE['xl'],
    height: 7 * FONT_SIZE['xl']
  }
});
