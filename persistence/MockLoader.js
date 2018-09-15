/**
*   Loads data from stored JSON objects in "../data/mock/".
*/
var BaseLoader = require("./BaseLoader.js");

class MockLoader extends BaseLoader {
    constructor() {
        super();
        console.log("MockLoader is being constructed");
    }
}

MockLoader.prototype.getScores = function() {
    console.log("This method returns scores for all archers.");
}

module.exports = MockLoader;
