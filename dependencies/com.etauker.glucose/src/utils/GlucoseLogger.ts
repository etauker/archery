class GlucoseLogger {

    //===========================================
    //              PROPERTIES
    //===========================================
    private fs;
    private paths;

    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(paths: string[]) {
        this.fs = require('fs');
        this.paths = paths;
    }

    //===========================================
    //             PUBLIC FUNCTIONS
    //===========================================
    public logObject = (oObject: any, sIdentifier:string, sFunction: string, sClass: string): void => {
        let sMessage = this._getFilledTemplate(oObject, sIdentifier, sFunction, sClass);
        let sDate = new Date().toISOString().substring(0, 10);
        let sFile = this.paths.logs ? `${this.paths.logs}/glucose/${sDate}.log` : `${sDate}.log` ;
        this._appendFile(sMessage, sFile, true);
    };

    //===========================================
    //             PRIVATE FUNCTIONS
    //===========================================
private _getFilledTemplate = (oObject: any, sIdentifier:string, sFunction: string, sClass: string) => {
let sResult = `--- ${sClass}.${sFunction} (${sIdentifier})---
${JSON.stringify(oObject)}
--- /${sClass}.${sFunction} (${sIdentifier})---
`;
return sResult;
}
    private _saveFile = (sContent, sFilepath, bDebug) => {

        // Loop through and create new directories as needed
        console.log(`Saving to ${sFilepath}.`);
        var aDirectories = sFilepath.split("/");
        aDirectories.forEach((sDir, iIndex) => {
            if (iIndex === aDirectories.length-1) return;   // The last part of the path will be a file, not a directory.
            if (!this.fs.existsSync(sDir)) {
                if (bDebug) console.warn(`[debug] Creating directory ${sDir}.`);
                this.fs.mkdirSync(sDir);
            }
            aDirectories[iIndex+1] = sDir + "/" + aDirectories[iIndex+1];
        });

        // If the file exists, delete it first
        if (this.fs.existsSync(aDirectories[aDirectories.length-1])){
            if (bDebug) console.warn(`[debug] File ${sFilepath} already exists. Deleting.`);
            this.fs.unlinkSync(aDirectories[aDirectories.length-1]);
        }

        this.fs.writeFileSync(sFilepath, sContent);
        console.log(`Successfully saved to ${sFilepath}.`);
    };
    private _appendFile = (sContent, sFilepath, bDebug) => {

        // Loop through and create new directories as needed
        console.log(`Saving to ${sFilepath}.`);
        var aDirectories = sFilepath.split("/");
        aDirectories.forEach((sDir, iIndex) => {
            if (iIndex === aDirectories.length-1) return;   // The last part of the path will be a file, not a directory.
            if (!this.fs.existsSync(sDir)) {
                if (bDebug) console.warn(`[debug] Creating directory ${sDir}.`);
                this.fs.mkdirSync(sDir);
            }
            aDirectories[iIndex+1] = sDir + "/" + aDirectories[iIndex+1];
        });

        this.fs.appendFileSync(sFilepath, sContent);
        console.log(`Successfully saved to ${sFilepath}.`);
    };
};

module.exports = GlucoseLogger;
