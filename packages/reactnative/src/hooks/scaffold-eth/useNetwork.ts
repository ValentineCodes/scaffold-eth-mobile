import { useSelector } from 'react-redux'
import { Network } from '../../store/reducers/Networks'

export default function useNetwork() {
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    return connectedNetwork
}