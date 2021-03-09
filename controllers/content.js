require('cookie-parser');
const { body, validationResult } = require('express-validator');
const User = require('../models/users');
const Content = require('../models/content');

// CREATE USER
module.exports = (app) => {
  app.get(
    '/content/create',
    (req, res) => {
      if (req.user === null) {
        return res.status(401).send({ message: 'Not Authorised' });
      }
      return res.render('contentCreate');
    },
  );
  // CREATE 
  app.post(
    '/content/create',
    body('title').isString(),
    body('content').isString(),
    (req, res) => {
      if (req.user === null) {
        return res.status(401).send({ message: 'Not Authorised' });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).render('invalid');
      }
      try {
      } catch (error) {
        return res.status(401).send({ message: 'Bad price input.' });
      }
      req.body.author = req.user._id;
      const createdContent = new Content(req.body);
      createdContent
        .save()
        .then(() => User.findOne({ _id: req.user._id }))
        .then((foundUser) => {
          console.log(foundUser);
          foundUser.content.unshift(createdContent);
          foundUser.save();
          res.redirect(`/content/${createdContent._id}`);
        })
        .catch((err) => console.log(err));
    },
  );
// UPDATE FUNCTION
  app.get(
    '/content/:id/update',
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      Content
        .findById(req.params.id)
        .then((foundContent) => {
          if (foundContent === null) {
            return res.render('invalid');
          }
          if (!foundContent.author._id === req.user._id) {
            return res.render('invalid');
          }
          return res.render('contentUpdate', { foundContent });
        });
    },
  );
  // UPDATE FUNCTION
  app.put(
    '/content/:id/update',
    body('title').isString(),
    body('content').isString(),
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      Content
        .findOneAndUpdate(
          {
            author: req.user._id,
            _id: req.params.id,
          },
          req.body,
        )
        .then((foundContent) => res.render('content', { foundContent }))
        .catch((err) => console.log(err));
    },
  );
  // DELETE FUNCTION
  app.delete(
    '/content/:id/delete',
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      Content
        .findOneAndDelete(
          {
            author: req.user._id,
            _id: req.params.id,
          },
          (err) => {
            if (err !== null) {
              console.log(err);
              return res.status(404).render('invalid');
            }
            return res.redirect('/');
          },
        );
    },
  );
};