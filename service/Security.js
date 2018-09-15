// import {Loader} from '../persistence/mock/Loader.js';
// var MockLoader = require("../persistence/MockLoader.js");
//
// var loader = new MockLoader();


// loader.getToken();


module.exports = function(app) {

    app.post('/security/token', function(req, res){
        // TODO: Verify credentials
        // TODO: Generate token
        res.send('/security/token');
    });

    app.post('/security/users', function(req, res){
        res.send('/security/users');
    });

}
