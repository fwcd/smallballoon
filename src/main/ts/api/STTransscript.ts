import { STObject } from "../STObject";
import { STMessage } from "../STMessage";
import { STNil } from "../STNil";
import { STMethodHolder } from "../STMethodHolder";

/**
 * A Smalltalk object used to output information.
 *
 * Usually only one instance of this class will
 * be globally available to a Smalltalk application,
 * named "Transscript".
 */
export class STTransscript extends STMethodHolder {
	public constructor() {
		super();
		this.addMethod("show", (message) => {
			console.log(message.parameters[0].value.toString());
			return new STNil(this);
		});
	}

	// Override
	public getClassName(): string {
		return "Transscript";
	}
}