import { STMessage } from "./STMessage";
import { STNil } from "./STNil";
import { LOG } from "./utils/Logger";

/**
 * A Smalltalk object that can receive messages.
 * Responds with nil to every message by default.
 */
export class STObject {
	public receiveMessage(message: STMessage): STObject {
		LOG.trace("{} sent {} to {}", this.getClassName(), message, message.receiver.getClassName());
		return STNil.get();
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
}