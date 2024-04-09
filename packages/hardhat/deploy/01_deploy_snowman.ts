import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "Snowman" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySnowman: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy libraries
  const TokenURIGen = await deploy("TokenURIGen", {
    from: deployer,
  });

  const snowmanMetadata = await deploy("SnowmanMetadata", {
    from: deployer,
    libraries: {
      TokenURIGen: TokenURIGen.address,
    },
  });

  const accessoryManager = await deploy("AccessoryManager", {
    from: deployer,
    libraries: {
      TokenURIGen: TokenURIGen.address,
    },
  });
  const attributesGen = await deploy("AttributesGen", {
    from: deployer,
  });

  await deploy("Snowman", {
    from: deployer,
    args: [deployer],
    log: true,
    libraries: {
      AttributesGen: attributesGen.address,
      SnowmanMetadata: snowmanMetadata.address,
      AccessoryManager: accessoryManager.address,
    },
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract
  // const Snowman = await hre.ethers.getContract("Snowman", deployer);
};

export default deploySnowman;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Snowman
deploySnowman.tags = ["Snowman"];
