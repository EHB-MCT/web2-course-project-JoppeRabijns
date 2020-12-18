//express
const express = require('express');
const port = (process.env.PORT || 3000);
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const listEndpoints = require("express-list-endpoints");


mongoose.connect("mongodb+srv://root:root@cluster0.bo4mb.mongodb.net/glutenvrijdichtbij?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', (err) => {
  console.log(err);
});

db.on('open', () => {
  console.log("Database connection open");
});

app.use(cors());

//ROUTES
const AuthRoute = require('./routes/auth');
const RestaurantRoute = require('./routes/restaurant');

app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

const authenticate = require('./middleware/authentification');

app.get('/checkLogin', authenticate, (req, res) => {
  res.send("true");
});

//MIDDLEWARE 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/api', AuthRoute);
app.use('/api', RestaurantRoute);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});