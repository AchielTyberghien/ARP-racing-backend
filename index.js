const express = require('express');
const carousel = require('./routes/carousel');
const library = require('./routes/library');
const app = express();
const helmet = require("helmet");
const cors = require("cors");


process.env.DOTENV_CONFIG_DEBUG = "false";
require("dotenv").config();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL]
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

try{
  app.use(express.json());
  app.use('/api/carousel', carousel);
  app.use('/api/library', library);
}
catch(ex){
  console.log(ex.message);
}

app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
