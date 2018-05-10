import { STObject } from "./STObject";
import { STClass } from "./STClass";
import { STMessage } from "./STMessage";

/**
 * An instance of a Smalltalk class.
 */
export class STInstance extends STObject {
	readonly stClass: STClass;

	constructor(stClass: STClass) {
		super();
		this.stClass = stClass;
	}

	// Override
	public getClassName(): string {
		return "Instance<" + this.stClass.name + ">";
	}

	// Override
	protected handleMessage(message: STMessage): STObject {
		return this.stClass.receiveInstanceMessage(this, message);
	}
}