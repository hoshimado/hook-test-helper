/*
    [hook4src.js]

	encoding=utf-8
*/

/**
 * If Environment variable is 'NODE_ENV==development' , this returns the variable which is set as external with the specified variable name.
 * 
 * @param {*}      exportsInstance Specify 'Modules.exports'.
 * @param {String} variableName    Specify the variable name of the external hook point  with a character string.
 * @param {*}      existInstance   Specify Instance of the object which you want to hook in testing. If omitted, the object {} is automatically generated internally. 
 */
var createHookPoint = function ( exportsInstance, variableName, existInstance ) {
	var instance;
	
	if( !exportsInstance ){
		return null;
	}

	instance = (existInstance) ? existInstance : {};
	if( process.env.NODE_ENV == "development" ){
		exportsInstance[ variableName ] = instance;
	}
	return instance;
};
exports.createHookPoint = createHookPoint;


