import "dotenv/config";
import express from "express";
import hbs from "hbs";
import mongoose from "mongoose";
import routes from "./routes/routes.js";
import passport from "passport";
import session from "express-session";

const app = express ();
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const dbURL = process.env.DB_URL;
const secret = process.env.SESSION_SECRET;

mongoose.connect (dbURL, {useNewURLParser: true, useUnifiedTopology: true}, (error) => {
    if (error) throw error;
    else console.log ("Connected to: " + dbURL);
});

app.use (express.json());
app.use (express.urlencoded ({extended: true}));
app.use (express.static('public'));
app.use (session ({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));
app.use (passport.initialize ());
app.use (passport.session ());


app.set ('view engine', 'hbs');
hbs.registerPartials ( './views/partials');
app.use ('/', routes);

app.listen (port, hostname, function () {
    console.log ('Server is running at:');
    console.log ('http://' + hostname + ':' + port);
});