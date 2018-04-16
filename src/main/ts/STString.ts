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
	public handleMessage(message: STMessage): STObject {
		// TODO: More functionality
		return new STNil(this);
	}

	// Override
	public toString(): string {
		return this.value;
	}

	// Override
	public getClassName(): string {
		return "String";
	}
}