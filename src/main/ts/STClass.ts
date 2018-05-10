import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STNil } from "./STNil";
import { STInstance } from "./STInstance";
import { STSelector } from "./STSelector";
import { STMethodHolder } from "./STMethodHolder";

/**
 * A Smalltalk class.
 */
export class STClass extends STMethodHolder {
	private fieldNames: string[];
	private classMethods: { [selector: string] : () => STObject; } = {};
	private instanceMethods: { [selector: string] : (STObject) => STObject; } = {};
	public readonly name: string;

	public constructor(name: string) {
		super();
		this.name = name;

		this.addMethod("new", (message) => new STInstance(this));
		this.addMethod("setMethod:to:", (message) => new STNil(this)); // TODO
		this.addMethod("setClassMethod:to:", (message) => new STNil(this)); // TODO
		this.addMethod("declareProperty:", (message) => new STNil(this)); // TODO
	}

	// Override
	protected handleMessage(message: STMessage): STObject {
		let selector: string = message.getSelector().value;

		if (selector in this.classMethods) {
			return this.classMethods[selector]();
		}

		return super.handleMessage(message);
	}

	// Override
	public getClassName(): string {
		return "Class<" + name + ">";
	}

	public receiveInstanceMessage(instance: STInstance, message: STMessage): STObject {
		let selector: string = message.getSelector().value;

		// TODO: Implement Smalltalk superclasses and delegate

		if (selector in this.instanceMethods) {
			// Call instance method using instance
			return this.instanceMethods[selector](instance);
		} else {
			return new STNil(this);
		}
	}
}