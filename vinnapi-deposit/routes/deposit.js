const express = require('express');
const router = express.Router();
const fs = require('fs');
const QRCode = require('qrcode');
const dbFile = './db-deposit.json';

function loadDB() {
  return fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile)) : [];
}
function saveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

router.post('/deposit', async (req, res) => {
  const nominal = Number(req.body.nominal);
  if (!nominal) return res.status(400).json({ error: 'Nominal tidak valid' });

  const reff_id = 'DEP' + Date.now();

  // Pakai QR Code statis yang kamu kasih
  const qr_string = '00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214249245531475870303UMI51440014ID.CO.QRIS.WWW0215ID20222128523070303UMI5204481453033605802ID5908VIN GANS6008SIDOARJO61056121262070703A0163040DB5';
  const qr_image = await QRCode.toDataURL(qr_string);

  const newData = {
    reff_id,
    nominal,
    status: 'Pending',
    expired: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    qr_string
  };

  const db = loadDB();
  db.push(newData);
  saveDB(db);

  res.json({ ...newData, qr_image });
});

router.post('/status', (req, res) => {
  const { reff_id } = req.body;
  const db = loadDB();
  const trx = db.find(t => t.reff_id === reff_id);
  if (!trx) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
  res.json(trx);
});

module.exports = router;