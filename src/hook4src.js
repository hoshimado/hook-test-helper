/*
    [hook4src.js]

	encoding=utf-8
*/

var createHookPoint = function ( exportsInstance, variableName, existInstance ) {
	var instance = (existInstance) ? existInstance : {};
	if( process.env.NODE_ENV == "development" ){
		exportsInstance[ variableName ] = instance;
	}
	return instance;
};
exports.createHookPoint = createHookPoint;


