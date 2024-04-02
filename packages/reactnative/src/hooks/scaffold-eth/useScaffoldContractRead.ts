import React, { useEffect, useState } from 'react'
import { useDeployedContractInfo } from './useDeployedContractInfo'
import useNetwork from './useNetwork'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

export default function useScaffoldContractRead(contractName: string, functionName: string, args: any[]) {
    const { data: deployedContractData, isLoading: isLoadingDeployedContractData } = useDeployedContractInfo(contractName)
    const network = useNetwork()

    const [data, setData] = useState<any[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    async function fetchData(){
        if (!deployedContractData) return

        try {
            setIsLoading(true)
            const provider = new ethers.providers.JsonRpcProvider(network.provider)
            const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, provider)

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