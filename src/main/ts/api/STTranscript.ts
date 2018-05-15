import { STObject } from "../STObject";
import { STMessage } from "../STMessage";
import { STNil } from "../STNil";
import { STObjectBase } from "../STObjectBase";

/**
 * A Smalltalk object used to output information.
 *
 * Usually only one instance of this class will
 * be globally available to a Smalltalk application,
 * named "Transcript".
 */
export class STTranscript extends STObjectBase {
	public constructor() {
		super();
		this.addMethod("show:", (message) => {
			console.log(message.getValue(0).toString());
			return new STNil(this);
		});
		this.addMethod("show", (message) => {
			console.log("nil");
			return message.getValue(0);
		})
	}

	// Override
	public getClassName(): string {
		return "Transcript";
	}
}