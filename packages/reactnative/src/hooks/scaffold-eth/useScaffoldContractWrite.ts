import { useModal } from 'react-native-modalfy'
import useNetwork from './useNetwork';
import { useDeployedContractInfo } from './useDeployedContractInfo';
import { useToast } from 'react-native-toast-notifications';
import useTargetNetwork from './useTargetNetwork';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, Wallet, ethers } from "ethers";

import SInfo from "react-native-sensitive-info"
import useAccount from './useAccount';
import { TransactionReceipt } from 'viem';

interface UseScaffoldWriteConfig {
    contractName: string
    functionName: string
    args?: any[]
    value?: BigNumber | undefined
    blockConfirmations?: number
}

interface SendTxConfig {
    args?: any[] | undefined
    value?: BigNumber | undefined
}

/**
 * This returns a function which returns the transaction receipt after contract call
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - arguments for the function
 * @param config.value - value in ETH that will be sent with transaction
 * @param config.blockConfirmations - number of block confirmations to wait for (default: 1)
 */

export default function useScaffoldContractWrite({
    contractName, 
    functionName,
    args,
    value,
    blockConfirmations
}: UseScaffoldWriteConfig) {
    const writeArgs = args
    const writeValue = value

    const {openModal} = useModal()
    const { data: deployedContractData } = useDeployedContractInfo(contractName)
    const network = useNetwork()
    const toast = useToast()
    const targetNetwork = useTargetNetwork()
    const connectedAccount = useAccount()

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

        if(!deployedContractData){
            throw new Error("Target Contract is not deployed, did you forget to run `yarn deploy`?")
        }
        if(network.chainId !== targetNetwork.id) {
            throw new Error("You are on the wrong network")
        }

        return new Promise((resolve, reject) => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(network.provider)
    
                const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, provider)

                openModal("SignTransactionModal", {contract, contractAddress: deployedContractData.address, functionName, args: _args, value: _value, onConfirm})
                
            } catch(error) {
                reject(error)
            }
    
            async function onConfirm(){
                try {
                    const provider = new ethers.providers.JsonRpcProvider(network.provider)
    
                    const accounts = await SInfo.getItem("accounts", {
                        sharedPreferencesName: "sern.android.storage",
                        keychainService: "sern.ios.storage",
                    })
            
                    const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == connectedAccount.address.toLowerCase())
            
                    const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)
        
                    const contract = new ethers.Contract(deployedContractData!.address, deployedContractData!.abi, wallet)
        
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
                }
            }
        })
    }

    return {
        write: sendTransaction
    }
}