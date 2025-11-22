require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    hoodi: {
      url: process.env.HOODIRPCURL,
      accounts: process.env.PRIVATEKEY ? [process.env.PRIVATEKEY] : [],
      chainId: 560048,
      gasPrice: "auto",
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCANAPIKEY,
    customChains: [
      {
        network: "hoodi",
        chainId: 560048,
        urls: {
          apiURL: "https://hoodi.etherscan.io/api",
          browserURL: "https://hoodi.etherscan.io",
        },
      },
    ],
  },
};
