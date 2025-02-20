import { Network, networks } from './utils/scaffold-eth/networks';

export type ScaffoldConfig = {
  targetNetworks: readonly Network[];
  alchemyKey: string;
  localProvider: string;
};

const scaffoldConfig: ScaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: Object.values(networks),
  // This is our default Alchemy API key.
  // You can get your own at https://dashboard.alchemyapi.io
  alchemyKey: 'K18rs5rCTi1A-RDyPUw92tvL7I2cGVUB',
  // The local IP address via WIFI-HOTSPOT
  localProvider: 'http://192.168.0.124:8545'
};

export default scaffoldConfig satisfies ScaffoldConfig;
