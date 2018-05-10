import { STMessage } from "./STMessage";
import { STMethodHolder } from "./STMethodHolder";
import { STNil } from "./STNil";
import { STObject } from "./STObject";
import { STInvalidMessageException } from "./utils/STInvalidMessageException";

/**
 * A wrapper-class to access and manipulate numbers
 * from Smalltalk code.
 */
export class STNumber extends STMethodHolder {
	public readonly value: number;

	public constructor(value: number) {
		super();
		this.value = value;

		this.addMethod("plus:", (msg) => this.combine(this.firstArgAsNum(msg), (a, b) => a + b));
		this.addMethod("minus:", (msg) => this.combine(this.firstArgAsNum(msg), (a, b) => a - b));
		this.addMethod("times:", (msg) => this.combine(this.firstArgAsNum(msg), (a, b) => a * b));
		this.addMethod("divide:", (msg) => this.combine(this.firstArgAsNum(msg), (a, b) => a / b));
	}

	private firstArgAsNum(message: STMessage): STNumber {
		let arg = message.parameters[0].value;
		if (arg instanceof STNumber) {
			return arg;
		} else {
			throw new STInvalidMessageException("The first argument of " + message.toString() + " has to be a number!");
		}
	}

	public combine(other: STNumber, combiner: (a: number, b: number) => number): STNumber {
		return new STNumber(combiner(this.value, other.value));
	}

	// Override
	public toString(): string {
		return this.value.toString();
	}

	// Override
	public getClassName(): string {
		return "Number";
	}
}