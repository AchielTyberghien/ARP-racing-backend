const express = require('express');
const carousel = require('./routes/carousel');
const app = express();
const cors = require("cors");

process.env.DOTENV_CONFIG_DEBUG = "false";
require("dotenv").config();

app.use(cors());

try{
  app.use(express.json());
  app.use('/api/carousel', carousel);
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
