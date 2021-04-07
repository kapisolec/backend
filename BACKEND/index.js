const jwt = require('jsonwebtoken');
const express = require('express');
const routes = require('./router');
require('dotenv').config();
require('./Database');
const cors = require('cors');
const app = express();

const port = 3000;
app.use(express.json());
app.use(routes);
app.use(cors());

app.listen(port, () => console.log(`Example app listening on port 3000!`));
