import * as dotenv from 'dotenv';
dotenv.config();
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-chai-matchers';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomicfoundation/hardhat-verify';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import { task } from 'hardhat/config';
import generateTsAbis from './scripts/generateTsAbis';

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey =
  process.env.ALCHEMY_API_KEY || 'oKxs-03sij-U_N0iOlrSsZFr29-IqbuF';
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ??
  '0x8e3286b6cdea11d85def05635464d1bb5e78ffe19cf9ba2877b9700e2ff8ae24';
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey =
  process.env.ETHERSCAN_API_KEY || 'DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200
      },
      viaIR: true
    }
  },
  defaultNetwork: 'localhost',
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0
    }
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    ganache: {
      url: `http://192.168.0.124:8545`,
      accounts: [deployerPrivateKey],
      chainId: 1337
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    arbitrumGoerli: {
      url: `https://arb-goerli.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    optimismGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    polygonZkEvm: {
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    polygonZkEvmTestnet: {
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey]
    },
    gnosis: {
      url: 'https://rpc.gnosischain.com',
      accounts: [deployerPrivateKey]
    },
    chiado: {
      url: 'https://rpc.chiadochain.net',
      accounts: [deployerPrivateKey]
    },
    base: {
      url: 'https://mainnet.base.org',
      accounts: [deployerPrivateKey]
    },
    baseGoerli: {
      url: 'https://goerli.base.org',
      accounts: [deployerPrivateKey]
    },
    baseSepolia: {
      url: 'https://sepolia.base.org',
      accounts: [deployerPrivateKey]
    },
    scrollSepolia: {
      url: 'https://sepolia-rpc.scroll.io',
      accounts: [deployerPrivateKey]
    },
    scroll: {
      url: 'https://rpc.scroll.io',
      accounts: [deployerPrivateKey]
    },
    pgn: {
      url: 'https://rpc.publicgoods.network',
      accounts: [deployerPrivateKey]
    },
    pgnTestnet: {
      url: 'https://sepolia.publicgoods.network',
      accounts: [deployerPrivateKey]
    }
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: `${etherscanApiKey}`
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`
    }
  },
  sourcify: {
    enabled: false
  }
};

// Extend the deploy task
task('deploy').setAction(async (args, hre, runSuper) => {
  // Run the original deploy task
  await runSuper(args);
  // Force run the generateTsAbis script
  await generateTsAbis(hre);
});

export default config;
