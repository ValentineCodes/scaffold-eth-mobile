import { useEffect, useState } from "react"
import useNetwork from "./useNetwork"

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

import { parseFloat } from "../../utils/helperFunctions"

interface UseBalanceConfig {
    address: string
}

/**
 * 
 * @param config - The config settings
 * @param config.address - account address
 */
export default function useBalance({address}: UseBalanceConfig) {
    const network = useNetwork()

    const [balance, setBalance] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isRefetching, setIsRefetching] = useState(false)
    const [error, setError] = useState<any>(null)

    async function getBalance(){
        setIsLoading(true)

        try {
            const provider = new ethers.providers.JsonRpcProvider(network.provider)
            const balance = await provider.getBalance(address)
            const _balance = Number(ethers.utils.formatEther(balance)) ? parseFloat(Number(ethers.utils.formatEther(balance)).toString(), 4) : 0

            setBalance(_balance.toString())

            if(error){
                setError(null)
            }
        } catch(error) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function refetch(){
        setIsRefetching(true)
        await getBalance()
        setIsRefetching(false)
    }

    useEffect(() => {
      const provider = new ethers.providers.JsonRpcProvider(network.provider)

      provider.off('block')

      provider.on('block', blockNumber => {
          getBalance()
      })

      return () => {
          provider.off("block")
      };
    }, [address, network])

    return {
        balance,
        refetch,
        isLoading,
        isRefetching,
        error,
    }
}