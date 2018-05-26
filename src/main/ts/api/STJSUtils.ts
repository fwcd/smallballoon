import { STObject } from "../STObject";
import { STNumber } from "../STNumber";
import { STString } from "../STString";
import { STTypeException } from "../utils/STTypeException";
import { STNil } from "../STNil";
import { STBoolean } from "..";

export function toSmalltalkObject(jsObject: any): STObject {
	if (jsObject == null || jsObject == undefined) {
		return new STNil("STJSUtils.toSmalltalkObject(...)");
	} else if (jsObject instanceof STObject) {
		return jsObject;
	} else if (typeof jsObject === "number" || !isNaN(jsObject)) {
		return new STNumber(jsObject);
	} else if (typeof jsObject === "boolean") {
		return STBoolean.from(jsObject);
	} else {
		return new STString(jsObject);
	}
}

export function toJavaScriptObject(stObject: STObject): any {
	if (stObject === null || stObject === undefined) {
		throw new STTypeException("Tried to convert a null/undefined STObject to a JavaScript object");
	}

	let result: any = undefined;
	stObject.whenMatches(STString, obj => result = obj.value)
			.whenMatches(STBoolean, obj => result = obj.value)
			.whenMatches(STNumber, obj => result = obj.value)
			.whenMatches(STNil, obj => result = null)

	if (result === undefined) {
		return stObject.toString();
	} else {
		return result;
	}
}