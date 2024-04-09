import scaffoldConfig from "../../../scaffold.config";
import useNetwork from "./useNetwork";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */

export default function useTargetNetwork() {
    const { targetNetworks } = scaffoldConfig;
    const network = useNetwork()

    const selectedNetwork = targetNetworks.find(targetNetwork => targetNetwork.id === network.id)

    if(selectedNetwork){
        return selectedNetwork
    }
    return targetNetworks[0]
}