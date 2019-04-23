// Registering aliases throughout the server side application
// require("module-alias/register");

// built in libraries
const fs                             = require('fs');
const http                           = require('http');
const path                           = require('path');
const dotenv                         = require('dotenv');

// 3rd party libraries
const express                        = require('express');
const bodyParser                     = require('body-parser');
const RateLimit                      = require('express-rate-limit');
const fileUpload                     = require('express-fileupload');

// server
const app            = express();
const server         = http.createServer(app);

dotenv.config()

// Each ip limited to 100 requests / 15 minutes with 0 delay
var limiter = new RateLimit({
  windowMs: 15*60*1000,
  max: 100,
  delayMs: 0
});

// Set up mongoose connection
const mongoose = require('mongoose');
// TODO: Ensure that the correct Mongo DB URI is added here
let mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//  apply to all requests
app.use(limiter);

// We ensure that every request is a json, as this is a JSON API
app.use(bodyParser.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {

    // We want to prevent browser from caching API responses
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    next();
});

// We go over all the directories in the controllers directory and file controller files
fs.readdirSync(path.join(__dirname, 'controllers')).forEach((directory) => {
    fs.readdirSync(path.join(__dirname, 'controllers', directory)).forEach((file) => {
        if (file.substr(-3) === '.js') {
            const filePath = path.join(__dirname, 'controllers', directory, file);
            var route = require(filePath);
            route.controller(app);
        }
    });
});

app.get('*', (req, res) => {
  res.json({"Success": true});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('Server is hosted on ' + PORT);
});

// exporting for test cases
module.exports = {app};