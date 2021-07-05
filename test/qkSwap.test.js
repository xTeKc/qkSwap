const Token = artifacts.require('Token')
const QkSwap = artifacts.require('QkSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('QkSwap', ([deployer, investor]) => {
  let token, qkSwap

  before(async () => {
    token = await Token.new()
    qkSwap = await QkSwap.new(token.address)
    // Transfer all tokens to QkSwap (1 million)
    await token.transfer(qkSwap.address, tokens('1000000'))
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'qkSwap Token')
    })
  })

  describe('QkSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await qkSwap.name()
      assert.equal(name, 'QkSwap Instant Exchange')
    })

    it('contract has tokens', async () => {
      let balance = await token.balanceOf(qkSwap.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('buyTokens()', async () => {
    let result

    before(async () => {
      // Purchase tokens before each example
      result = await qkSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
    })

    it('Allows user to instantly purchase tokens from qkSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('100'))

      // Check qkSwap balance after purchase
      let qkSwapBalance
      qkSwapBalance = await token.balanceOf(qkSwap.address)
      assert.equal(qkSwapBalance.toString(), tokens('999900'))
      qkSwapBalance = await web3.eth.getBalance(qkSwap.address)
      assert.equal(qkSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })
  })

  describe('sellTokens()', async () => {
    let result

    before(async () => {
      // Investor must approve tokens before the purchase
      await token.approve(qkSwap.address, tokens('100'), { from: investor })
      // Investor sells tokens
      result = await qkSwap.sellTokens(tokens('100'), { from: investor })
    })

    it('Allows user to instantly sell tokens to qkSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('0'))

      // Check qkSwap balance after purchase
      let qkSwapBalance
      qkSwapBalance = await token.balanceOf(qkSwap.address)
      assert.equal(qkSwapBalance.toString(), tokens('1000000'))
      qkSwapBalance = await web3.eth.getBalance(qkSwap.address)
      assert.equal(qkSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')

      // FAILURE: investor can't sell more tokens than they have
      await qkSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
    })
  })

})
