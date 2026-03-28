const express = require('express');
const carousel = require('./routes/carousel');
const library = require('./routes/library');
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

process.env.DOTENV_CONFIG_DEBUG = "false";
require("dotenv").config();

app.set('trust proxy', 2);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], 
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL]
    }
  }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);


app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

try{
  app.use(express.json());

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 75,
  });

  app.use('/api', apiLimiter);
  app.use('/api/carousel', carousel);
  app.use('/api/library', library);
  app.post('/api/contact', async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.message) {
      return res.status(400).json({ success: false, message: 'Input fields are required' });
    }
    const response = await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) {
      throw new Error('Failed to send contact message');
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});
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