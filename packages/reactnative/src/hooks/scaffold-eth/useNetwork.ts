import { useSelector } from 'react-redux';
import { Network } from '../../../scaffold.config';

export default function useNetwork() {
  const connectedNetwork: Network = useSelector(
    (state: any) => state.connectedNetwork
  );

  return connectedNetwork;
}
