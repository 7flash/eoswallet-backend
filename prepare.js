const express = require('express');
const eos = require('./eos');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/prepareTransaction', async (request, response) => {
  console.log(request.body);

  const { senderAccount, beneficiaryAccount, amount } = request.body;

  const serializedTransaction = await eos.prepareTransaction({
    senderAccount, beneficiaryAccount, amount
  });

  response.json(JSON.stringify(serializedTransaction));
});

app.listen(3001);

console.log('listening...');