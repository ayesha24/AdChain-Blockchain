const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    // ganache: {
    //   host: '127.0.0.1',
    //   port: 7545,
    //   network_id: '*', // Match any network id
    // },
    // goerli: {
    //   provider: () => new HDWalletProvider(mnemonic, 'https://goerli.infura.io/v3/b25609769d5049639f14bd8d0921262a'),
    //   network_id: 5, // Goerli network ID
    //   gas: 10000000,
    //   //gasPrice: 20 * 10**9, // 20 gwei
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // },
    sepola: {
      provider: () => new HDWalletProvider(mnemonic, "https://eth-sepolia.g.alchemy.com/v2/ctTpE7oKGVzKWlLbeHJ-pEqEetFt1HND"),
      network_id: "*", // match any network id or use the specific network id for Sepola testnet
      gas: 5000000,
      gasPrice: 20000000000, // 20 Gwei, you can adjust this value based on the current gas price
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  compilers: {
    solc: {
      version: '0.8.9', // Update this to the desired Solidity compiler version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
