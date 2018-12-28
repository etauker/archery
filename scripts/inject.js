const fs = require('fs');
const path = require('path');
let i18nFiles = [];
let i18nRegex = /.*i18n.*\.properties/g;

console.log(`--- Detecting i18n files ---`);
findFiles('./presentation', i18nRegex, i18nFiles);

console.log(`--- Injecting environment variables ---`)
i18nFiles.forEach(file => {

    let content = "";
    if (fs.existsSync(file)) {

        // Read file
        try {
            content = fs.readFileSync(file, 'utf8');
        }
        catch (oError) {
            console.warn(`[error] Error occured while reading ${file}.`);
            console.warn(`[error] ${JSON.stringify(oError)}`);
        }

        // Inject environment variables
        let injected = false;
        if (process.env.PROTOCOL) {
            content = content.replace(/env\.PROTOCOL=.*/g, `env.PROTOCOL=${process.env.PROTOCOL}`)
            injected = true;
        }
        if (process.env.HOST) {
            content = content.replace(/env\.HOST=.*/g, `env.HOST=${process.env.HOST}`)
            injected = true;
        }
        if (process.env.PORT) {
            content = content.replace(/env\.PORT=.*/g, `env.PORT=${process.env.PORT}`)
            content = content.replace(/env\.COLON=.*/g, `env.COLON=:`)
            injected = true;
        }
        if (injected) {
            console.log(`Injected into ${file}`)
        }

        // Write file
        try {
            fs.writeFileSync(file, content);
        }
        catch (oError) {
            console.warn(`[error] Error occured while writing to ${file}.`);
            console.warn("[error] " + oError);
        }
    }
});


// =============================================
//               HELPER FUNCTIONS
// =============================================
function findFiles(rootDirectory, regex, array) {

    if (!fs.existsSync(rootDirectory)){
        console.log(`-- ${rootDirectory} not found!`);
        return;
    }

    const files = fs.readdirSync(rootDirectory);
    files.forEach(file => {
        const filename = path.join(rootDirectory, file);
        const stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            findFiles(filename, regex, array);
        }
        else if (regex.test(filename)) {
            console.log(`Detected: ${filename}`);
            array.push(filename);
        };
    });
};
