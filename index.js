import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import hbs from "hbs";
import mongoose from "mongoose";
import passport from "passport";
import routes from "./routes/routes.js";


dotenv.config ();

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const dbURL = process.env.DB_URL;


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
// hbs.registerPartials (__dirname + '/views/partials'); //not defined?? 
app.use ('/', routes);     //TEMPORARILY DISABLED WHILE ROUTES HAVE NOT YET BEEN ESTABLISHED

app.listen (port, hostname, function () {
    console.log ('Server is running at:');
    console.log ('http://' + hostname + ':' + port);
});

//TEMPORARY LANDING PAGE
// app.get ('/', function(req, res) {
//     res.sendFile (__dirname + '\\' + 'index.html');
// });
