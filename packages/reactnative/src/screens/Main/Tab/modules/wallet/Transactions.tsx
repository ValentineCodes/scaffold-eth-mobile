import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, VStack, Icon, Image, Divider } from 'native-base'
import Transaction from '../../../../../components/Transaction'
import { ActivityIndicator, RefreshControl, StyleSheet } from 'react-native'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { COLORS } from '../../../../../utils/constants'
import { FONT_SIZE } from '../../../../../utils/styles'
import TransactionsAPI from "../../../../../apis/transactions"
import useAccount from '../../../../../hooks/scaffold-eth/useAccount'
import useNetwork from '../../../../../hooks/scaffold-eth/useNetwork'
import { ethers } from 'ethers'
import { useToast } from 'react-native-toast-notifications'

export type LoadingTxStatusProps = 'loading' | 'success' | 'error';

export default function Transactions() {
  const account = useAccount()
  const network = useNetwork()
  const toast = useToast()

  const [transactions, setTransactions] = useState([])
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingTxStatusProps>('loading');
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTxPage, setCurrentTxPage] = useState(1)

  const removeDuplicateTx = (txResults: any[]): any[] => {
    const newTransactions = txResults.filter((result: any) => !transactions.some((transaction: any) => transaction.hash === result.hash))
    return newTransactions
  }

  const sortTx = (transactions: any[]): any[] => {
    return transactions.sort((txA, txB) => txB.timeStamp - txA.timeStamp)
  }

  const loadMore = async () => {
    if (isLoadingMore || transactions.length < 20 || !network.txApiDomain || !network.txApiKey) return

    setIsLoadingMore(true)

    try {
      const transactions = await TransactionsAPI.getTransactions(network.txApiDomain, network.txApiKey, account.address, currentTxPage)

      const newTransactions = removeDuplicateTx(transactions)

      if (newTransactions.length > 0) {
        setTransactions(oldTransactions => sortTx([...oldTransactions, ...newTransactions]))
        setCurrentTxPage(currentPage => currentPage + 1)
      }
    } catch (error) {
      return
    } finally {
      setIsLoadingMore(false)
    }
  }

  const refresh = async () => {
    if (!network.txApiDomain || !network.txApiKey) return
    if (isRefreshing) return

    setIsRefreshing(true)

    try {
      const transactions = await TransactionsAPI.getTransactions(network.txApiDomain, network.txApiKey, account.address, 1)

      setTransactions(sortTx(transactions))
      setCurrentTxPage(2)
    } catch (error) {
      toast.show("Failed to get transactions", {
        type: "danger"
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const getTransactions = async () => {
    if (loadingStatus == 'error') {
      setLoadingStatus('loading');
    }

    try {
      const transactions = await TransactionsAPI.getTransactions(network.txApiDomain!, network.txApiKey!, account.address, 1)

      const newTransactions = removeDuplicateTx(transactions)

      setTransactions(oldTransactions => sortTx([...newTransactions, ...oldTransactions]))

      setLoadingStatus('success')

      if (newTransactions.length > 0) {
        setCurrentTxPage(2)
      }
    } catch (error) {
      setLoadingStatus('error')
    }
  }

  useEffect(() => {
    setLoadingStatus("loading")

    if (transactions.length > 0) {
      setTransactions([])
    }
  }, [account, network])

  useEffect(() => {
    if (!network.txApiDomain || !network.txApiKey) {
      setLoadingStatus("error")
      return
    }

    const provider = new ethers.providers.JsonRpcProvider(network.provider);

    provider.off('block')

    provider.on('block', blockNumber => {
      getTransactions()
    })

    return () => {
      provider.off("block")
    };
  }, [account, network, transactions])

  return (
    <View style={{ flex: 1 }}>
      {loadingStatus === 'loading' ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={3 * FONT_SIZE['xl']} color={COLORS.primary} />
        </View>
      ) : loadingStatus === 'error' ? (
        <VStack flex="1" justifyContent="center" alignItems="center" space="4">
          <Image source={require("../../../../../assets/icons/failed_icon.png")} alt="Retry" style={styles.failedIcon} />
          <Text fontSize={1.1 * FONT_SIZE['lg']}>Failed to load transactions. <Text onPress={getTransactions} color={COLORS.primary} bold>Retry</Text></Text>
        </VStack>
      ) : transactions.length > 0 ? (
        <>
          <FlatList
            keyExtractor={(item) => item.timeStamp}
            data={transactions}
            renderItem={({ item }) => <Transaction tx={item} />}
            ItemSeparatorComponent={<Divider bgColor="muted.100" my="2" />}
            ListFooterComponent={isLoadingMore ? <View py="4"><ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} /></View> : null}
            refreshControl={
              <RefreshControl
                onRefresh={refresh}
                refreshing={isRefreshing}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
          />
        </>
      ) : (
        <VStack flex="1" justifyContent="center" alignItems="center" space="4">
          <View bgColor={COLORS.primaryLight} p="4" borderRadius="full">
            <Icon as={<Ionicons name="swap-horizontal-outline" />} size={3 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
          </View>
          <Text fontSize={1.2 * FONT_SIZE['xl']} bold color="muted.400">No Transactions</Text>
        </VStack>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  loadingIndicator: {},
  failedIcon: {
    width: 7 * FONT_SIZE['xl'],
    height: 7 * FONT_SIZE['xl']
  }
})