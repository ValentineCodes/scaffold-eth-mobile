import {createSlice} from '@reduxjs/toolkit';
import {ALCHEMY_KEY} from '../../utils/constants';

export interface Network {
  name: string;
  provider: string;
  chainId: number;
  currencySymbol: string;
  isConnected: boolean;
  blockExplorer: string | null;
  txApiDomain: string | null;
  txApiKey: string | null
}

const initialState: Network[] = [
  {
    name: 'Local Network',
    provider: `http://192.168.246.72:7545`,
    chainId: 1337,
    currencySymbol: 'ETH',
    isConnected: true,
    blockExplorer: null,
    txApiDomain: null,
    txApiKey: null
  },
  {
    name: 'Ethereum',
    provider: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    chainId: 1,
    currencySymbol: 'ETH',
    isConnected: false,
    blockExplorer: "https://etherscan.io",
    txApiDomain: "https://api.etherscan.io",
    txApiKey: "HY44G42FN4UN1DEYSAN3SAVG639ZYXDJDT"
  },
  {
    name: 'Sepolia',
    provider: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 11155111,
    currencySymbol: 'SepoliaETH',
    isConnected: false,
    blockExplorer: "https://sepolia.etherscan.io",
    txApiDomain: "https://api-sepolia.etherscan.io",
    txApiKey: "HY44G42FN4UN1DEYSAN3SAVG639ZYXDJDT"
  },
  {
    name: 'Goerli',
    provider: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    chainId: 5,
    currencySymbol: 'GoerliETH',
    isConnected: false,
    blockExplorer: "https://goerli.etherscan.io",
    txApiDomain: "https://api-goerli.etherscan.io",
    txApiKey: "HY44G42FN4UN1DEYSAN3SAVG639ZYXDJDT"
  },
  {
    name: 'Arbitrum',
    provider: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 42161,
    currencySymbol: 'ARB',
    isConnected: false,
    blockExplorer: "https://arbiscan.io",
    txApiDomain: "https://api.arbiscan.io",
    txApiKey: "39B4H6472J8D1VVCNTHRQJ44SNYYUN4XSK"
  },
  {
    name: 'Arbitrum Goerli',
    provider: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 421613,
    currencySymbol: 'AGOR',
    isConnected: false,
    blockExplorer: "https://goerli.arbiscan.io",
    txApiDomain: "https://api-goerli.arbiscan.io",
    txApiKey: "39B4H6472J8D1VVCNTHRQJ44SNYYUN4XSK"
  },
  {
    name: 'Optimism',
    provider: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 10,
    currencySymbol: 'OP',
    isConnected: false,
    blockExplorer: "https://optimistic.etherscan.io",
    txApiDomain: null,
    txApiKey: null
  },
  {
    name: 'Optimism Goerli',
    provider: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 420,
    currencySymbol: 'ETH',
    isConnected: false,
    blockExplorer: "https://goerli-optimism.etherscan.io",
    txApiDomain: null,
    txApiKey: null
  },
  {
    name: 'Polygon',
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 137,
    currencySymbol: 'MATIC',
    isConnected: false,
    blockExplorer: "https://polygonscan.com",
    txApiDomain: "https://api.polygonscan.com",
    txApiKey: "IH9BAQZH4SA5HQ5RVQA3JKPRF32GV11GIE"
  },
  {
    name: 'Mumbai',
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 80001,
    currencySymbol: 'MATIC',
    isConnected: false,
    blockExplorer: "https://mumbai.polygonscan.com",
    txApiDomain: "https://api-mumbai.polygonscan.com",
    txApiKey: "IH9BAQZH4SA5HQ5RVQA3JKPRF32GV11GIE"
  },
];

export const networksSlice = createSlice({
  name: 'NETWORKS',
  initialState,
  reducers: {
    addNetwork: (state, action) => {
      return [...state, action.payload];
    },
    switchNetwork: (state, action) => {
      // action.payload => network chainId
      return state.map(network => {
        if (network.chainId === Number(action.payload)) {
          return {...network, isConnected: true};
        } else {
          return {...network, isConnected: false};
        }
      });
    },
  },
});

export const {addNetwork, switchNetwork} = networksSlice.actions;

export default networksSlice.reducer;
