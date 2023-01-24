const AccountIndex = 0;
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({path: "../.env.development"});

module.exports = {
  contracts_build_directory: "./abi/contracts",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    },
    ganache_db: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC_DB, "http://127.0.0.1:7545", AccountIndex)
      },
      network_id: 1337
    },


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