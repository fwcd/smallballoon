import { STObject } from "./STObject";
import { STNil } from "./STNil";
import { STTransscript } from "./api/STTransscript";

/**
 * A context holding variables in a Smalltalk program.
 */
export class STContext {
	private variables: { [name: string] : STObject; } = {};

	public constructor() {
		this.variables["Transscript"] = new STTransscript();
	}

	public setVariable(name: string, value: STObject): void {
		this.variables[name] = value;
	}

	public getVariable(name: string): STObject {
		if (name in this.variables) {
			return this.variables[name];
		} else {
			return new STNil("STContext.getVariable(...)");
		}
	}
}