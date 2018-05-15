import { STObjectBase } from "../STObjectBase";
import { STString } from "../STString";
import { STObject } from "../STObject";
import { STNumber } from "../STNumber";
import { STBoolean } from "../STBoolean";
import { STJSObject } from "./STJSObject";
import { toSmalltalkObject } from "./STJSUtils";

export class STJSRuntime extends STObjectBase {
	public constructor() {
		super();
		this.addMethod("run:", msg => {
			let result = eval(msg.getValue(0).expect(STString).value);
			return toSmalltalkObject(result);
		});
		this.addMethod("get:", msg => {
			let jsCode = msg.getValue(0).expect(STString).value;
			let jsObject = eval(jsCode);
			return new STJSObject(jsObject);
		});
	}

	// Override
	public getClassName(): string {
		return "JSRuntime";
	}
}