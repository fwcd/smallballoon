import { STObject } from "../STObject";
import { STNumber } from "../STNumber";
import { STString } from "../STString";
import { STTypeException } from "../utils/STTypeException";
import { STNil } from "../STNil";

export function toSmalltalkObject(jsObject: any): STObject {
	if (jsObject == null || jsObject == undefined) {
		return new STNil("STJSUtils.toSmalltalkObject(...)");
	} else if (this.jsObject instanceof STObject) {
		return this.jsObject;
	} else if (!isNaN(jsObject)) {
		return new STNumber(this.jsObject);
	} else {
		return new STString(this.jsObject);
	}
}

export function toJavaScriptObject(stObject: STObject): any {
	if (stObject === null || stObject === undefined) {
		throw new STTypeException("Tried to convert a null/undefined STObject to a JavaScript object");
	}

	let result: any = null;
	stObject.whenMatches(STString, obj => result = obj.value)
			.whenMatches(STNumber, obj => result = obj.value);

	if (result === null || result === undefined) {
		return stObject.toString();
	} else {
		return result;
	}
}