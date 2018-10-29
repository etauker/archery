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
const modules = [ "data", "persistence", "logic", "service", "utils" ];
const dependencies = [
    "com.etauker.security",
    "com.etauker.archery",
    "com.etauker.glucose"
];

// App preparation
// app.use(express.logger('dev'));
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
global.paths = {};

// Print configuration
console.log(`--- App configuration ---`);
console.log("Port: " + port);
console.log("Archery webapp endpoint: " + archeryWebappEndpoint);

// For each dependency...
dependencies.forEach(library => {
    console.log(`--- Loading dependencies for ${library} ---`);

    // ...for each module...
    modules.forEach(module => {
        let path = `${__dirname}/dependencies/${library}/dist/${module}/`;
        let count = 0;
        if (fs.existsSync(path)) {

            // ...for each file...
            fs.readdirSync(path).forEach(filename => {

                // ...store the file path as a global variable
                count++;
                filename = filename.replace(".js", "");
                let propertyName = `${filename}Path`;
                global.paths[propertyName] = `${path}${filename}`;
                global[propertyName] = `${path}${filename}`;//Temp
            });
        }
        console.log(`Registered ${count} dependency paths for ${module}`);
    });
});

// Import services
var securityRouter = require(SecurityServicePath)(app);
app.use("/security", securityRouter)
var archeryRouter = require(ArcheryServicePath)(app);
app.use("/api", archeryRouter)
var glucoseRouter = require(GlucoseServicePath)(app, global.paths);
app.use("/glucose", glucoseRouter)

// Import the webapp
app.use(archeryWebappEndpoint, express.static(archeryWebappDirectory));

// Start the server
app.listen(port);
console.log("--- App listening ---");
console.log("url => " + url)
// open(url); //open in default browser
