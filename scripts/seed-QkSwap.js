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