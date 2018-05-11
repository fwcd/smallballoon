import { STMethodHolder } from "./STMethodHolder";
import { STNil } from "./STNil";
import { STMessage } from "./STMessage";
import { STTypeException } from "./utils/STTypeException";

/**
 * A wrapper-class to represent booleans in Smalltalk
 * code.
 */
export class STBoolean extends STMethodHolder {
	public static readonly TRUE = new STBoolean(true);
	public static readonly FALSE = new STBoolean(false);
	public readonly value: boolean;

	private constructor(value: boolean) {
		super();
		this.value = value;

		this.addMethod("ifTrue:", (msg) => new STNil(this)); // TODO
		this.addMethod("ifFalse:", (msg) => new STNil(this)); // TODO
		this.addMethod("and:", (msg) => this.combine(this.firstArgAsBool(msg), (a, b) => a && b)); // TODO
		this.addMethod("not", (msg) => STBoolean.from(!value)); // TODO
		this.addMethod("or:", (msg) => this.combine(this.firstArgAsBool(msg), (a, b) => a || b)); // TODO
		this.addMethod("xor:", (msg) => this.combine(this.firstArgAsBool(msg), (a, b) => a != b)); // TODO
	}

	public static from(value: boolean): STBoolean {
		return value ? STBoolean.TRUE : STBoolean.FALSE;
	}

	private firstArgAsBool(message: STMessage): STBoolean {
		let arg = message.getValue(0);
		if (arg instanceof STBoolean) {
			return arg;
		} else {
			throw new STTypeException("The first argument of " + message.toString() + " has to be a boolean!");
		}
	}

	public combine(other: STBoolean, combiner: (a: boolean, b: boolean) => boolean): STBoolean {
		return STBoolean.from(combiner(this.value, other.value));
	}

	// Override
	public toString(): string {
		return this.value ? "true" : "false";
	}
}