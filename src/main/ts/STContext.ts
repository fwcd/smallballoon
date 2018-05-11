import { STObject } from "./STObject";
import { STNil } from "./STNil";
import { STTranscript } from "./api/STTranscript";
import { LOG } from "./utils/Logger";
import { STClass } from "./STClass";
import { STBoolean } from "./STBoolean";

/**
 * A context holding variables in a Smalltalk program.
 */
export class STContext {
	private variables: { [name: string] : STObject; } = {};
	private delegate: STContext = null;

	public constructor() {
		this.variables["Transcript"] = new STTranscript();
		this.variables["Object"] = new STClass("Object");
		this.variables["true"] = STBoolean.TRUE;
		this.variables["false"] = STBoolean.FALSE;
	}

	public asDelegate(): STContext {
		let result = new STContext();
		result.delegate = this;
		return result;
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