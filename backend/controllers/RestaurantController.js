const Restaurant = require('../model/restaurant');

const all = (req, res, next) => {
  Restaurant.find({}).then(function (restaurants, error) {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(restaurants);
  });
}

const add = (req, res, next) => {
  let restaurant = new Restaurant({
    type: "Feature",
    name: req.body.name,
    address: req.body.address,
    description: req.body.description,
    coordinate1: req.body.coordinate1,
    coordinate2: req.body.coordinate2,
  });
  restaurant.save()
    .then(restaurant => {
      res.json({
        message: "added restaurant succesfully!",
      })
    })
    .catch(error => {
      res.json({
        message: error
      })
    })
}

module.exports = {
  all,
  add
};