require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const depositRoutes = require('./routes/deposit');
const ppobRoutes = require('./routes/ppob');

app.use('/api', depositRoutes);
app.use('/api', ppobRoutes);

app.listen(3000, () => console.log('Running at http://projectsdinamis.vinnn.tech:3000'));
