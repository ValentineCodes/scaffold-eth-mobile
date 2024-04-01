import * as chains from "viem/chains";

export interface Localhost {
    name: string;
    provider: string;
    chainId: number;
    currencySymbol: string;
  }

export type ScaffoldConfig = {
    targetNetworks: readonly chains.Chain[] | readonly Localhost[];
    pollingInterval: number;
    alchemyApiKey: string;
};

const localhost = {
    name: 'Localhost',
    provider: `https://192.168.48.72:7545`,
    chainId: 1337,
    currencySymbol: 'ETH',
}

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [localhost],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable
  alchemyApiKey: "K18rs5rCTi1A-RDyPUw92tvL7I2cGVUB",
}

export default scaffoldConfig satisfies ScaffoldConfig