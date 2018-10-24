// Requires
const express = require('express');
const open = require('open');
const bodyParser = require('body-parser');
const fs = require('fs');

// Globals
global.REALM = "etauker.com";

// Configuration
const app = express();
const port = process.env.PORT || 8888;
const archeryWebappEndpoint = '/archery';
const archeryWebappDirectory = __dirname + "/presentation/com.etauker.archery/archery-ui5/webapp";
const url = 'http://localhost:' + port + archeryWebappEndpoint;
const modules = [ "persistence", "logic", "service", "utils" ];
const dependencies = [
    "com.etauker.security",
    "com.etauker.archery"
];

// App preparation
// app.use(express.logger('dev'));
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Print configuration
console.log(`--- App configuration ---`);
console.log("Port: " + port);
console.log("Archery webapp endpoint: " + archeryWebappEndpoint);

// For each dependency...
dependencies.forEach(library => {
    console.log(`--- Loading dependencies for ${library} ---`);

    // ...for each module...
    modules.forEach(module => {
        let path = `${__dirname}/dependencies/${library}/${module}/`;
        let count = 0;
        if (fs.existsSync(path)) {

            // ...for each file...
            fs.readdirSync(path).forEach(filename => {

                // ...store the file path as a global variable
                count++;
                filename = filename.replace(".js", "");
                let propertyName = `${filename}Path`;
                global[propertyName] = `${path}${filename}`;
            });
        }
        console.log(`Registered ${count} dependency paths for ${module}`);
    });
});


// Import services
var securityRouter = require(SecurityServicePath);
app.use("/security", securityRouter)
var archeryRouter = require(ArcheryServicePath);
app.use("/api", archeryRouter)

// Import the webapp
app.use(archeryWebappEndpoint, express.static(archeryWebappDirectory));

// Start the server
app.listen(port);
console.log("--- App listening ---");
console.log("url => " + url)
// open(url); //open in default browser
