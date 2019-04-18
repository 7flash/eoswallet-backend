const { describe } = require('riteway');
const { path } = require("ramda");

const wallet = require('../src/mockWallet');

const defaultAccount = 'sevenflash12'

describe('wallet', async assert => {
  const should = 'return correct values';

  const tokensBeforeTransfer = wallet.tokens(defaultAccount);
  const historyBeforeTransfer = wallet.history(defaultAccount);

  assert({
    given: 'initial balance',
    should,
    actual: Object.keys(tokensBeforeTransfer),
    expected: ['EOS1', 'EOS2']
  });

  /*
  assert({
    given: 'initial history',
    should,
    actual: historyBeforeTransfer[0],
    expected: {
      from: 'sevenflash14',
      to: defaultAccount,
      amount: '10.0000',
      symbol: 'EOS1'
    }
  })
  */

  wallet.transfer({
    symbol: 'EOS1',
    amount: '1.0001',
    from: 'sevenflash12',
    to: 'sevenflash13'
  });

  const tokensAfterTransfer = wallet.tokens(defaultAccount);
  // const historyAfterTransfer = wallet.tokens(defaultAccount);

  assert({
    given: 'transfer performed',
    should,
    actual: path(['EOS1', 'amount'], tokensAfterTransfer),
    expected: '8.9999'
  });
/*
  assert({
    given: 'transfer performed',
    should,
    actual: historyAfterTransfer[2],
    expected: {
      from: 'sevenflash12',
      to: 'sevenflash13',
      amount: '10.0000',
      symbol: 'EOS1'
    }
  });
*/
});