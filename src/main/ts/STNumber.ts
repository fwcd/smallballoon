import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STNil } from "./STNil";

/**
 * A wrapper-class to access and manipulate numbers
 * from Smalltalk code.
 */
export class STNumber extends STObject {
	readonly value: number;

	public constructor(value: number) {
		super();
		this.value = value;
	}

	// Override
	public handleMessage(message: STMessage): STObject {
		let selector = message.getSelector().value;
		let firstArgument = message.parameters[0].value;

		if (firstArgument instanceof STNumber) {
			switch (selector) {
			case "plus": return this.combine(firstArgument, (a, b) => a + b);
			case "minus": return this.combine(firstArgument, (a, b) => a - b);
			case "times": return this.combine(firstArgument, (a, b) => a * b);
			case "divide": return this.combine(firstArgument, (a, b) => a / b);
			}
		}

		return new STNil(this);
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