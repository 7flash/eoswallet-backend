const R = require("ramda");

const tokensInfo = {
  'EOS': {
    symbol: 'EOS',
    name: 'EOS Token',
    decimals: 4,
  },
  'JUNGLE': {
    symbol: 'JUNGLE',
    name: 'JUNGLE Token',
    decimals: 4
  }
}

const defaultTokens = {
  'EOS': '1.0000',
  'JUNGLE': '1000.0000'
}

let state = {
  'sevenflash12': {
    tokens: defaultTokens,

    history: []
  },
  'sevenflash13': {
    tokens: defaultTokens,

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


const transfer = ({ symbol, amount, from, to }) => {
  if (!tokensInfo[symbol]) {
    return { txId: 'token does not exists' }
  }

  if (!state[from]) {
    state[from] = {
      tokens: defaultTokens
    }
  }

  if (!state[to]) {
    state[to] = {
      tokens: defaultTokens
    }
  }

  updateState([
    decreaseBalance(symbol, amount, from),
    increaseBalance(symbol, amount, to),
    // addHistoryItems({ from, to, amount, symbol }),
  ]);

  return { txId: `${amount} ${symbol} transfered from ${from} to ${to}`}
}

const tokens = (account) => {
  if (!state[account]) {
    state[account] = {
      tokens: defaultTokens
    }
  }

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