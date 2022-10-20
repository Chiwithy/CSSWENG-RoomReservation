import "dotenv/config";
import express from "express";
import hbs from "hbs";
import mongoose from "mongoose";
import routes from "./routes/routes.js";


const app = express ();
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const dbURL = process.env.DB_URL;

mongoose.connect (dbURL, {useNewURLParser: true, useUnifiedTopology: true}, (error) => {
    if (error) throw error;
    else console.log ("Connected to: " + dbURL);
});

app.use (express.json());
app.use (express.urlencoded ({extended: true}));

app.use (express.static('public'));


app.set ('view engine', 'hbs');
hbs.registerPartials ( './views/partials');
app.use ('/', routes);

app.listen (port, hostname, function () {
    console.log ('Server is running at:');
    console.log ('http://' + hostname + ':' + port);
});
