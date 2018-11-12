let i18nFiles = [
    "./presentation/com.etauker.glucose/webapp/dependencies/com.etauker.security/i18n/i18n.properties",
    "./presentation/com.etauker.glucose/webapp/i18n/i18n.properties"
]

const fs = require('fs');

i18nFiles.forEach(file => {

    let content = "";
    if (fs.existsSync(file)) {

        try { content = fs.readFileSync(file, 'utf8'); }
        catch (oError) {
            console.warn(`[error] Error occured while reading ${file}.`);
            console.warn("[error] " + oError);
        }

        if (process.env.PROTOCOL)
            content = content.replace(/env\.PROTOCOL=.*/g, `env.PROTOCOL=${process.env.PROTOCOL}`)
        if (process.env.HOST)
            content = content.replace(/env\.HOST=.*/g, `env.HOST=${process.env.HOST}`)
        if (process.env.PORT)
            content = content.replace(/env\.PORT=.*/g, `env.PORT=${process.env.PORT}`)

        console.log("--- Updated i18n File ---")

        try { fs.writeFileSync(file, content); }
        catch (oError) {
            console.warn(`[error] Error occured while writeing to ${file}.`);
            console.warn("[error] " + oError);
        }
    }
})
