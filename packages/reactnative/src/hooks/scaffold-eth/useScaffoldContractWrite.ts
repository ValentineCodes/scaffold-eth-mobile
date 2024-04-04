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
    contractName: string;
    functionName: string;
    blockConfirmations?: number;
}

interface SendTxConfig {
    args?: any[];
    value?: BigNumber | undefined;
}

export default function useScaffoldContractWrite({
    contractName, 
    functionName,
    blockConfirmations
}: UseScaffoldWriteConfig) {
    const {openModal} = useModal()
    const { data: deployedContractData, isLoading } = useDeployedContractInfo(contractName)
    const network = useNetwork()
    const toast = useToast()
    const targetNetwork = useTargetNetwork()
    const connectedAccount = useAccount()

    const sendTransaction = async (params: SendTxConfig = {
        args: [],
        value: BigNumber.from(0),
    }): Promise<TransactionReceipt> => {
        const {args, value} = params
        const _args = args || []
        const _value = value || BigNumber.from(0)

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