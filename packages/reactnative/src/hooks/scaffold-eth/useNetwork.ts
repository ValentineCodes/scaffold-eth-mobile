import { useSelector } from 'react-redux';
import { Network } from '../../../utils/scaffold-eth/networks';

export default function useNetwork() {
  const connectedNetwork: Network = useSelector(
    (state: any) => state.connectedNetwork
  );

  return connectedNetwork;
}
