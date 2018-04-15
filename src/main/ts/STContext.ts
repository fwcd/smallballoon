import { STObject } from "./STObject";

/**
 * A context holding variables in a Smalltalk program.
 */
export class STContext {
	private variables: { [name: string] : STObject; } = {};

	public setVariable(name: string, value: STObject) {
		this.variables[name] = value;
	}

	public getVariable(name: string): STObject {
		return this.variables[name];
	}
}