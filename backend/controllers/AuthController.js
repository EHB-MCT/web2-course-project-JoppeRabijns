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
      password: hashedPass
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
            username: user,
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

module.exports = {
  register,
  login
};