// Requires
const express = require('express');
const open = require('open');

// Configuration
const port = process.env.PORT || 8888;
const webappEndpoint = '/webapp';
const webappDirectory = __dirname + "/archery-ui5/webapp";
const url = 'http://localhost:' + port + webappEndpoint;

// App preparation
const app = express();
console.log("port: " + port);
console.log("webappEndpoint: " + webappEndpoint);

// Import additional services
// TODO: Refactor to require all files in the service directory
require('./service/Security.js')(app);

// Import the webapp
app.use(webappEndpoint, express.static(webappDirectory));
// app.configure(function () {
//     app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
//     app.use(express.bodyParser());
// });

// Start the server
app.listen(port);
console.log("App listening at url => " + url)
open(url); //open in default browser
