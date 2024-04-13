import { useModal } from 'react-native-modalfy'
import useNetwork from './useNetwork';
import { useToast } from 'react-native-toast-notifications';
import useTargetNetwork from './useTargetNetwork';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ContractInterface, Wallet, ethers } from "ethers";

import SInfo from "react-native-sensitive-info"
import useAccount from './useAccount';
import { Abi } from 'abitype';
import { useState } from 'react';
import { TransactionReceipt } from 'viem';

interface UseWriteConfig {
    abi: ContractInterface | Abi
    address: string
    functionName: string;
    args?: any[]
    value?: BigNumber | undefined
    blockConfirmations?: number;
    gasLimit?: BigNumber | undefined
}

interface SendTxConfig {
    args?: any[];
    value?: BigNumber | undefined;
}

/**
 * This sends a transaction to the contract and returns the transaction receipt
 * @param config - The config settings
 * @param config.abi - contract abi
 * @param config.address - contract address
 * @param config.functionName - name of the function to be called
 * @param config.args - arguments for the function
 * @param config.value - value in ETH that will be sent with transaction
 * @param config.blockConfirmations - number of block confirmations to wait for (default: 1)
 * @param config.gasLimit - transaction gas limit
 */
export default function useContractWrite({
    abi,
    address, 
    functionName,
    args,
    value,
    blockConfirmations,
    gasLimit
}: UseWriteConfig) {
    const writeArgs = args
    const writeValue = value
    const _gasLimit = gasLimit || 1000000

    const {openModal} = useModal()
    const network = useNetwork()
    const toast = useToast()
    const targetNetwork = useTargetNetwork()
    const connectedAccount = useAccount()
    const [isLoading, setIsLoading] = useState(false)

    /**
     * 
     * @param config Optional param settings
     * @param config.args - arguments for the function
     * @param config.value - value in ETH that will be sent with transaction
     * @returns The transacction receipt
     */

    const sendTransaction = async (config: SendTxConfig = {
        args: undefined,
        value: undefined,
    }): Promise<TransactionReceipt> => {
        const {args, value} = config
        const _args = args || writeArgs || []
        const _value = value || writeValue || BigNumber.from(0)

        if(network.id !== targetNetwork.id) {
            throw new Error("You are on the wrong network")
        }

        return new Promise(async (resolve, reject) => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(network.provider)
    
                const accounts = await SInfo.getItem("accounts", {
                    sharedPreferencesName: "sern.android.storage",
                    keychainService: "sern.ios.storage",
                })
        
                const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == connectedAccount.address.toLowerCase())
        
                const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)
    
                const contract = new ethers.Contract(address, abi, wallet)

                openModal("SignTransactionModal", {contract, contractAddress: address, functionName, args: _args, value: _value, gasLimit: _gasLimit, onConfirm})
                
            } catch(error) {
                reject(error)
            }
    
            async function onConfirm(){
                setIsLoading(true)
                try {
                    const provider = new ethers.providers.JsonRpcProvider(network.provider)
    
                    const accounts = await SInfo.getItem("accounts", {
                        sharedPreferencesName: "sern.android.storage",
                        keychainService: "sern.ios.storage",
                    })
            
                    const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == connectedAccount.address.toLowerCase())
            
                    const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)
        
                    const contract = new ethers.Contract(address, abi, wallet)
        
                    const tx = await contract.functions[functionName](..._args, {
                        value: _value,
                        gasLimit: _gasLimit
                    })
                    const receipt = await tx.wait(blockConfirmations || 1)
                    toast.show("Transaction Successful!", {
                        type: "success"
                    })
                    resolve(receipt)
                } catch(error) {
                    reject(error)
                } finally {
                    setIsLoading(false)
                }
            }
        })
    }

    return {
        isLoading,
        write: sendTransaction
    }
}