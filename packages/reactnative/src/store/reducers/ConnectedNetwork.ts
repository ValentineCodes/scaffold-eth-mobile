import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import scaffoldConfig, { Network } from '../../../scaffold.config';

const initialState: Network = Object.values(scaffoldConfig.networks)[0];

export const connectedNetworkSlice = createSlice({
  name: 'CONNECTED_NETWORK',
  initialState,
  reducers: {
    switchNetwork: (state, action: PayloadAction<number>) => {
      const newNetwork = Object.values(scaffoldConfig.networks).find(
        network => network.id === action.payload
      );

      return newNetwork ? newNetwork : state;
    }
  }
});

export const { switchNetwork } = connectedNetworkSlice.actions;
export default connectedNetworkSlice.reducer;
