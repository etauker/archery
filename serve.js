console.log('serve.js being executed');

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
const securityLoginWebappEndpoint = '/login';
const securityLogoutWebappEndpoint = '/logout';
const archeryWebappEndpoint = '/archery';
const glucoseWebappEndpoint = '/glucose';
const glucoseChartsWebappEndpoint = '/glucose-charts';
// Disabled until: v1.3
// const archeryWebappDirectory = __dirname + "/presentation/com.etauker.archery/archery-ui5/webapp";
const securityLoginWebappDirectory = __dirname + "/dependencies/com.etauker.security.login/frontend/webapp/dist";
const securityLogoutWebappDirectory = __dirname + "/dependencies/com.etauker.security.logout/frontend/webapp/dist";
const glucoseWebappDirectory = __dirname + "/presentation/com.etauker.glucose/webapp";
const glucoseChartsWebappDirectory = __dirname + "/dependencies/com.etauker.glucose.charts/frontend/dist";
const modules = [ "data", "persistence", "logic", "service", "utils" ];
const dependencies = [
    "com.etauker.security",
    "com.etauker.archery",
    "com.etauker.glucose",
    "com.etauker.glucose.charts/frontend",
    "com.etauker.security.login/frontend"
];

// App preparation
// app.use(express.logger('dev'));
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
global.paths = {
    logs: "logs"
};

// Print configuration
console.log(`--- App configuration ---`);
console.log("Port: " + port);
// Disabled until: v1.3
// console.log("Archery webapp endpoint: " + archeryWebappEndpoint);
console.log("Security Login webapp endpoint: " + securityLoginWebappEndpoint);
console.log("Security Logout webapp endpoint: " + securityLogoutWebappEndpoint);
console.log("Glucose Transactions webapp endpoint: " + glucoseWebappEndpoint);
console.log("Glucose Charts webapp endpoint: " + glucoseChartsWebappEndpoint);

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
// Disabled until: v1.3
// var archeryRouter = require(ArcheryServicePath)(app);
// app.use("/api", archeryRouter)
var glucoseRouter = require(GlucoseServicePath)(app, global.paths);
app.use("/glucose", glucoseRouter)

// Import the webapp
// Disabled until: v1.3
// app.use(archeryWebappEndpoint, express.static(archeryWebappDirectory));
app.use(securityLoginWebappEndpoint, express.static(securityLoginWebappDirectory));
app.use(securityLogoutWebappEndpoint, express.static(securityLogoutWebappDirectory));
app.use(glucoseWebappEndpoint, express.static(glucoseWebappDirectory));
app.use(glucoseChartsWebappEndpoint, express.static(glucoseChartsWebappDirectory));



app.all(`${glucoseChartsWebappEndpoint}/assets/*`, function(req, res, next) {
    res.sendFile(`${glucoseChartsWebappDirectory}${req.path}`);
});
app.all(`${glucoseChartsWebappEndpoint}/*`, function(req, res, next) {
    res.sendFile(`${glucoseChartsWebappDirectory}/index.html`);
});

// Start the server
app.listen(port);
console.log("--- App listening ---");
console.log("Security Login: " + securityLoginWebappEndpoint);
console.log("Security Logout: " + securityLogoutWebappEndpoint);
console.log("Glucose Transactions: " + glucoseWebappEndpoint);
console.log("Glucose Charts: " + glucoseChartsWebappEndpoint);
