import { Text, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { BackHandler, NativeEventSubscription, StyleSheet } from 'react-native'
import Header from './modules/home/Header'
import MainBalance from './modules/home/MainBalance'
import Transactions from './modules/home/Transactions'
import { useSelector } from 'react-redux'
import { Account } from '../../../store/reducers/Accounts'
import { Network } from '../../../store/reducers/Networks'
import { ethers } from 'ethers'
// import redstone from 'redstone-api';
import { Providers, getProviderWithName } from '../../../utils/providers'
import TransactionsAPI from "../../../apis/transactions"
import { useToast } from 'react-native-toast-notifications'
import { LoadingTxStatusProps } from './modules/home/Transactions'
import { parseFloat } from '../../../utils/helperFunctions'
import { useFocusEffect } from '@react-navigation/native'

let backHandler: NativeEventSubscription;

type Props = {}

function Wallet({ }: Props) {
    const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [balance, setBalance] = useState("")
    const [dollarValue, setDollarValue] = useState<string | null>(null)
    const [transactions, setTransactions] = useState([])

    const [isLoadingBalance, setIsLoadingBalance] = useState(false)
    const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)
    const [loadingTxStatus, setLoadingTxStatus] =
        useState<LoadingTxStatusProps>('loading');
    const [isLoadingMoreTx, setIsLoadingMoreTx] = useState(false)
    const [isRefreshingTx, setIsRefreshingTx] = useState(false)
    const [currentTxPage, setCurrentTxPage] = useState(1)

    const toast = useToast()

    const getBalance = async () => {
        if (isLoadingBalance) return

        setIsLoadingBalance(true)

        try {
            const provider = new ethers.providers.JsonRpcProvider(connectedNetwork.provider)
            const balance = await provider.getBalance(connectedAccount.address)
            const _balance = Number(ethers.utils.formatEther(balance)) ? parseFloat(Number(ethers.utils.formatEther(balance)).toString(), 4) : 0

            // try {
            //   const price = await redstone.getPrice(connectedNetwork.currencySymbol);
            //   const dollarValue = Number(_balance) * price.value
            //   setDollarValue(dollarValue ? parseFloat(dollarValue.toString(), 2).toString() : "0")
            // } catch (error) {
            //   setDollarValue(null)
            //   return
            // } finally {
            setBalance(_balance.toString())
            // }

        } catch (error) {
            return
        } finally {
            setIsLoadingBalance(false)
        }
    }

    const refreshBalance = async () => {
        setIsRefreshingBalance(true)
        await getBalance()
        setIsRefreshingBalance(false)
    }

    const removeDuplicateTx = (txResults: any[]): any[] => {
        const newTransactions = txResults.filter((result: any) => !transactions.some((transaction: any) => transaction.hash === result.hash))
        return newTransactions
    }

    const orderTx = (transactions: any[]): any[] => {
        return transactions.sort((txA, txB) => txB.timeStamp - txA.timeStamp)
    }

    const getTransactions = async () => {
        if (!connectedNetwork.txApiDomain || !connectedNetwork.txApiKey) return
        if (loadingTxStatus == 'error') {
            setLoadingTxStatus('loading');
        }

        try {
            const transactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, 1)

            const newTransactions = removeDuplicateTx(transactions)

            setTransactions(oldTransactions => orderTx([...newTransactions, ...oldTransactions]))

            setLoadingTxStatus('success')

            if (newTransactions.length > 0) {
                setCurrentTxPage(2)
            }
        } catch (error) {
            setLoadingTxStatus('error')
        }
    }

    const loadMoreTransactions = async () => {
        if (isLoadingMoreTx || transactions.length < 20 || !connectedNetwork.txApiDomain || !connectedNetwork.txApiKey) return

        setIsLoadingMoreTx(true)

        try {
            const transactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, currentTxPage)

            const newTransactions = removeDuplicateTx(transactions)

            if (newTransactions.length > 0) {
                setTransactions(oldTransactions => orderTx([...oldTransactions, ...newTransactions]))
                setCurrentTxPage(currentPage => currentPage + 1)
            }
        } catch (error) {
            return
        } finally {
            setIsLoadingMoreTx(false)
        }
    }

    const refreshTx = async () => {
        if (!connectedNetwork.txApiDomain || !connectedNetwork.txApiKey) return
        if (isRefreshingTx) return

        setIsRefreshingTx(true)

        try {
            const transactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, 1)

            setTransactions(orderTx(transactions))
            setCurrentTxPage(2)
        } catch (error) {
            toast.show("Failed to get transactions", {
                type: "danger"
            })
        } finally {
            setIsRefreshingTx(false)
        }
    }

    useEffect(() => {
        setLoadingTxStatus("loading")

        if (transactions.length > 0) {
            setTransactions([])
        }
    }, [connectedAccount, connectedNetwork])

    useFocusEffect(() => {
        backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();

            return true;
        });
    })

    useEffect(() => {
        const provider = getProviderWithName(connectedNetwork.name.toLowerCase() as keyof Providers)

        provider.off('block')

        provider.on('block', blockNumber => {
            getBalance()
            getTransactions()
        })

        return () => {
            provider.off("block")
            backHandler?.remove();
        };
    }, [connectedAccount, connectedNetwork, transactions])

    return (
        <View style={styles.container}>
            <Header />
            <MainBalance
                balance={balance}
                dollarValue={dollarValue}
                isRefreshing={isRefreshingBalance}
                refresh={refreshBalance}
                backHandler={backHandler}
            />
            <Transactions
                transactions={transactions}
                loadingStatus={loadingTxStatus}
                isLoadingMore={isLoadingMoreTx}
                isRefreshing={isRefreshingTx}
                get={getTransactions}
                refresh={refreshTx}
                loadMore={loadMoreTransactions}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 5,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    }
})
export default Wallet