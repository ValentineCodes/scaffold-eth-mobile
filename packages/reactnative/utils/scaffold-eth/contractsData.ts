import { contracts } from "./contract";
import scaffoldConfig from "../../scaffold.config";

export function getAllContracts() {
  const contractsData = contracts?.[scaffoldConfig.targetNetworks[0].id];
  return contractsData ? contractsData : {};
}
