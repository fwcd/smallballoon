import { STMethodHolder } from "../STMethodHolder";
import { STString } from "../STString";
import { STObject } from "../STObject";
import { STNumber } from "../STNumber";

export class STJSRuntime extends STMethodHolder {
	public constructor() {
		super();
		this.addMethod("run:", (msg) => {
			let result = eval(msg.getValue(0).expect(STString).value);
			if (result instanceof STObject) {
				return result;
			} else if (typeof result === "number") {
				return new STNumber(result);
			} else {
				return new STString(result);
			}
		});
	}

	// Override
	public getClassName(): string {
		return "JSRuntime";
	}
}