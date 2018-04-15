import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STNil } from "./STNil";

/**
 * A wrapper-class to access and manipulate strings
 * from Smalltalk code.
 */
export class STString extends STObject {
	readonly value: string;

	public constructor(value: string) {
		super();
		this.value = value;
	}

	// Override
	public receiveMessage(message: STMessage): STObject {
		// TODO: More functionality
		return STNil.get();
	}

	// Override
	public getClassName(): string {
		return "String";
	}
}