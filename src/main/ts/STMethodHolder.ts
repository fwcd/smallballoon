import { STMessage } from "./STMessage";
import { STObject } from "./STObject";
import { STNil } from "./STNil";

export type MessageHandler = (message: STMessage) => STObject;

/**
 * A convenience class to simplify message
 * handling.
 */
export class STMethodHolder extends STObject {
	private methods: { [selector: string] : MessageHandler; } = {};
	private preMethodHandler: (msg: STMessage) => STObject = (msg => new STNil("Empty pre method handler"));
	private postMethodHandler: (msg: STMessage) => STObject = (msg => new STNil("Empty post method handler"));
	private delegate: STObject = new STNil("Empty STMethodHandler.delegate");

	public constructor() {
		super();
		this.addMethod("doesNotUnderstand:", (msg) => {
			let notUnderstoodMessage = msg.getValue(0).expect(STMessage);
			return this.doesNotUnderstand(notUnderstoodMessage);
		})
	}

	// Override
	protected handleMessage(message: STMessage): STObject {
		let selector: string = message.getSelector().value;

		let preMethodHandlerResult = this.preMethodHandler(message);
		if (!preMethodHandlerResult.isNil()) {
			return preMethodHandlerResult;
		}

		for (let methodSelector in this.methods) {
			if (selector === methodSelector) {
				return this.methods[methodSelector](message);
			}
		}

		let postMethodHandlerResult = this.postMethodHandler(message);
		if (!postMethodHandlerResult.isNil()) {
			return postMethodHandlerResult;
		}

		if (!this.delegate.isNil()) {
			return this.delegate.receiveMessage(message);
		}

		// TODO: Find proper way to enforce doesNotUnderstand checks without
		// breaking void methods in dynamic classes.
		// The previous solution (which does not work with Array.forEach in
		// Smalltalk) is commented out below:

		// this.receiveMessage(new STMessage(this, [{
		// 	label: "doesNotUnderstand",
		// 	value: message
		// }]));
		// Control would (if the above is not commented) never reach this point if
		// "doesNotUnderstand:" is not overridden
		// return super.handleMessage(message);

		return new STNil(this);
	}

	protected setPreMethodHandler(handler: (msg: STMessage) => STObject) {
		if (handler !== null && handler !== undefined) {
			this.preMethodHandler = handler;
		}
	}

	protected setPostMethodHandler(handler: (msg: STMessage) => STObject) {
		if (handler !== null && handler !== undefined) {
			this.postMethodHandler = handler;
		}
	}

	protected setDelegate(delegate: STObject): void {
		if (delegate !== null && delegate !== undefined) {
			this.delegate = delegate;
		}
	}

	protected addMethod(selector: string, handler: MessageHandler): void {
		this.methods[selector] = handler;
	}
}