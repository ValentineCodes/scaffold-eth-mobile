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
    args: any[]
    blockConfirmations?: number;
}

interface SendTxConfig {
    args?: any[];
    value?: BigNumber | undefined;
}

export default function useContractWrite({
    abi,
    address, 
    functionName,
    args,
    blockConfirmations
}: UseWriteConfig) {
    const writeArgs = args
    const {openModal} = useModal()
    const network = useNetwork()
    const toast = useToast()
    const targetNetwork = useTargetNetwork()
    const connectedAccount = useAccount()
    const [isLoading, setIsLoading] = useState(false)

    const sendTransaction = async (params: SendTxConfig = {
        args: [],
        value: BigNumber.from(0),
    }): Promise<TransactionReceipt> => {
        const {args, value} = params
        const _args = args || writeArgs || []
        const _value = value || BigNumber.from(0)

        if(network.chainId !== targetNetwork.id) {
            throw new Error("You are on the wrong network")
        }

        return new Promise((resolve, reject) => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(network.provider)
    
                const contract = new ethers.Contract(address, abi, provider)

                openModal("SignTransactionModal", {contract, contractAddress: address, functionName, args: _args, value: _value, onConfirm})
                
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
                        value: _value
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