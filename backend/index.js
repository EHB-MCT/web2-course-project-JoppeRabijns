//express
const express = require('express');
const app = express();
const port = (process.env.PORT || 3000);
const apiRouter = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const listEndpoints = require("express-list-endpoints");
const path = require("path");

//Mongo
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster0.bo4mb.mongodb.net/glutenvrijdichtbij?retryWrites=true&w=majority";
const dbName = 'glutenvrijdichtbij';
const ObjectId = require("mongodb").ObjectID;
const client = new MongoClient(uri, {
  useNewUrlParser: true
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

//middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//router
apiRouter.route('/restaurants')
  .get((req, res) => {
    const database = client.db(dbName);
    const collection = database.collection("restaurants");
    const cursor = collection.find().toArray((error, result) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.json(result);
    });
  })
  .post((req, res) => {
    const database = client.db(dbName);
    const collection = database.collection("restaurants");
    collection.insertOne(req.body).then(result => {
      res.json(req.body);
      console.log(req.body);
    }).catch((error) => {
      return res.status(500).send(error);
    });
  });

apiRouter.route('/restaurants/:id')
  .get((request, response) => {
    const database = client.db(dbName);
    const collection = database.collection("restaurants");
    collection.findOne({
      "_id": new ObjectId(request.params.id)
    }, (error, result) => {
      if (error) {
        return response.status(500).send(error);
      }
      response.send(result);
    });
  });

app.listen(port, () => {
  client.connect(err => {
    if (err) {
      throw err;
    }
    console.log(`Example app listening at http://localhost:${port}`);
  });
});