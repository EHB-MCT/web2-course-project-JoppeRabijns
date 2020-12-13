const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  "type": {
    type: String
  },
  "coordinate1": {
    type: Number
  },
  "coordinate2": {
    type: Number
  },
  "name": {
    type: String
  },
  "description": {
    type: String
  },
  "address": {
    type: String
  }
});

const Restaurant = mongoose.model('Restaurants', restaurantSchema);
module.exports = Restaurant;