import { STMethodHolder } from "../STMethodHolder";
import { STObject } from "../STObject";
import { STNumber } from "../STNumber";
import { STString } from "../STString";
import { toSmalltalkObject, toJavaScriptObject } from "./STJSUtils";

export class STJSObject extends STMethodHolder {
	private jsObject: any;

	public constructor(jsObject: any) {
		super();
		this.jsObject = jsObject;
		this.addMethod("toSTObject", msg => {
			return toSmalltalkObject(this.jsObject);
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
}