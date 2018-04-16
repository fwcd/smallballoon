import { STMessage } from "./STMessage";
import { STNil } from "./STNil";
import { LOG } from "./utils/Logger";

/**
 * A Smalltalk object that can receive messages.
 * Responds with nil to every message by default.
 */
export class STObject {
	// Do not override this method
	public receiveMessage(message: STMessage): STObject {
		LOG.trace("{} received {}", this, message);
		return this.handleMessage(message);
	}

	public handleMessage(message: STMessage): STObject {
		return new STNil(this);
	}

	public getClassName(): string {
		return "Object";
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