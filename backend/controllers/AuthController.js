const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err
      })
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
      favorites: []
    })
    user.save()
      .then(user => {
        res.json({
          message: "added user succesfully!"
        })
      })
      .catch(error => {
        res.json({
          message: 'an error occured'
        })
      })
  })
}

const login = (req, res, next) => {
  let username = req.body.username
  let password = req.body.password
  User.findOne({
    $or: [{
      email: username
    }, {
      phone: username
    }]
  }).then(user => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            error: err
          })
        }
        if (result) {
          let token = jwt.sign({
            name: user.name
          }, '$&dkY6', {
            expiresIn: '1h'
          })
          res.json({
            userId: user._id,
            message: 'login succesfull',
            token: token
          })
        } else {
          res.json({
            message: 'password does not match'
          })
        }
      })
    } else {
      res.json({
        message: "no user found"
      })
    }
  })
}

const userData = (req, res, next) => {
  let id = req.params.id
  User.findById(id,
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      };
    }
  )
};
module.exports = {
  register,
  login,
  userData
};