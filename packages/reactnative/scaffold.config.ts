import { Network, networks } from './utils/scaffold-eth/networks';

export type ScaffoldConfig = {
  targetNetworks: readonly Network[];
};

const scaffoldConfig: ScaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: Object.values(networks)
};

export default scaffoldConfig satisfies ScaffoldConfig;
