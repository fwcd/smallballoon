import { STMessage } from "./STMessage";
import { LOG } from "./utils/Logger";
import { STTypeException } from "./utils/STTypeException";
import { STDoesNotUnderstandException } from "./utils/STDoesNotUnderstandException";

/**
 * A Smalltalk object that can receive messages.
 * Responds with nil to every message by default.
 *
 * To ensure universal availability of standard methods
 * (equals, ...), you should NEVER inherit from STObject
 * directly. ALWAYS inherit from STObjectBase instead, unless
 * you have a very good reason not to.
 */
export class STObject {
	// Do not override this method!!
	public receiveMessage(message: STMessage): STObject {
		LOG.trace("{} received {}", this, message);
		return this.receiveMessageSilently(message);
	}

	// Do not override this method!!
	public receiveMessageSilently(message: STMessage): STObject {
		return this.handleMessage(message);
	}

	protected doesNotUnderstand(message: STMessage): STObject {
		throw new STDoesNotUnderstandException(this, message);
	}

	// Intended to be overriden by subclasses
	protected handleMessage(message: STMessage): STObject {
		return this.doesNotUnderstand(message);
	}

	// Intended to be overriden by subclasses
	public onAssignTo(name: string): void {
		// Called when this object is assigned
		// to a variable using a given name.
		//
		// This is useful for
	}

	public getClassName(): string {
		return "Object";
	}

	/**
	 * Dynamically casts this Smalltalk object while
	 * catching type errors at runtime.
	 *
	 * @param castedType - The resulting type
	 */
	public expect<T extends STObject>(castedType: { new(...args: any[]): T }): T {
		if (this instanceof castedType) {
			return this;
		} else {
			throw new STTypeException(this + " (of type " + this.getClassName() + ") does not match " + castedType);
		}
	}

	/**
	 * Safely executes a block of code if this Smalltalk
	 * object can be dynamically converted to a given type.
	 *
	 * Returns itself for convenient method chaining.
	 *
	 * @param castedType - The casted type
	 * @param then - The callback function
	 */
	public whenMatches<T extends STObject>(castedType: { new(...args: any[]): T }, then: (obj: T) => void): this {
		if (this instanceof castedType) {
			then(this);
		}
		return this;
	}

	public isNil(): boolean {
		return false;
	}

	public orIfNil(other: STObject): STObject {
		if (this.isNil()) {
			return other;
		} else {
			return this;
		}
	}

	public toString() {
		return "{" + this.getClassName() + "}";
	}
}