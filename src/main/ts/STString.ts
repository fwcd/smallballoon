import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STNil } from "./STNil";
import { STMethodHolder } from "./STMethodHolder";
import { STBoolean } from "./STBoolean";
import { STNumber } from "./STNumber";

/**
 * A wrapper-class to access and manipulate strings
 * from Smalltalk code.
 */
export class STString extends STMethodHolder {
	public readonly value: string;

	public constructor(value: string) {
		super();
		this.value = value;
		this.addMethod("equals:", (msg) => STBoolean.from(this.value === msg.getValue(0).expect(STString).value));
		this.addMethod("toNumber", (msg) => new STNumber(+this.value));
		this.addMethod("and:", (msg) => new STString(this.value + msg.getValue(0).toString()))
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