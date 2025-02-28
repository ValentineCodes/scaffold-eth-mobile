import { useSelector } from 'react-redux';
import { Network } from '../../../scaffold.config';

export const useNetwork = () => {
  const connectedNetwork: Network = useSelector(
    (state: any) => state.connectedNetwork
  );

  return connectedNetwork;
};
