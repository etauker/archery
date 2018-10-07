// Requires
const express = require('express');
const open = require('open');
const bodyParser = require('body-parser')

// Configuration
const port = process.env.PORT || 8888;
const webappEndpoint = '/webapp';
const webappDirectory = __dirname + "/archery-ui5/webapp";
const url = 'http://localhost:' + port + webappEndpoint;

// Global Import Paths
/* TODO: Refactor to automatically require all js files in:
*   [ data, persistence, logic, service, util ] for each etauker dependency.
*/
global.SecurityPersistenceManagerPath = __dirname + "/dependencies/com.etauker.security/persistence/SecurityPersistenceManager.js";
global.SecurityTokenManagerPath = __dirname + "/dependencies/com.etauker.security/logic/SecurityTokenManager.js";
global.SecurityErrorGeneratorPath = __dirname + "/dependencies/com.etauker.security/utils/SecurityErrorGenerator.js";
global.SecurityParameterValidatorPath = __dirname + "/dependencies/com.etauker.security/utils/SecurityParameterValidator.js";
global.SecurityServiceValidatorPath = __dirname + "/dependencies/com.etauker.security/utils/SecurityServiceValidator.js";
global.SecurityPasswordManagerPath = __dirname + "/dependencies/com.etauker.security/utils/SecurityPasswordManager.js";
global.SecurityServicePath = __dirname + "/dependencies/com.etauker.security/service/SecurityService.js";

// App preparation
const app = express();
console.log("port: " + port);
console.log("webappEndpoint: " + webappEndpoint);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Import additional services
// TODO: Refactor to require all files in the service directory
require(SecurityServicePath)(app);

// Import the webapp
app.use(webappEndpoint, express.static(webappDirectory));
// app.configure(function () {
//     app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
//     app.use(express.bodyParser());
// });

// Start the server
app.listen(port);
console.log("App listening at url => " + url)
// open(url); //open in default browser
