const dotenv = require('dotenv');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const mongoose = require ('mongoose');

port = process.env.PORT;
hostname = process.env.HOSTNAME;
dbURL = process.env.DB_URL;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
//app.use('/', routes);     //TEMPORARILY DISABLED WHILE ROUTES HAVE NOT YET BEEN ESTABLISHED

dotenv.config();

port = process.env.PORT;
hostname = process.env.HOSTNAME;
dbURL = process.env.DB_URL;

app.use(express.static('public'));

mongoose.connect (dbURL, {useNewURLParser: true, useUnifiedTopology: true});

app.listen(port, hostname, function () {
    console.log('Server is running at:');
    console.log('http://' + hostname + ':' + port);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '\\' + 'index.html');
});
