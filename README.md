# hook-test-helper [![Build Status](https://travis-ci.org/hoshimado/hook-test-helper.svg?branch=master)](https://travis-ci.org/hoshimado/hook-test-helper)

`hook-test-helper` is library for hooking local variable on your test.

## Installation

``` sh
npm install --save hook-test-helper
```

I'd recommend use with Mocha. - support setup and teardown.

I'd recommend use "cross-env" on "--save-dev" because this library looks environment variable.

# Usage

This library provide two methods.

``` js
var createHookPoint = require("hook-test-helper").createHookPoint; // for source code.
var hookProperty = require("hook-test-helper").hookProperty; // for test code.
```

Example:

``` js :src.js
var createHookPoint = require("hook-test-helper").createHookPoint;
var hook = createHookPoint( exports, "hook" );

hook[ "localFunc1" ] = function (params) {
    return "src function.";
};

exports.doSomething = function ( params ) {
    return hook.localFUnc1();
};
```

``` js : test/test.js

var chai = require("chai");
var expect = chai.expect;
var hookProperty = require("hook-test-helper").hookProperty;


describe("TEST for src.js", function(){
    var target = require("./src.js");

    describe("doSomething()",function(){
        var doSomething = target.doSomething;
        var stubbed = {};
        var stubs;
        beforeEach(()=>{
            stubs = {
                "localFunc1" : function() { return "stub function." }
            };
            stubbed["hook"] = hookProperty(target.hook, stubs);
        });
        afterEach(()=>{
            stubbed.hook.restore();
        });

        it("do something.", function(){
            var result = doSomething();
            expect(result).to.equal("stub function.");
        });
    });
});
```

Run the test with NODE_ENV=development as environmental variable.

``` sh
cross-env NODE_ENV=development node_modules/.bin/mocha
```


# License

MIT