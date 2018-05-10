import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STNil } from "./STNil";
import { STMethodHolder } from "./STMethodHolder";

/**
 * A wrapper-class to access and manipulate strings
 * from Smalltalk code.
 */
export class STString extends STMethodHolder {
	public readonly value: string;

	public constructor(value: string) {
		super();
		this.value = value;
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