const bodyParser = require ('body-parser');
const dotenv = require ('dotenv');
const express = require ('express');
const hbs = require ('hbs');
const mongoose = require ('mongoose');
const passport = require ('passport');
const routes = require ('./routes/routes.js');


dotenv.config ();

port = process.env.PORT;
hostname = process.env.HOSTNAME;
dbURL = process.env.DB_URL;


mongoose.connect (dbURL, {useNewURLParser: true, useUnifiedTopology: true}, (error) => {
    if (error) throw error;
    else console.log ("Connected to: " + dbURL);
});

const app = express ();
app.use (express.json());
app.use (express.urlencoded ({extended: true}));
app.use (passport.initialize ());

app.use (express.static('public'));

app.set ('view engine', 'hbs');
hbs.registerPartials (__dirname + '/views/partials');
//app.use ('/', routes);     //TEMPORARILY DISABLED WHILE ROUTES HAVE NOT YET BEEN ESTABLISHED

app.listen (port, hostname, function () {
    console.log ('Server is running at:');
    console.log ('http://' + hostname + ':' + port);
});

//TEMPORARY LANDING PAGE
app.get ('/', function(req, res) {
    res.sendFile (__dirname + '\\' + 'index.html');
});