import { STObject } from "./STObject";
import { STNil } from "./STNil";
import { STTransscript } from "./api/STTransscript";
import { LOG } from "./utils/Logger";

/**
 * A context holding variables in a Smalltalk program.
 */
export class STContext {
	private variables: { [name: string] : STObject; } = {};

	public constructor() {
		this.variables["Transscript"] = new STTransscript();
	}

	public hasVariable(name: string): boolean {
		return name in this.variables;
	}

	public setVariable(name: string, value: STObject): void {
		LOG.trace("{} now equals {}", name, value);
		this.variables[name] = value;
	}

	public getVariable(name: string): STObject {
		if (this.hasVariable(name)) {
			return this.variables[name];
		} else {
			return new STNil("STContext.getVariable(...)");
		}
	}
}