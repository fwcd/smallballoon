import { STObject } from "../STObject";
import { STNumber } from "../STNumber";
import { STString } from "../STString";
import { STTypeException } from "../utils/STTypeException";
import { STNil } from "../STNil";
import { STBoolean } from "../STBoolean";
import { STBlock } from "../STBlock";

const STRIP_COMMENTS_REGEX = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES_REGEX = /([^\s,]+)/g;

/**
 * Returns the argument names of a JavaScript-function.
 * Source: https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
 */
export function getArgumentNames(jsFunction: Function): string[] {
	var fnStr = jsFunction.toString().replace(STRIP_COMMENTS_REGEX, "");
	var result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(ARGUMENT_NAMES_REGEX);
	return (result === null) ? [] : result;
}

/**
 * Evaluates the expression using a custom
 * "this"-context.
 */
export function evalWith(jsContext: any, fallbackContext: any, raw: string): any {
	let context = jsContext;

	if (context === undefined) {
		context = fallbackContext;
	}

	return (() => eval(raw)).call(jsContext);
}

export function toSmalltalkObject(jsObject: any): STObject {
	if (jsObject == null || jsObject == undefined) {
		return new STNil("STJSUtils.toSmalltalkObject(...)");
	} else if (jsObject instanceof STObject) {
		return jsObject;
	} else if (typeof jsObject === "number" || !isNaN(jsObject)) {
		return new STNumber(jsObject);
	} else if (typeof jsObject === "boolean") {
		return STBoolean.from(jsObject);
	} else if (typeof jsObject === "function") {
		let argNames = getArgumentNames(jsObject);
		return new STBlock([], argNames, (implicitParameters, explicitParameters) => {
			let jsArgs = explicitParameters.map(p => toJavaScriptObjectIgnoreNull(p.value));
			return toSmalltalkObject(jsObject.apply(jsObject, jsArgs));
		});
	} else {
		return new STString(jsObject);
	}
}

export function toJavaScriptObjectIgnoreNull(stObject: STObject): any {
	if (stObject === null || stObject === undefined) {
		return stObject;
	}

	let result: any = undefined;
	stObject.whenMatches(STString, obj => result = obj.value)
			.whenMatches(STBoolean, obj => result = obj.value)
			.whenMatches(STNumber, obj => result = obj.value)
			.whenMatches(STNil, obj => result = null)
			.whenMatches(STBlock, obj => {
				result = (...args: any[]) => {
					let blockResult = obj.evaluateWithArgs(...args.map(jsArg => toSmalltalkObject(jsArg)));
					return toJavaScriptObject(blockResult);
				};
			});

	if (result === undefined) {
		return stObject;
	} else {
		return result;
	}
}

export function toJavaScriptObject(stObject: STObject): any {
	if (stObject === null || stObject === undefined) {
		throw new STTypeException("Tried to convert a null/undefined STObject to a JavaScript object");
	}

	return toJavaScriptObjectIgnoreNull(stObject);
}