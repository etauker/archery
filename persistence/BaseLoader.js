/**
*   Loads data from views or analytical stores.
*/
class BaseLoader {
    constructor() {
        console.log("BaseLoader is being constructed");
    }
}

// Interface for specific Loaders
BaseLoader.prototype.getArchers = function() {
    console.log("This method has not been implemented.");
}
BaseLoader.prototype.getScores = function() {
    console.log("This method has not been implemented.");
}

module.exports = BaseLoader;
