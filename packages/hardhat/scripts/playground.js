const {ethers} = require("ethers")

// Create a provider instance with the URL of your local node
const provider = new ethers.JsonRpcProvider('http://192.168.246.72:7545');

// Example: Get the latest block number
provider.getBlockNumber().then(blockNumber => {
  console.log('Latest block number:', blockNumber);
});

// Example: Get the balance of an Ethereum account
const address = '0x4c7ad42767D17B604501b01407786Dd09B3ce2D3';
provider.getBalance(address).then(balance => {
  console.log('Balance of', address, ':', ethers.formatEther(balance), 'ETH');
});
