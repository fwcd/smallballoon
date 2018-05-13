import { STObject } from "./STObject";
import { STNil } from "./STNil";
import { STTranscript } from "./api/STTranscript";
import { LOG } from "./utils/Logger";
import { STClass } from "./STClass";
import { STBoolean } from "./STBoolean";
import { STJSRuntime } from "./api/STJSRuntime";
import { STLoader } from "./STLoader";
import { AbstractSyntaxTree } from "./parse/ast/AbstractSyntaxTree";
import { STRuntime } from "./api/STRuntime";

/**
 * A context holding variables in a Smalltalk program.
 */
export class STContext {
	public readonly id = Math.floor(Math.random() * 1024);
	private variables: { [name: string] : STObject; } = {};
	public readonly delegates: STContext[] = [];

	private constructor() {}

	public static create(): STContext {
		let instance = new STContext();
		instance.variables["Transcript"] = new STTranscript();
		instance.variables["Object"] = new STClass("Object");
		instance.variables["true"] = STBoolean.TRUE;
		instance.variables["false"] = STBoolean.FALSE;
		instance.variables["JS"] = new STJSRuntime();
		instance.variables["Runtime"] = new STRuntime(instance);
		return instance;
	}

	public asDelegate(): STContext {
		let result = new STContext();
		result.delegates.push(this);
		return result;
	}

	public hasVariable(name: string): boolean {
		return name in this.variables
			|| (this.delegates.length > 0 && this.delegates
				.map(ctx => ctx.hasVariable(name))
				.reduce((a, b) => a || b));
	}

	public getVariableLocally(name: string): STObject {
		if (name in this.variables) {
			return this.variables[name];
		} else {
			return new STNil("STContext.getVariableLocally(...)");
		}
	}

	public setVariableLocally(name: string, value: STObject): void {
		this.variables[name] = value;
	}

	public setVariable(name: string, value: STObject, globalFirst: boolean): void {
		// Re-assign locally first
		if (name in this.variables) {
			this.setVariableLocally(name, value);
		}

		let hasFoundDeclaration = false;
		this.delegates.forEach(delegate => {
			if (!hasFoundDeclaration && (globalFirst || delegate.hasVariable(name))) {
				delegate.setVariable(name, value, globalFirst);
				hasFoundDeclaration = true;
			}
		});

		if (!hasFoundDeclaration) {
			this.setVariableLocally(name, value);
		}
		LOG.trace("{} now equals {} in {}", name, value, this.id);
	}

	public getVariable(name: string): STObject {
		LOG.deepTrace("Fetching {} from {}", name, this);

		if (name in this.variables) {
			return this.variables[name];
		} else {
			let result: STObject = new STNil("STContext.getVariable(...)");

			this.delegates.forEach(delegate => {
				if (result.isNil() && delegate.hasVariable(name)) {
					result = delegate.getVariable(name);
				}
			});

			return result;
		}
	}

	public verboseToString(): string {
		let str = "[";
		for (let name in this.variables) {
			str += name + " = " + this.variables[name] + ", ";
		}
		return str + "] < " + this.delegates.toString();
	}

	public toString(): string {
		return "[Context " + this.id + "] < " + this.delegates;
	}
}