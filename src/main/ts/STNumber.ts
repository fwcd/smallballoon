import { STMessage } from "./STMessage";
import { STObjectBase } from "./STObjectBase";
import { STNil } from "./STNil";
import { STObject } from "./STObject";
import { STTypeException } from "./utils/STTypeException";
import { STBoolean } from "./STBoolean";
import { STString } from "./STString";

/**
 * A wrapper-class to access and manipulate numbers
 * from Smalltalk code.
 */
export class STNumber extends STObjectBase {
	public readonly value: number;

	public constructor(value: number) {
		super();
		this.value = value;

		this.addMethod("plus:", (msg) => this.combine(this.firstArgAsNum(msg), (a, b) => a + b));
		this.addMethod("minus:", (msg) => this.combine(this.firstArgAsNum(msg), (a, b) => a - b));
		this.addMethod("times:", (msg) => this.combine(this.firstArgAsNum(msg), (a, b) => a * b));
		this.addMethod("divide:", (msg) => this.combine(this.firstArgAsNum(msg), (a, b) => a / b));
		this.addMethod("sqrt", (msg) => new STNumber(Math.sqrt(this.value)));
		this.addMethod("pow:", (msg) => new STNumber(Math.pow(this.value, msg.getValue(0).expect(STNumber).value)));
		this.addMethod("greaterThan:", (msg) => STBoolean.from(this.value > this.firstArgAsNum(msg).value));
		this.addMethod("greaterOrEqual:", (msg) => STBoolean.from(this.value >= this.firstArgAsNum(msg).value));
		this.addMethod("lessThan:", (msg) => STBoolean.from(this.value < this.firstArgAsNum(msg).value));
		this.addMethod("lessOrEqual:", (msg) => STBoolean.from(this.value <= this.firstArgAsNum(msg).value));
		this.addMethod("equals:", (msg) => STBoolean.from(this.value === this.firstArgAsNum(msg).value));
		this.addMethod("asString", (msg) => new STString("" + this.value));
	}

	private firstArgAsNum(message: STMessage): STNumber {
		let arg = message.getValue(0);
		if (arg instanceof STNumber) {
			return arg;
		} else if (!isNaN(+arg)) {
			return new STNumber(<number><any>arg);
		} else {
			throw new STTypeException("The first argument of " + message.toString() + " (" + arg + ") has to be a number, but was instead " + (typeof arg) + "!");
		}
	}

	public combine(other: STNumber, combiner: (a: number, b: number) => number): STNumber {
		return new STNumber(combiner(this.value, other.value));
	}

	// Override
	public toString(): string {
		return "" + this.value;
	}

	// Override
	public getClassName(): string {
		return "Number";
	}
}