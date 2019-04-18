const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let currentBalance = {
  'EOS1': {
    symbol: 'EOS1',
    name: 'EOS1 Token',
    amount: '11.1111',
    decimals: 4
  },
  'EOS2': {
    symbol: 'EOS2',
    name: 'EOS2 Token',
    amount: '22.2222',
    decimals: 4
  }
}

const updateBalance = (balance, symbol, amount) => {
  const newBalance = balance[symbol].amount - Number(amount);

  return {
    ...balance,
    [symbol]: {
      ...balance[symbol],
      amount: newBalance.toFixed(4)
    }
  }
}

const arrayBalance = (balance) => {
  const keys = Object.keys(balance);

  return keys.map((key) => ({
    ...balance[key]
  }))
}

app.get('/balance', async (request, response) => {
  console.log(new Date());

  response.json(arrayBalance(currentBalance));
})

app.post('/transfer', async (request, response) => {
  const { symbol, amount } = request.body;

  currentBalance = updateBalance(currentBalance, symbol, amount);

  console.log(currentBalance);

  response.json({ ok: true });
})

app.listen(3043);

console.log('listening...');