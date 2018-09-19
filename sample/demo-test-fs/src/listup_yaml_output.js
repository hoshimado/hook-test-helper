/**
 * [listup_yaml_output.js]
 *   encoding=UTF8
 */

var createHookPoint = require("hook-test-helper").createHookPoint;
var hook = createHookPoint( exports, "hook" );
var path = require("path");

// "cheerio", "js-yaml" を用いたテストもありか？
// むしろ、TypeScriptに手を出すべき？


hook["fs"] = require("fs");


var promiseReadDir = function (targetDir, directory2live) {
    return new Promise(function (resolve, reject) {
        hook.fs.readdir( targetDir, "utf8", function (err, files) {
            var n, promiseDirArray = [], targetPath;
            if(err){
                reject(err);
            }else{
                n = files.length;
                while(0<n--){
                    targetPath = targetDir + "/" + files[n];

                    promiseDirArray.push(
                        new Promise(function (resolve2,reject2) {
                            var name = files[n];
                            hook.fs.stat( targetPath, function (err, stats) {
                                if(err){
                                    reject2(err);
                                }else{
                                    resolve2({
                                        "name" : name,
                                        "stats" : stats
                                    });
                                }
                            })
                        })
                    );
                }
                Promise.all(promiseDirArray).then(function (results) {
                    resolve(results);
                });
            }
        });
    }).then(function (results) {
        var outputList = [];
        var n = results.length, targetPath;
        var promiseDirArray = [];
        directory2live--;

        while(0<n--){
            targetPath = targetDir + "/" + results[n].name;
            if( results[n].stats.isDirectory() ){

                if( directory2live > 0 ){
                    promiseDirArray.push( promiseReadDir( targetPath, directory2live ) );
                }else{
                    outputList.push( targetPath + "/" );
                }
            }else{
                outputList.push( targetPath );
            }
        }
        return Promise.all( promiseDirArray ).then(function (subLists) {
            var n = subLists.length;
            while(0<n--){
                Array.prototype.push.apply(outputList, subLists[n]);
            }
            return Promise.resolve( outputList );
        });
    });
};

hook["listupSubDirectoryPath"] = function ( targetDir ) {
    return promiseReadDir( targetDir, 2 ).then(function (list) {
        return Promise.resolve(list);
    });
};

exports.listupYamlPath = function ( targetDir ) {
    return hook.listupSubDirectoryPath( targetDir )
    .then(function (allList) {
        var list = [], i, n = allList.length;
        for(i=0; i<n; i++){
            if( ".yaml" == path.extname(allList[i]) ){
                list.push( allList[i] );
            }
        }
        return Promise.resolve(list);
    });
};

var createPair = function ( inputPath, outDir ) {
    var finename = path.basename(inputPath, path.extname(inputPath));
    return {
        "inputPath" : inputPath,
        "outFilePathWithoutExt" : outDir + "/" + finename
    };
}
exports.createOutputFileFromInputPath = function ( inputList, outDir ) {
    var list = [], n = inputList.length;

    while(0<n--){
        list.push(createPair(inputList[n], outDir)); //[n]つけ忘れたり。
    }
    return list; // returnそのもの忘れたり。
};

