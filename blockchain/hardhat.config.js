require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

if (!process.env.PRIVATE_KEY) {
  console.error("❌ Error: PRIVATE_KEY is missing in .env");
}
if (!process.env.POLYGON_AMOY_RPC) {
  console.error("❌ Error: POLYGON_AMOY_RPC is missing in .env");
}
if (!process.env.SEPOLIA_RPC) {
  console.error("❌ Error: SEPOLIA_RPC is missing in .env");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    amoy: {
      url: process.env.POLYGON_AMOY_RPC || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  }
};
