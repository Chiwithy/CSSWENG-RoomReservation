const express = require (`express`);
const passport = require ('passport');

const userController = require (`../controllers/userController.js`);

const app = express ();

app.post ('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true}), userController.postLogin)

module.exports = app;