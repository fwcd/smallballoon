import { STObject } from "../STObject";
import { STMessage } from "../STMessage";
import { STNil } from "../STNil";

/**
 * A Smalltalk object used to output information.
 * 
 * Usually only one instance of this class will
 * be globally available to a Smalltalk application,
 * named "Transscript".
 */
export class STTransscript extends STObject {
	// Override
	public handleMessage(message: STMessage): STObject {
		let selector = message.getSelector().value;

		switch (selector) {
		case "show":
			console.log(message.parameters[0].value.toString());
		default:
			return new STNil(this);
		}
	}

	// Override
	public getClassName(): string {
		return "Transscript";
	}
}