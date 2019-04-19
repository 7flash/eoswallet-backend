const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const wallet = require('./mockWallet');

const arrayBalance = (balance) => {
  const keys = Object.keys(balance);

  return keys.map((key) => ({
    ...balance[key]
  }))
}

app.post('/transfer', async (request, response) => {
  let { symbol, amount, amountWithSymbol, from, to } = request.body;

  if (!amount || !symbol) {
    [symbol, amount] = amountWithSymbol.split(' ');
  }

  const transaction = await wallet.transfer({ symbol, amount, from, to });

  response.json(transaction);
})

app.get('/tokens', async (request, response) => {
  const balance = await wallet.tokens();

  response.json(arrayBalance(balance));
})

app.get('/history', async (request, response) => {
  const history = await wallet.history();

  response.json(history);
})

app.listen(3043);

console.log('runnnig on port 3043...');