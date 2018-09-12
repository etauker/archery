const express = require('express');
const open = require('open');
const connect = require('connect');
const compression = require('compression');
const serveIndex = require('serve-index');
const directory = require('directory');
const app = express();
const port = process.env.PORT || 8888;
const webapp = '/webapp';
const url = 'http://localhost:' + port + webapp;
const year = 60 * 60 * 24 * 365 * 1000;

app.use(express.static(__dirname+"/webapp"));
// app.configure(function () {
//     app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
//     app.use(express.bodyParser());
// });

// var express = require('express'),
//     open = require('open');
//     app = express(),
//     port = process.env.PORT || 8888,
//     webapp = '/webapp'
//     url = 'http://localhost:' + port + webapp,
//     year = 60 * 60 * 24 * 365 * 1000;
//
// // Use compress middleware to gzip content
// app.use(compression());
// //set default mime type to xml for ".library" files
// express.static.mime.default_type = "text/xml";
// // Serve up content directory showing hidden (leading dot) files
// app.use(webapp, express.static(__dirname+"/webapp", { maxAge: year, hidden: true }));
// // enable directory listening
// app.use(webapp, serveIndex(__dirname+"/webapp/", {'icons': true}));
app.listen(port);
open(url); //open in default browser
console.log("Static file server running at\n  => " + url + " \nCTRL + C to shutdown")

//
// app.get('/', (req, res) => res.send('Hello World!'))
//
// app.listen(port, () => console.log('Example app listening on port 3000!'))
