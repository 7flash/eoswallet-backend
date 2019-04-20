const R = require("ramda");

const tokensInfo = {
  'EOS1': {
    symbol: 'EOS1',
    name: 'EOS1 Token',
    decimals: 4,
  },
  'EOS2': {
    symbol: 'EOS2',
    name: 'EOS2 Token',
    decimals: 4
  }
}

let state = {
  'sevenflash12': {
    tokens: {
      'EOS1': '10.0000',
      'EOS2': '20.0000'
    },

    history: []
  },
  'sevenflash13': {
    tokens: {
      'EOS1': '10.0000',
      'EOS2': '20.0000'
    },

    history: []
  }
}

const convertToUsd = (symbol, amount) => {
  switch (symbol) {
    case 'EOS1':
      return Number(Number(amount) * 10).toFixed(2);

    case 'EOS2':
      return Number(Number(amount) * 5).toFixed(2);
  }
}

const updateState = (changes) => {
  state = R.reduce(R.mergeDeepRight, {})([state, ...changes]);
}

const changeTokenBalance = (account, symbol, amount) => {
  return {
    [account]: {
      tokens: {
        [symbol]: amount
      }
    }
  }
}

const tokenAmount = (account, symbol) => Number(R.path([account, 'tokens', symbol], state));
const tokenDecimals = (symbol) => Number(R.path([symbol, 'decimals'], tokensInfo));

const decreaseBalance = (symbol, value, account) => {
    const decimals = tokenDecimals(symbol);
  const amount = Number(tokenAmount(account, symbol) - Number(value)).toFixed(decimals);

  return changeTokenBalance(account, symbol, amount);
}

const increaseBalance = (symbol, value, account) => {
  const decimals = tokenDecimals(symbol);
  const amount = Number(tokenAmount(account, symbol) + Number(value)).toFixed(decimals);

  return changeTokenBalance(account, symbol, amount);
}

const addHistoryItems = ({ from, to, amount, symbol }) => {
  return {
    [from]: {
      history: [{
        from, to, amount, symbol
      }]
    },
    [to]: {
      history: [{
        from, to, amount, symbol
      }]
    }
  }
}

const txMock = () => { txId: 'random_tx_id' };

const transfer = ({ symbol, amount, from, to }) => {
  updateState([
    decreaseBalance(symbol, amount, from),
    increaseBalance(symbol, amount, to),
    // addHistoryItems({ from, to, amount, symbol }),
  ])

  return txMock();
}

const tokens = (account) => {
  return R.compose(
    R.mapObjIndexed((amount, symbol) => ({
      ...tokensInfo[symbol],
      amount,
      usdAmount: convertToUsd(symbol, amount)
    })),
    R.path([account, 'tokens'])
  )(state);
}

const history = (account) => {
  return R.path([account, 'history'], state);
}

module.exports = {
  transfer,
  tokens,
  history
};