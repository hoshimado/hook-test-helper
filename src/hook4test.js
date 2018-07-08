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
 * 指定されたオブジェクトのプロパティを全て退避＆undefinedに設定した後に、
 * 指定したstubのプロパティを接続し直す。
 * 
 * @param {*} targetObject     プロパティを差し替えるオブジェクト。
 * @param {*} stubPropertyMap  差換え後のオブジェクト。これが接続される。
 */
var hookProperty = function ( targetObject, stubPropertyMap ) {
	var originalMaps = {};
	var stubed = targetObject;

	var keys = Object.keys( targetObject );
	var n = keys.length;

	// オリジナルのpropertyを退避する
	while(0<n--){
		originalMaps[ keys[n] ] = targetObject[ keys[n] ];

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
		// delete演算子も検討したが「意図しないプロパティが居る」ことが分かるように、indefined代入とした。
		targetObject[ keys[n] ] = undefined;
	}

	// スタブとして渡されたpropertyへ差換える。
	keys = Object.keys( stubPropertyMap );
	n = keys.length;
	while(0<n--){
		stubed[ keys[n] ] = stubPropertyMap[ keys[n] ];
	}

	return new RESTORE_MANAGER( targetObject, originalMaps );
};
exports.hookProperty = hookProperty;





