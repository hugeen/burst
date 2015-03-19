export function addEventProxy (source, target, identifier, newIdentifier) {

	var {object: sourceObj, method: sourceMethod} = parseArg(source, 'on');
	var {object: targetObj, method: targetMethod} = parseArg(target, 'emit');

	function proxy (...args) {
		var emitArgs = [newIdentifier || identifier].concat(args);
		targetObj[targetMethod].apply(targetObj, emitArgs);
	}

	sourceObj[sourceMethod](identifier, proxy);

	return proxy;
}


export function removeEventProxy (source, identifier, proxy) {
	var {object, method} = parseArg(source, 'removeListener');
	object[method](identifier, proxy);
}


function parseArg (objectArg, method) {
	var isArray = Array.isArray(objectArg);

	return {
		object: isArray ? objectArg[0] : objectArg,
		method: isArray ? objectArg[1] : method
	};
}
