import { useEffect, useState } from "react"
import useAccount from "./useAccount"
import useNetwork from "./useNetwork"

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

import { parseFloat } from "../../utils/helperFunctions"

interface Props {
    address: string
}
export default function useBalance({address}: Props) {
    const network = useNetwork()

    const [balance, setBalance] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    async function getBalance(){
        setIsLoading(true)

        try {
            const provider = new ethers.providers.JsonRpcProvider(network.provider)
            const balance = await provider.getBalance(address)
            const _balance = Number(ethers.utils.formatEther(balance)) ? parseFloat(Number(ethers.utils.formatEther(balance)).toString(), 4) : 0

            setBalance(_balance.toString())
        } catch(error) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
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
    }, [connectedAccount, network])

    return {
        balance,
        isLoading,
        error,
        refetch: getBalance
    }
}