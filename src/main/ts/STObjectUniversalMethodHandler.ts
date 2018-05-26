import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STNil } from "./STNil";
import { STBoolean } from "./STBoolean";

export class STObjectUniversalMethodHandler {
	public handle(receiver: STObject, message: STMessage): STObject {
		let selector = message.getSelector();
		if (selector === "isNil") {
			return STBoolean.from(receiver.isNil());
		}
		return new STNil("STObjectUniversalMethodHandler.handle(...)");
	}
}