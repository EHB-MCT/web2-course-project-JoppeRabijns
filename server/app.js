//express
const express = require('express');
const app = express();
const port = 3000;
const apiRouter = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  query
} = require('express');

//Mongo
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster0.bo4mb.mongodb.net/glutenvrijdichtbij?retryWrites=true&w=majority";
const dbName = 'glutenvrijdichtbij';
const client = new MongoClient(uri, {
  useNewUrlParser: true
});


//middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);


app.get('/', (req, res) => {
  res.send(`http://${req.headers.host}/api/restaurants`);
});

//router
apiRouter.route('/restaurants')
  .get((req, res) => {
    const database = client.db(dbName);
    const collection = database.collection("restaurants");
    const cursor = collection.find().toArray((err, result) => {
      if (err) {
        return res.status(500).send(err);
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

app.listen(port, () => {
  client.connect(err => {
    if (err) {
      throw err;
    }
    console.log(`Example app listening at http://localhost:${port}`);
  });
});