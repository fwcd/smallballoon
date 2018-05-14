import { STObject } from "../STObject";
import { STMessage } from "../STMessage";

/**
 * Indicates that an object did not
 * understand the message sent to it.
 */
export class STDoesNotUnderstandException implements Error {
	readonly name = "STDoesNotUnderstandException";
	readonly message: string;

	constructor(receiver: STObject, message: STMessage) {
		this.message = receiver + " (of type " + receiver.getClassName() + ") does not understand " + message;
	}
}