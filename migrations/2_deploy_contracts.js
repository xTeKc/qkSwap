const Token = artifacts.require("Token");
const QkSwap = artifacts.require("QkSwap");

module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // Deploy QkSwap
  await deployer.deploy(QkSwap, token.address);
  const qkSwap = await QkSwap.deployed()

  // Transfer all tokens to QkSwap (1 million)
  await token.transfer(qkSwap.address, '1000000000000000000000000')
};
