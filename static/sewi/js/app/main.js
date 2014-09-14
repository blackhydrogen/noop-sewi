// Main program logic goes here.
var sewi = sewi || {};

sewi.inherit = function(obj) {
    var F = function () {};
    F.prototype = obj;
    return new F();
};

(function() {

})();
