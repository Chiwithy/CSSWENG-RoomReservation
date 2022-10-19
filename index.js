import "dotenv/config";
import express from "express";
import hbs from "hbs";
import mongoose from "mongoose";
import routes from "./routes/routes.js";

//To be removed til routes/paths are established
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath (import.meta.url);
const __dirname = path.dirname(__filename);


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
//app.use ('/', routes);     //TEMPORARILY DISABLED WHILE ROUTES HAVE NOT YET BEEN ESTABLISHED

app.listen (port, hostname, function () {
    console.log ('Server is running at:');
    console.log ('http://' + hostname + ':' + port);
});

//TEMPORARY LANDING PAGE
app.get ('/', function(req, res) {
    res.sendFile (__dirname + '\\index.html')
});