import { STObject } from "./STObject";
import { STNil } from "./STNil";

/**
 * A context holding variables in a Smalltalk program.
 */
export class STContext {
	private variables: { [name: string] : STObject; } = {};

	public setVariable(name: string, value: STObject) {
		this.variables[name] = value;
	}

	public getVariable(name: string): STObject {
		if (name in this.variables) {
			return this.variables[name];
		} else {
			return STNil.get();
		}
	}
}