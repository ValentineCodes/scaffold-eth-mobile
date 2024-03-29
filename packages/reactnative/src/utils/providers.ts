import {ethers} from 'ethers';
import { ALCHEMY_KEY } from './constants';
export interface Providers {
  localhost: string;
  ethereum: string;
  sepolia: string;
  goerli: string;
  arbitrum: string;
  arbitrumGoerli: string;
  optimism: string;
  optimismGoerli: string;
  polygon: string;
  polygonMumbai: string;
}
const providers = {
  localhost: 'http://127.0.0.1:8545/',
  ethereum: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  sepolia: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  goerli: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  arbitrumGoerli: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  optimism: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  optimismGoerli: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  polygon: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  polygonMumbai: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

export const getProviderWithName = (name: keyof typeof providers) => {
  return new ethers.providers.JsonRpcProvider(providers[name]);
};

export const getProviderWithURL = (rpc_url: string) => {
  return new ethers.providers.JsonRpcProvider(rpc_url);
};
