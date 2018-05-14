import { STMethodHolder } from "../STMethodHolder";
import { STObject } from "../STObject";
import { STNumber } from "../STNumber";
import { STString } from "../STString";
import { toSmalltalkObject, toJavaScriptObject } from "./STJSUtils";
import { STNil } from "../STNil";

export class STJSObject extends STMethodHolder {
	private jsObject: any;

	public constructor(jsObject: any) {
		super();
		this.jsObject = jsObject;
		this.addMethod("toSTObject", msg => {
			return toSmalltalkObject(this.jsObject);
		});
		this.addMethod("mapUsingJS:", msg => {
			let raw = msg.getValue(0).expect(STString).value.replace("this", "jsObject");
			return new STJSObject(eval(raw));
		});
		this.addMethod("subscriptGet:", msg => {
			return new STJSObject(this.jsObject[<any>msg.getValue(0)]);
		});
		this.addMethod("subscriptSet:to:", msg => {
			jsObject[<any>msg.getValue(0)] = msg.getValue(1);
			return new STNil("STJSObject while calling subscriptSet:to:");
		});
		this.setPostMethodHandler(msg => {
			let methodName = msg.getName();
			let parameters = msg.parameters.map(p => toJavaScriptObject(p.value));
			let result = this.jsObject[methodName].apply(this.jsObject, parameters);

			return new STJSObject(result);
		});
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
		return this.jsObject.toString();
	}
}