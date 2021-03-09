// Require Libraries
require('dotenv').config();
const express = require('express');
require('./database/recipea-db');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Middleware
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
require('express-validator');

// App Setup
const app = express();
const publicPath = path.join(__dirname, 'public');

app.engine('hbs', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'hbs');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(cookieParser());

const checkAuth = (req, _res, next) => {
  console.log('Checking authentication');
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
  } else {
    const token = req.cookies.nToken;
    const decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    console.log(req.user);
  }
  next();
};

app.use(checkAuth);
app.use('/', express.static(publicPath));
// Routes
app.get('/', (req, res) => {
  const currentUser = req.user;
  res.render('index', { currentUser });
});

require('./controllers/user')(app);
require('./controllers/content')(app);

// Start Server

if (require.main === module) {
  app.listen(process.env.PORT, () => {
    console.log(`Listening at http://localhost:${process.env.PORT}`);
  });
}

module.exports = app;