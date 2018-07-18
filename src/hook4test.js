/**
 * [hook4test.js]
 *  encoding=utf-8
 */


var RESTORE_MANAGER = function ( targetObject, originalMaps ) {
	this._targetObject = targetObject;
	this._originalMaps = originalMaps;
	// return this; *It does not change as an operation without specifying this.
};
RESTORE_MANAGER.prototype.restore = function () {
	var original = this._originalMaps;
	var targetObject = this._targetObject;
	var keys, n;

	// ToDo: Is this necessary?
	if( !original ){
		return targetObject;
	}

	// delete all property connected.
	keys = Object.keys( targetObject );
	n = keys.length;
	while (0<n--) {
		targetObject[ keys[n] ] = undefined;
	}

	// restore property from back-up.
	keys = Object.keys( original );
	n = keys.length;
	while(0<n--){
		targetObject[ keys[n] ] = original[ keys[n] ];
	}

	return targetObject;
};


/**
 * After saving all the properties of the specified object and setting them undefined, 
 * connect the property of the specified stub again.
 * 
 * @param {*} targetObject     the property of this object will be replaced.
 * @param {*} stubPropertyMap  this map will be connected as new property.
 */
var hookProperty = function ( targetObject, stubPropertyMap ) {
	var originalMaps = {};
	var keys, n;

	if( !targetObject ){
		return targetObject;
	}
	if( typeof stubPropertyMap != "object" ){
		return null;
	}

	// 	save the original property.
	keys = Object.keys( targetObject );
	n = keys.length;
	while(0<n--){
		originalMaps[ keys[n] ] = targetObject[ keys[n] ];

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
		// 
		// I also considered the delete operator, but I decided to set undefined 
		// so that I can see that there is invalid property clearly.
		targetObject[ keys[n] ] = undefined;
	}

	// replace properties with stub properties.
	while(0<n--){
		originalMaps[ keys[n] ] = targetObject[ keys[n] ];

		targetObject[ keys[n] ] = undefined;
	}

	keys = Object.keys( stubPropertyMap );
	n = keys.length;
	while(0<n--){
		targetObject[ keys[n] ] = stubPropertyMap[ keys[n] ];
	}

	return new RESTORE_MANAGER( targetObject, originalMaps );
};
exports.hookProperty = hookProperty;





