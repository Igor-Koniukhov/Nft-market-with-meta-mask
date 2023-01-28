const AccountIndex = 0;
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({path: "./.env.development"});

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    },
    ganache_local: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", AccountIndex)
      },
      network_id: 1337
    },

    goerly: {
      provider: () => 
        new HDWalletProvider(
         process.env.MNEMONIC,
          process.env.NEXT_PUBLIC_ALCHEMY_NFT
        ),
      network_id: 5,
      gas: 5500000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 200
    }
  },
  compilers: {
    solc: {
      version: "0.8.13",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
