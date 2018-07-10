/**
 * [sample_design.js]
 * encoding=utf-8
 */

var createHookPoint = require("hook-test-helper").createHookPoint;
var hook = createHookPoint(exports, "hook");

hook["open"] = function(){
    // This is not implemented.
    return Promise.reject();
};
hook["doSomething"] = function () {
    // This is not implemented.
    return Promise.reject();
};
hook["close"] = function() {
    // This is not implemented.
    return Promise.reject();
};

// This is implemented.
exports.method1 = function(keyword) {
    var value = {};
    return hook.open(keyword).then(function (handle) {
        return hook.doSomething(handle);
    }).then(function (result) {
        value = result;
        return hook.close();
    }).then(function(){
        return Promise.resolve(value)
    });
};

