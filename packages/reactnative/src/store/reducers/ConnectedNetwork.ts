import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import scaffoldConfig from '../../../scaffold.config';
import { Network } from '../../../utils/scaffold-eth/networks';

const initialState: Network = scaffoldConfig.targetNetworks[0];

export const connectedNetworkSlice = createSlice({
  name: 'CONNECTED_NETWORK',
  initialState,
  reducers: {
    switchNetwork: (state, action: PayloadAction<number>) => {
      const newNetwork = scaffoldConfig.targetNetworks.find(
        network => network.id === action.payload
      );

      return newNetwork ? newNetwork : state;
    }
  }
});

export const { switchNetwork } = connectedNetworkSlice.actions;
export default connectedNetworkSlice.reducer;
