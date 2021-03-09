require('cookie-parser');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/users');
const isrecipe = require('../utils/isrecipe');

module.exports = (app) => {
  app.get(
    '/user/create',
    (req, res) => {
      if (req.user === null) {
        return res.render('createUser');
      }
      return res.render('invalid');
    },
  );
  app.post(
    '/user/create',
    body('username').isString(),
    body('password').isString().isStrongPassword(),
    body('email').isEmail(),
    body('publicRecipe').custom(isrecipe),
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (!req.user === null) {
        return res.status(401).send({ message: 'Not Authorised' });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // eslint-disable-next-line no-console
        console.log(errors);
        return res.status(400).render('invalid');
      }
      User
        .findOne({ username: req.body.username })
        // eslint-disable-next-line consistent-return
        .then((foundUser) => {
          if (foundUser === null) {
            const user = User({
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              publicEthAddress: req.body.publicEthAddress,
            });
            user
              .save()
              .then((savedUser) => {
                // eslint-disable-next-line no-underscore-dangle
                const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET, { expiresIn: '60 days' });
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                return res.redirect('/');
              })
              .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
                return res.status(400).render('invalid');
              });
          } else {
            return res.render('createUser', { message: 'Username taken' });
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    },
  );
  app.get(
    '/user',
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      return res.render('user', { user: req.user });
    },
  );
  app.get(
    '/user/update',
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      return res.render('userUpdate');
    },
  );
  app.put(
    '/user/update',
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      User
        // eslint-disable-next-line no-underscore-dangle
        .findOneAndUpdate({ _id: req.user._id }, {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          publicEthAddress: req.body.publicEthAddress,
        })
        .then(() => res.render('user'))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
    },
  );
  app.delete(
    '/user/delete',
    (req, res) => {
      User
        // eslint-disable-next-line no-underscore-dangle
        .findByIdAndDelete(req.user._id, (err) => {
          res.clearCookie('nToken');
          // eslint-disable-next-line no-console
          console.log(err);
          return res.redirect('/');
        });
    },
  );
  app.get(
    '/user/login',
    (req, res) => {
      if (req.user === null) {
        return res.render('userLogin');
      }
      return res.status(400).render('invalid');
    },
  );
  app.post(
    '/user/login',
    body('username').isString(),
    body('password').isString().isStrongPassword(),
    (req, res) => {
      if (req.user === null) {
        User
          .findOne({ username: req.body.username })
          .then((foundUser) => {
            foundUser.comparePassword(req.body.password, (err, isMatch) => {
              if (!isMatch) {
                // Password does not match
                return res.status(401).send({ message: 'Wrong Username or password' });
              }
              // eslint-disable-next-line no-underscore-dangle
              const token = jwt.sign({ _id: foundUser._id }, process.env.SECRET, { expiresIn: '60 days' });
              res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
              return res.redirect('/');
            });
          });
      }
      return res.status(404).render('invalid');
    },
  );
  app.get(
    '/logout',
    (req, res) => {
      res.clearCookie('nToken');
      res.redirect('/');
    },
  );
};