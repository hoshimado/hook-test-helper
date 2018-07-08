/**
 * [localFunctionHookSample.js]
 * encoding=utf-8
 */

var orignal = process.env.NODE_ENV;
process.env.NODE_ENV = "development";
var calledApi = require("./calledApi.js");
process.env.NODE_ENV = orignal;

var hookProperty = require("../../src/hook4test.js").hookProperty;


exports.method1 = function () {
    calledApi.doSomething("hoge!");
};

exports.method2 = function () {
    var hook = calledApi.hook;
    var hookedInstance = hookProperty( hook, {
        "localApi1" : function () { console.log("[stub - localApi1]"); },
        "localApi2" : function () { console.log("[stub - localApi2]"); }
    } )

    calledApi.doSomething("hoge!");

    hookedInstance.restore();
};


