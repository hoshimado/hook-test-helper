/**
 * [listup_yaml_output_csv.js]
 *   encoding=UTF8
 */


var sinon = require("sinon");
var assert = require("chai").assert;
var expect = require("chai").expect;
var shouldFulfilled = require("promise-test-helper").shouldFulfilled;
var shouldRejected = require("promise-test-helper").shouldRejected;
var hookProperty = require("hook-test-helper").hookProperty; // for test code.


var target = require("../src/listup_yaml_output.js");

describe("TEST for listup_yaml_output_csv.js", function(){
    describe("::createOutputFileFromInputPath()", function () {
        var createOutputFileFromInputPath = target.createOutputFileFromInputPath;

        it("インプットpathを元に、単一フォルダへの出力パス（拡張子無し）を生成する", function () {
            var list = [
                "./data/in-stub/sub2/v2018.01.yaml",
                "./data/in-stub/sub2/v2018.02.yaml",
                "./data/in-stub/sub1/v2017.01.yaml"
            ];
            var pair = createOutputFileFromInputPath( list, "./data/out-diff" );
            var EXPECTED_PAIR = [
                {
                    "inputPath"             : "./data/in-stub/sub2/v2018.01.yaml",
                    "outFilePathWithoutExt" : "./data/out-diff/v2018.01"
                },
                {
                    "inputPath"             : "./data/in-stub/sub2/v2018.02.yaml",
                    "outFilePathWithoutExt" : "./data/out-diff/v2018.02"
                },
                {
                    "inputPath"             : "./data/in-stub/sub1/v2017.01.yaml",
                    "outFilePathWithoutExt" : "./data/out-diff/v2017.01"
                }
            ];

            assert( pair );
            EXPECTED_PAIR.sort(function(a,b){
                if( a.inputPath < b.inputPath ) return -1;
                if( a.inputPath > b.inputPath ) return 1;
                return 0;
            });
            pair.sort(function(a,b){
                if( a.inputPath < b.inputPath ) return -1;
                if( a.inputPath > b.inputPath ) return 1;
                return 0;
            });
            expect(pair).to.deep.equal(EXPECTED_PAIR);
        });
    });
    describe("::listupSubDirectryPath() - actual with [data/in-stub]",function () {
        var listupSubDirectoryPath = target.hook.listupSubDirectoryPath;

        it("Yamlファイルが格納されたディレクトリ（1つ下のサブを含む）から、Yamlファイルのパスを全て取得する",function () {
            var TARGET_DIR = "./data/in-stub"; 
            var EXPECTED_LIST = [
                './data/in-stub/sub2/v2018.01.yaml',
                './data/in-stub/sub2/v2018.02.yaml',
                './data/in-stub/sub1/v2017.01.yaml',
                './data/in-stub/sub1/v2017.02.yaml',
                './data/in-stub/moreDeep/hoge.pdf',
                './data/in-stub/moreDeep/piyo/' // 個の下は2階層下なので「limit.txt」は拾わないこと。
            ];

            return shouldFulfilled(
                listupSubDirectoryPath( TARGET_DIR )
            ).then(function (result) {
                assert( result );

                result.sort(function(a,b){
                    if( a < b ) return -1;
                    if( a > b ) return 1;
                    return 0;
                });
                EXPECTED_LIST.sort(function(a,b){
                    if( a < b ) return -1;
                    if( a > b ) return 1;
                    return 0;
                });
                expect( result ).to.deep.equal( EXPECTED_LIST );
            });
        });
    });
    describe("::listupSubDirectryPath()",function () {
        var listupSubDirectoryPath = target.hook.listupSubDirectoryPath;

        var stubbedManager = {};
        var stubs;
        beforeEach(()=>{
            stubs = {
                "listupSubDirectoryPath" : target.hook.listupSubDirectoryPath,
                "fs" : {
                    "readdir" : sinon.stub(), // https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
                    "stat" : sinon.stub()     // https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback
                }
            };
            stubbedManager["hook"] = hookProperty(target.hook, stubs);
        });
        afterEach(()=>{
            stubbedManager.hook.restore();
        });

        var setupFsStubs = function(targetStubs){
            targetStubs.fs.readdir.withArgs("./data/in-stub")
            .callsArgWith(2, /* err= */ null, /* files= */ ["sub1","sub2","moreDeep"] );
            targetStubs.fs.stat.withArgs("./data/in-stub/sub1")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return true;}} );
            targetStubs.fs.stat.withArgs("./data/in-stub/sub2")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return true;}} );
            targetStubs.fs.stat.withArgs("./data/in-stub/moreDeep")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return true;}} );

            targetStubs.fs.readdir.withArgs("./data/in-stub/sub1")
            .callsArgWith(2, /* err= */ null, /* files= */ ["v2017.01.yaml","v2017.02.yaml"] );
            targetStubs.fs.stat.withArgs("./data/in-stub/sub1/v2017.01.yaml")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return false;}} );
            targetStubs.fs.stat.withArgs("./data/in-stub/sub1/v2017.02.yaml")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return false;}} );

            targetStubs.fs.readdir.withArgs("./data/in-stub/sub2")
            .callsArgWith(2, /* err= */ null, /* files= */ ["v2018.01.yaml","v2018.02.yaml"] );
            targetStubs.fs.stat.withArgs("./data/in-stub/sub2/v2018.01.yaml")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return false;}} );
            targetStubs.fs.stat.withArgs("./data/in-stub/sub2/v2018.02.yaml")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return false;}} );

            targetStubs.fs.readdir.withArgs("./data/in-stub/moreDeep")
            .callsArgWith(2, /* err= */ null, /* files= */ ["hoge.pdf","piyo"] );
            targetStubs.fs.stat.withArgs("./data/in-stub/moreDeep/hoge.pdf")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return false;}} );
            targetStubs.fs.stat.withArgs("./data/in-stub/moreDeep/piyo")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return true;}} );

            targetStubs.fs.readdir.withArgs("./data/in-stub/moreDeep/piyo")
            .callsArgWith(2, /* err= */ null, /* files= */ ["limit.txt"] );
            targetStubs.fs.stat.withArgs("./data/in-stub/moreDeep/piyo/limit.txt")
            .callsArgWith(1, /* err= */ null, /* stats= */ {"isDirectory" : function (){return false;}} );
        };

        it("Yamlファイルが格納されたディレクトリ（1つ下のサブを含む）から、Yamlファイルのパスを全て取得する",function () {
            var TARGET_DIR = "./data/in-stub"; 
            var EXPECTED_LIST = [
                './data/in-stub/sub2/v2018.01.yaml',
                './data/in-stub/sub2/v2018.02.yaml',
                './data/in-stub/sub1/v2017.01.yaml',
                './data/in-stub/sub1/v2017.02.yaml',
                './data/in-stub/moreDeep/hoge.pdf',
                './data/in-stub/moreDeep/piyo/' // 個の下は2階層下なので「limit.txt」は拾わないこと。
            ];
            setupFsStubs(stubs);

            return shouldFulfilled(
                listupSubDirectoryPath( TARGET_DIR )
            ).then(function (result) {
                assert( result );

                result.sort(function(a,b){
                    if( a < b ) return -1;
                    if( a > b ) return 1;
                    return 0;
                });
                EXPECTED_LIST.sort(function(a,b){
                    if( a < b ) return -1;
                    if( a > b ) return 1;
                    return 0;
                });
                expect( result ).to.deep.equal( EXPECTED_LIST );
            });
        });
    });
    describe("::listupYamlPath()",function () {
        var listupYamlPath = target.listupYamlPath;

        var stubbedManager = {};
        var stubs;
        beforeEach(()=>{
            stubs = {
                "listupSubDirectoryPath" : sinon.stub()
            };
            stubbedManager["hook"] = hookProperty(target.hook, stubs);
        });
        afterEach(()=>{
            stubbedManager.hook.restore();
        });

        it("yamlパスのみを拾い上げる。",function () {
            var TARGET_DIR = "./data/in-stub"; 
            var ALL_LIST = [
                './data/in-stub/sub2/v2018.01.yaml',
                './data/in-stub/sub2/v2018.02.yaml',
                './data/in-stub/sub1/v2017.01.yaml',
                './data/in-stub/sub1/v2017.02.yaml',
                './data/in-stub/moreDeep/hoge.pdf',
                './data/in-stub/moreDeep/piyo/' // 個の下は2階層下なので「limit.txt」は拾わないこと。
            ];
            stubs.listupSubDirectoryPath.withArgs(TARGET_DIR)
            .returns( Promise.resolve(ALL_LIST) );

            return shouldFulfilled(
                listupYamlPath( TARGET_DIR )
            ).then(function (result) {
                expect( result ).to.deep.equal([
                    './data/in-stub/sub2/v2018.01.yaml',
                    './data/in-stub/sub2/v2018.02.yaml',
                    './data/in-stub/sub1/v2017.01.yaml',
                    './data/in-stub/sub1/v2017.02.yaml'
                ]);
            });
        });
    });
});

