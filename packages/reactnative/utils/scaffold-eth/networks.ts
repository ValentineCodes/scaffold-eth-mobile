// This is our default Alchemy API key.
// You can get your own at https://dashboard.alchemyapi.io
export const ALCHEMY_KEY = 'K18rs5rCTi1A-RDyPUw92tvL7I2cGVUB';

// The local IP address via WIFI-HOTSPOT
export const LOCAL_PROVIDER = 'http://192.168.0.124:8545';

export interface Network {
  name: string;
  provider: string;
  id: number;
  currencySymbol: string;
  coingeckoPriceId: string;
  blockExplorer: string | null;
}

export const networks = {
  localhost: {
    name: 'Localhost',
    provider: LOCAL_PROVIDER,
    id: 1337,
    currencySymbol: 'ETH',
    coingeckoPriceId: 'ethereum',
    blockExplorer: null
  },
  ethereum: {
    name: 'Ethereum',
    provider: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    id: 1,
    currencySymbol: 'ETH',
    coingeckoPriceId: 'ethereum',
    blockExplorer: 'https://etherscan.io'
  },
  sepolia: {
    name: 'Sepolia',
    provider: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 11155111,
    currencySymbol: 'SepoliaETH',
    coingeckoPriceId: 'ethereum',
    blockExplorer: 'https://sepolia.etherscan.io'
  },
  arbitrum: {
    name: 'Arbitrum',
    provider: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 42161,
    currencySymbol: 'ARB',
    coingeckoPriceId: 'arbitrum',
    blockExplorer: 'https://arbiscan.io'
  },
  arbitrumGoerli: {
    name: 'Arbitrum Goerli',
    provider: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 421613,
    currencySymbol: 'AGOR',
    coingeckoPriceId: 'arbitrum',
    blockExplorer: 'https://goerli.arbiscan.io'
  },
  optimism: {
    name: 'Optimism',
    provider: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 10,
    currencySymbol: 'OP',
    coingeckoPriceId: 'optimism',
    blockExplorer: 'https://optimistic.etherscan.io'
  },
  optimismGoerli: {
    name: 'Optimism Goerli',
    provider: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 420,
    currencySymbol: 'ETH',
    coingeckoPriceId: 'optimism',
    blockExplorer: 'https://goerli-optimism.etherscan.io'
  },
  polygon: {
    name: 'Polygon',
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 137,
    currencySymbol: 'MATIC',
    coingeckoPriceId: 'polygon-ecosystem-token',
    blockExplorer: 'https://polygonscan.com'
  },
  polygonMumbai: {
    name: 'Polygon Mumbai',
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 80001,
    currencySymbol: 'MATIC',
    coingeckoPriceId: 'polygon-ecosystem-token',
    blockExplorer: 'https://mumbai.polygonscan.com'
  }
};
