import { STMessage } from "./STMessage";
import { STNil } from "./STNil";

/**
 * A Smalltalk object that can receive messages.
 * Responds with nil to every message by default.
 */
export class STObject {
	public receiveMessage(message: STMessage): STObject {
		return STNil.get();
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
}