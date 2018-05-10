import { STMessage } from "./STMessage";
import { STObject } from "./STObject";
import { STNil } from "./STNil";

export type MessageHandler = (msg: STMessage) => STObject;

/**
 * A convenience class to simplify message
 * handling.
 */
export class STMethodHolder extends STObject {
	private methods: { [selector: string] : MessageHandler; } = {};

	// Override
	protected handleMessage(message: STMessage): STObject {
		let selector: string = message.getSelector().value;

		for (let methodSelector in this.methods) {
			if (selector === methodSelector) {
				return this.methods[methodSelector](message);
			}
		}

		return new STNil(this);
	}

	protected addMethod(selector: string, handler: MessageHandler): void {
		this.methods[selector] = handler;
	}
}