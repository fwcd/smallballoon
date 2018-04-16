import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STNil } from "./STNil";
import { STInstance } from "./STInstance";
import { STSelector } from "./STSelector";

/**
 * A Smalltalk class.
 */
export class STClass extends STObject {
	private fieldNames: string[];
	private classMethods: { [selector: string] : () => STObject; } = {};
	private instanceMethods: { [selector: string] : (STObject) => STObject; } = {};
	readonly name: string;

	public constructor(name: string) {
		super();
		this.name = name;
	}

	// Override
	public handleMessage(message: STMessage): STObject {
		let selector: string = message.getSelector().value;

		if (selector in this.classMethods) {
			return this.classMethods[selector]();
		}

		switch (selector) {
		case "new":
			return new STInstance(this);
		case "setMethod:to":
			// TODO
		case "setClassMethod:to":
			// TODO
		case "declareProperty":
			// TODO
		}

		return new STNil(this);
	}

	// Override
	public getClassName(): string {
		return "Class";
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