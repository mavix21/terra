import path from "node:path";
import { fileURLToPath } from "node:url";
import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";
import { configVariable } from "hardhat/config";

import "@nomicfoundation/hardhat-verify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from package and monorepo root if present
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const rawDeployerPrivateKey = (process.env.DEPLOYER_PRIVATE_KEY ?? "")
  .trim()
  .replace(/^"+|"+$/g, "");
const deployerPrivateKey = rawDeployerPrivateKey
  ? rawDeployerPrivateKey.startsWith("0x")
    ? rawDeployerPrivateKey
    : "0x" + rawDeployerPrivateKey
  : "";

const config = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    liskSepolia: {
      type: "http",
      chainType: "l1",
      url: "https://rpc.sepolia-api.lisk.com",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : undefined,
      gasPrice: 1000000000,
    },
    // Alias using kebab-case to align with Etherscan/Blockscout customChains naming
    "lisk-sepolia": {
      type: "http",
      chainType: "l1",
      url: "https://rpc.sepolia-api.lisk.com",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : undefined,
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
      liskSepolia: "123",
      "lisk-sepolia": "123",
    },
    customChains: [
      {
        network: "liskSepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com",
        },
      },
      {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
} as const;

export default config;
