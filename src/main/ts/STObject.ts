import { STMessage } from "./STMessage";
import { STNil } from "./STNil";
import { LOG } from "./utils/Logger";
import { STTypeException } from "./utils/STTypeException";

/**
 * A Smalltalk object that can receive messages.
 * Responds with nil to every message by default.
 */
export class STObject {
	// Do not override this method!!
	public receiveMessage(message: STMessage): STObject {
		LOG.trace("{} received {}", this, message);
		return this.handleMessage(message);
	}

	// Intended to be overriden by subclasses
	protected handleMessage(message: STMessage): STObject {
		return new STNil(this); // Does not handle messages by default
	}

	public getClassName(): string {
		return "Object";
	}

	/**
	 * Dynamically casts a Smalltalk object while
	 * catching type errors at runtime.
	 *
	 * @param castedType - The resulting type
	 */
	public expect<T extends STObject>(castedType: { new(...args: any[]): T }): T {
		if (this instanceof castedType) {
			return this;
		} else {
			throw new STTypeException(this.getClassName() + " does not match " + castedType);
		}
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