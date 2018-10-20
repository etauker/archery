// Requires
const express = require('express');
const open = require('open');
const bodyParser = require('body-parser');
const fs = require('fs');

// Configuration
const port = process.env.PORT || 8888;
const archeryWebappEndpoint = '/archery';
const archeryWebappDirectory = __dirname + "/presentation/com.etauker.archery/archery-ui5/webapp";
const url = 'http://localhost:' + port + archeryWebappEndpoint;

global.REALM = "etauker.com";

// Global Import Paths
/* TODO: Refactor to automatically require all js files in:
*   [ data, persistence, logic, service, util ] for each etauker dependency.
*/
const modules = [ "persistence", "logic", "service", "util" ];
const dependencies = [
    "com.etauker.security",
    "com.etauker.archery"
];

dependencies.forEach(library => {

    // Extract name of the library
    // let libName = library.substring("com.etauker.".length);
    // console.log("Importing: " + libName);

    // Import the modules
    modules.forEach(module => {

        let path = __dirname + "/dependencies/" + library + "/" + module + "/"
        if (fs.existsSync(path)) {

            fs.readdirSync(path)
                .forEach(filename => {
                    let propertyName = filename.substring(0, filename.length - ".js".length) + "Path";
                    global[propertyName] = path + filename;
                });
        }
        // Example: SecurityPersistenceManagerPath
        // let uppercaseLibName = libName[0].toUpperCase() + libName.substring(1);
        // let propertyName = uppercaseLibName +
        // console.log(propertyName);






    });
});

//
// global.SecurityPersistenceManagerPath = __dirname + "/dependencies/com.etauker.security/persistence/SecurityPersistenceManager.js";
// global.SecurityTokenManagerPath = __dirname + "/dependencies/com.etauker.security/logic/SecurityTokenManager.js";
// global.SecurityErrorGeneratorPath = __dirname + "/dependencies/com.etauker.security/utils/SecurityErrorGenerator.js";
// global.SecurityServiceValidatorPath = __dirname + "/dependencies/com.etauker.security/utils/SecurityServiceValidator.js";
// global.SecurityPasswordManagerPath = __dirname + "/dependencies/com.etauker.security/utils/SecurityPasswordManager.js";
// global.SecurityServicePath = __dirname + "/dependencies/com.etauker.security/service/SecurityService.js";
//
// // Archery Import Path
// global.ArcheryPersistenceManagerPath = __dirname + "/dependencies/com.etauker.archery/persistence/ArcheryPersistenceManager.js";
// global.ArcheryServicePath = __dirname + "/dependencies/com.etauker.archery/service/ArcheryService.js";
// global.ArcheryErrorGeneratorPath = __dirname + "/dependencies/com.etauker.archery/utils/ArcheryErrorGenerator.js";

// App preparation
const app = express();
console.log("port: " + port);
console.log("archeryWebappEndpoint: " + archeryWebappEndpoint);

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Import additional services
// TODO: Refactor to require all files in the service directory
var securityRouter = require(SecurityServicePath)(app);
app.use("/security", securityRouter)
var archeryRouter = require(ArcheryServicePath)(app);
app.use("/api", archeryRouter)

// Import the webapp
app.use(archeryWebappEndpoint, express.static(archeryWebappDirectory));
// app.configure(function () {
//     app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
//     app.use(express.bodyParser());
// });

// Start the server
app.listen(port);
console.log("App listening at url => " + url)
// open(url); //open in default browser
