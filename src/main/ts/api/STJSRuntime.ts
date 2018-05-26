import { STObjectBase } from "../STObjectBase";
import { STString } from "../STString";
import { STObject } from "../STObject";
import { STNumber } from "../STNumber";
import { STBoolean } from "../STBoolean";
import { STJSObject } from "./STJSObject";
import { toSmalltalkObject, evalWith } from "./STJSUtils";
import { STContext } from "../STContext";

export class STJSRuntime extends STObjectBase {
	public constructor(stContext: STContext) {
		super();
		this.addMethod("eval:", msg => {
			let rawJS = msg.getValue(0).expect(STString).value;
			let jsObject = evalWith(stContext.jsContext, this, rawJS);
			return toSmalltalkObject(jsObject);
		});
		this.addMethod("get:", msg => {
			let rawJS = msg.getValue(0).expect(STString).value;
			let jsObject = evalWith(stContext.jsContext, this, rawJS);
			return new STJSObject(stContext, jsObject);
		});
	}

	// Override
	public getClassName(): string {
		return "JSRuntime";
	}
}