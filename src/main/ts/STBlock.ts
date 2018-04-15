import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STScope } from "./STScope";

/**
 * A block of Smalltalk code that can be
 * dynamically called.
 * 
 * Similar to closures or lambdas in other
 * languages.
 */
export class STBlock extends STObject {
	private scope: STScope;

	public constructor(scope: STScope) {
		super();
		this.scope = scope;
	}

	// Override
	public receiveMessage(message: STMessage): STObject {
		// TODO
	}
}