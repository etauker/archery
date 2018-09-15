// import {Loader} from '../persistence/mock/Loader.js';
// var MockLoader = require("../persistence/MockLoader.js");
//
// var loader = new MockLoader();


// loader.getToken();

// var jwt = require('express-jwt');
var jwt = require('jsonwebtoken');
const argon2 = require('argon2');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'securityAdmin',
  password : 'securityAdmin',
  database : 'etauker_security'
});

var oConfig = {
    expiresIn: process.env.JWT_EXPIRES_IN || 60*60,
    issuer: process.env.JWT_ISSUER || "com.etauker.security",
    audience: process.env.JWT_AUDIENCE || "com.etauker.archery",
    algorithm: process.env.JWT_ALGORITHM || "HS512"
}
function generateToken(sUsername, aRoles) {
    console.log(Array.isArray(aRoles));
    aRoles = (Array.isArray(aRoles) ? aRoles : new Array(aRoles));
    console.log(Array.isArray(aRoles));
    oConfig.notBefore = Math.floor(Date.now() / 1000);
    var sToken = jwt.sign({
        sub: sUsername,
        roles: aRoles
    }, process.env.JWT_SECRET, oConfig);

    console.log(jwt.decode(sToken));
    return sToken;
}


module.exports = function(app) {


    app.post('/security/token', function(req, res){
        // TODO: Verify credentials
        // TODO: Generate token
        res.send('/security/token');
    });

    app.get('/security/token', function(req, res){
        // Develop as a GET for ease of testing



        // TODO: Verify credentials
        var sUsername = req.query.username;
        var sPassword = req.query.password;
        // var sPassword = req.query.password;
        // var decoded = jwt.verify(token, process.env.JWT_SECRET);



        connection.connect();

        connection.query('SELECT password_hash AS hash, uuid FROM etauker_security.USER WHERE username = ?;', [sUsername], function (error, results, fields) {
            // if (error) throw error;
            console.log(error);

            argon2.verify(results[0].hash, sPassword).then(match => {

                if (match) {
                    console.log("Match");


                    var sQuery = `SELECT name AS roles
                    FROM etauker_security.USER_ROLE AS u,
                    etauker_security.ROLE AS r
                    WHERE u.role_id = r.id
                    AND u.user_id = ?;`;

                    connection.query(sQuery, [results[0].uuid], function (error, results, fields) {

                        // Generate and return a token
                        var token = generateToken(sUsername, results[0].roles);
                        res.send(token);

                    })

                } else {
                    // password did not match
                    console.log("Missmatch");

                }
                connection.end();
            }).catch(err => {
                connection.end();
                // internal failure
                console.log(err);
            });
        });








        // var aRoles = [
        //     "com.etauker.archery.Archer",
        //     "com.etauker.archery.Coach",
        //     "com.etauker.archery.Admin"
        // ];




    });




    app.post('/security/users', function(req, res){
        // argon2.hash(sPassword).then(sHash => {
        // }).catch(err => {
        //     console.log(err);
        //     res.send(err);
        // });
        res.send('/security/users');
    });

}
