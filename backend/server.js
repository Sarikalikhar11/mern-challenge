const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const axios = require('axios');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4800;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/mern_challenge';

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo DB Connected'))
  .catch((err) => console.log(err));

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
