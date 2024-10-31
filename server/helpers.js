const ethWallet = require('ethereumjs-wallet').default;

const generateEthWallet = () => {
  let addressData = ethWallet.generate()

  return { privateKey: addressData.getPrivateKeyString(), address: addressData.getAddressString()  }
}
module.exports = {
  generateEthWallet
}