module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "5777", // Match any network id
      from: "0x17496DA3cA61f2B2F62738C1f45AfF22C2F711E5" // IMPORTANT: Replace with YOUR funded Ganache account address
    }
  },
  compilers: {
    solc: {
      version: "0.8.13",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}; 