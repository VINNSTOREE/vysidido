const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const fs = require('fs');
const dbFile = './db-ppob.json';

function saveLog(data) {
  const logs = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile)) : [];
  logs.push(data);
  fs.writeFileSync(dbFile, JSON.stringify(logs, null, 2));
}

router.post('/ppob/ewallet', async (req, res) => {
  const { nomor, provider, nominal } = req.body;
  const apiKey = process.env.OKEKOCENT_APIKEY;

  const payload = new URLSearchParams({
    key: apiKey,
    action: 'order',
    service: provider,
    target: nomor,
    quantity: nominal
  });

  const response = await fetch('https://okekocent.com/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload
  });

  const json = await response.json();
  saveLog({ nomor, provider, nominal, result: json, time: new Date() });

  res.json(json);
});

module.exports = router;