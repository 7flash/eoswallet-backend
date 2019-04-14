const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let currentBalance = {
  'EOS': {
    symbol: 'EOS',
    name: 'EOS Token',
    amount: 20,
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

app.listen(3001);

console.log('listening...');