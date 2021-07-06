//Contracts 
const Token = artifacts.require('Token');
const QkSwap = artifacts.require('QkSwap');

//Utils
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000' //Ether token deposit address

const ether = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

module.exports = async (callback) {
    try {
        //Fetch accounts from wallet (they are unlocked)
        const accounts = await web3.eth.getAccounts()

        //Fetch the deployed Token
        const token = await Token.deployed()
        console.log('Token fetched', token.address)

        //Fetch the deployed Exchange
        const qkSwap = await QkSwap.deployed()
        console.log('QkSwap fetched', qkSwap.address)
    }
}  