// import ethers.js
const ethers = require('ethers')
// network: using the Rinkeby testnet
let network = 'goerli'
// provider: Infura or Etherscan will be automatically chosen
let provider = ethers.getDefaultProvider()
// Sender private key: 
// correspondence address 0xb985d345c4bb8121cE2d18583b2a28e98D56d04b
let privateKey = '3e37102e4233143cf20332f102830b172e938e2c977e248e03fbe5817cf6c202'
// Create a wallet instance
let wallet = new ethers.Wallet(privateKey, provider)
// Receiver Address which receives Ether
let receiverAddress = '0x776cF4AE3c6eead1349e5Cde7399aE1e37AFbA7c'
// Ether amount to send
let amountInEther = '0.001'
// Create a transaction object
let tx = {
    to: receiverAddress,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther(amountInEther),
    gasLimit: 0x3e7,
}
// Send a transaction
wallet.sendTransaction(tx)
.then((txObj) => {
    console.log('txHash', txObj.hash)
    // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
    // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
})