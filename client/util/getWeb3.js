export default function getWeb3(cb) {
  const Web3 = require('web3');
  let provider;
  if (window.web3.currentProvider) {
    provider = window.web3.currentProvider;
  } else {
    provider = new Web3.providers.HttpProvider('http://localhost:8545');
  }
  const myWeb3 = new Web3(provider);
  cb(myWeb3);
}
