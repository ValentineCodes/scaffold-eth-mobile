import * as chains from "viem/chains";
import { networks } from "./src/store/reducers/Networks";

export interface Localhost {
    id: number;
    name: string;
    provider: string;
    currencySymbol: string;
  }

export type ScaffoldConfig = {
    targetNetworks: readonly chains.Chain[] | readonly Localhost[];
};

const scaffoldConfig: ScaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [networks[0]],
}

export default scaffoldConfig satisfies ScaffoldConfig