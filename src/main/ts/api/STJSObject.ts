import { STObjectBase } from "../STObjectBase";
import { STObject } from "../STObject";
import { STNumber } from "../STNumber";
import { STString } from "../STString";
import { toSmalltalkObject, toJavaScriptObject, evalWith } from "./STJSUtils";
import { STNil } from "../STNil";
import { STTypeException } from "../utils/STTypeException";
import { STContext } from "../STContext";

export class STJSObject extends STObjectBase {
	private jsObject: any;

	public constructor(stContext: STContext, jsObject: any) {
		super();
		this.jsObject = jsObject;
		this.addMethod("toSTObject", msg => {
			return toSmalltalkObject(this.jsObject);
		});
		this.addMethod("mapUsingJS:", msg => {
			let raw = msg.getValue(0).expect(STString).value.replace("this", "jsObject");
			return new STJSObject(stContext, eval(raw));
		});
		this.addMethod("getProperty:", msg => {
			return new STJSObject(stContext, this.jsObject[toJavaScriptObject(msg.getValue(0))]);
		});
		this.addMethod("evalProperty:", msg => {
			return toSmalltalkObject(this.jsObject[toJavaScriptObject(msg.getValue(0))]);
		});
		this.addMethod("setProperty:to:", msg => {
			jsObject[toJavaScriptObject(msg.getValue(0))] = toJavaScriptObject(msg.getValue(1));
			return new STNil("STJSObject while calling setProperty:to:");
		});
		this.setPostMethodHandler(msg => {
			let methodName = msg.getName();
			let parameters = msg.parameters.map(p => toJavaScriptObject(p.value));

			if (parameters.length === 1 && parameters[0] === null) {
				parameters = [];
			}

			let result = this.jsObject[methodName].apply(this.jsObject, parameters);
			return new STJSObject(stContext, result);
		});
	}

	public getObject(): any {
		return this.jsObject;
	}

	public getObjectAs<T>(castedType: { new(...args: any[]): T }): T {
		if (this.jsObject instanceof castedType) {
			return this.jsObject;
		} else {
			throw new STTypeException(this.jsObject + " (of type " + (typeof this.jsObject) + ") does not match " + castedType);
		}
	}

	// Override
	public getClassName(): string {
		return "JSObject";
	}

	public toJSON(): string {
		return JSON.stringify(this.jsObject);
	}

	// Override
	public toString(): string {
		if (this.jsObject === undefined) {
			return "undefined (STJSObject)";
		} else if (this.jsObject === null) {
			return "null (STJSObject)";
		} else {
			return this.jsObject.toString();
		}
	}
}