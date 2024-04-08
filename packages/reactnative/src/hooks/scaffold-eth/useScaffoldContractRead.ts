import React, { useEffect, useState } from 'react'
import { useDeployedContractInfo } from './useDeployedContractInfo'
import useNetwork from './useNetwork'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { Wallet, ethers } from "ethers";
import useAccount from './useAccount'
import SInfo from "react-native-sensitive-info"

type Props = {
    contractName: string
    functionName: string
    args?: any[]
}

/**
 * This automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - args to be passed to the function call (Optional)
 */

export default function useScaffoldContractRead({contractName, functionName, args: _args}: Props) {
    const args = _args || []

    const { data: deployedContractData, isLoading: isLoadingDeployedContractData } = useDeployedContractInfo(contractName)
    const network = useNetwork()
    const connectedAccount = useAccount()

    const [data, setData] = useState<any[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    async function fetchData(){
        if (!deployedContractData) return

        try {
            setIsLoading(true)
            const provider = new ethers.providers.JsonRpcProvider(network.provider)

            const accounts = await SInfo.getItem("accounts", {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            })
    
            const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == connectedAccount.address.toLowerCase())
    
            const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)
            
            const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, wallet)

            const result = await contract.functions[functionName](...args)
            
            if(error) {
                setError(null)
            }
            setData(result)
        } catch(error) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [isLoadingDeployedContractData])
    

    return {
        data,
        isLoading,
        error,
        refetch: fetchData
    }
}