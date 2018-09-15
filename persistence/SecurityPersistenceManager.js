/**
*   Loads and saves data related to security.
*/

class SecurityPersistenceManager {

    constructor(oParams) {
        // Set class variables
        let oDatabase = process.env.database || {};
        this.host = oParams.host || oDatabase.host || 'localhost';
        this.user = oParams.user || oDatabase.user;
        this.password = oParams.password || oDatabase.password;
        this.database = oParams.database || oDatabase.database;

        // Ensure that all mandatory parameters have a value
        if (!this.user) this._missingParameter("user");
        if (!this.password) this._missingParameter("password");
        if (!this.database) this._missingParameter("database");
    }
}

//===========================================
//             PUBLIC FUNCTIONS
//===========================================
SecurityPersistenceManager.prototype.getUser = function(oUser) {
    // TODO: Return a user using properties corresponding to the provided object
}
SecurityPersistenceManager.prototype.getRolesByUser = function(sUserId) {
    // TODO: Return an array of rolescorresponding to the provided user
}
SecurityPersistenceManager.prototype.createRole = function(oRole) {
    // TODO: Creates a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.createUser = function(oUser) {
    // TODO: Creates a database entry corresponding to the provided object
    // NOTE: The password must be hashed here before saving
}
SecurityPersistenceManager.prototype.updateRole = function(oRole) {
    // TODO: Updates a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.updateUser = function(oUser) {
    // TODO: Updates a database entry corresponding to the provided object
    // NOTE: The password must be hashed here before saving
}
SecurityPersistenceManager.prototype.deleteRole = function(sRoleId) {
    // TODO: Deletes a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.deleteUser = function(sUserId) {
    // TODO: Deletes a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.assignUserRole = function(sUserId, sRoleId) {
    // TODO: Assigns the give role to the given user
}
SecurityPersistenceManager.prototype.unassignUserRole = function(sUserId, sRoleId) {
    // TODO: Deletes the user role corresponding to the given parameters
}
SecurityPersistenceManager.prototype.saveSession = function(oSession) {
    // TODO: Creates a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.extendSession = function(oExtension) {
    // TODO: Creates a database entry corresponding to the provided object
}

//===========================================
//             PRIVATE FUNCTIONS
//===========================================
SecurityPersistenceManager.prototype._missingParameter = function(sParameter) {
    console.error(`
        === ERROR: ===
        Missing ${sParameter} parameter in the constructor of SecurityPersistenceManager.
        Ensure that process.env.database.${sParameter} is set or the parameter is otherwise provided.
    `);
}

module.exports = SecurityPersistenceManager;
