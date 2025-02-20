import { ALCHEMY_KEY, LOCAL_PROVIDER } from '../../src/utils/constants';

export interface Network {
  name: string;
  provider: string;
  id: number;
  currencySymbol: string;
  coingeckoPriceId: string;
  blockExplorer: string | null;
  txApiDomain: string | null;
  txApiKey: string | null;
}

export const networks = {
  localhost: {
    name: 'Localhost',
    provider: LOCAL_PROVIDER,
    id: 1337,
    currencySymbol: 'ETH',
    coingeckoPriceId: 'ethereum',
    blockExplorer: null,
    txApiDomain: null,
    txApiKey: null
  },
  ethereum: {
    name: 'Ethereum',
    provider: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    id: 1,
    currencySymbol: 'ETH',
    coingeckoPriceId: 'ethereum',
    blockExplorer: 'https://etherscan.io',
    txApiDomain: 'https://api.etherscan.io',
    txApiKey: 'HY44G42FN4UN1DEYSAN3SAVG639ZYXDJDT'
  },
  sepolia: {
    name: 'Sepolia',
    provider: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 11155111,
    currencySymbol: 'SepoliaETH',
    coingeckoPriceId: 'ethereum',
    blockExplorer: 'https://sepolia.etherscan.io',
    txApiDomain: 'https://api-sepolia.etherscan.io',
    txApiKey: 'HY44G42FN4UN1DEYSAN3SAVG639ZYXDJDT'
  },
  arbitrum: {
    name: 'Arbitrum',
    provider: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 42161,
    currencySymbol: 'ARB',
    coingeckoPriceId: 'arbitrum',
    blockExplorer: 'https://arbiscan.io',
    txApiDomain: 'https://api.arbiscan.io',
    txApiKey: '39B4H6472J8D1VVCNTHRQJ44SNYYUN4XSK'
  },
  arbitrumGoerli: {
    name: 'Arbitrum Goerli',
    provider: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 421613,
    currencySymbol: 'AGOR',
    coingeckoPriceId: 'arbitrum',
    blockExplorer: 'https://goerli.arbiscan.io',
    txApiDomain: 'https://api-goerli.arbiscan.io',
    txApiKey: '39B4H6472J8D1VVCNTHRQJ44SNYYUN4XSK'
  },
  optimism: {
    name: 'Optimism',
    provider: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 10,
    currencySymbol: 'OP',
    coingeckoPriceId: 'optimism',
    blockExplorer: 'https://optimistic.etherscan.io',
    txApiDomain: null,
    txApiKey: null
  },
  optimismGoerli: {
    name: 'Optimism Goerli',
    provider: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 420,
    currencySymbol: 'ETH',
    coingeckoPriceId: 'optimism',
    blockExplorer: 'https://goerli-optimism.etherscan.io',
    txApiDomain: null,
    txApiKey: null
  },
  polygon: {
    name: 'Polygon',
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 137,
    currencySymbol: 'MATIC',
    coingeckoPriceId: 'polygon-ecosystem-token',
    blockExplorer: 'https://polygonscan.com',
    txApiDomain: 'https://api.polygonscan.com',
    txApiKey: 'IH9BAQZH4SA5HQ5RVQA3JKPRF32GV11GIE'
  },
  polygonMumbai: {
    name: 'Polygon Mumbai',
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    id: 80001,
    currencySymbol: 'MATIC',
    coingeckoPriceId: 'polygon-ecosystem-token',
    blockExplorer: 'https://mumbai.polygonscan.com',
    txApiDomain: 'https://api-mumbai.polygonscan.com',
    txApiKey: 'IH9BAQZH4SA5HQ5RVQA3JKPRF32GV11GIE'
  }
};
