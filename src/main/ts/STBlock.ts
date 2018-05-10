import { STObject } from "./STObject";
import { STMessage } from "./STMessage";
import { STScope } from "./parse/STScope";
import { STNil } from "./STNil";

/**
 * A block of Smalltalk code that can be
 * dynamically called.
 *
 * Similar to closures or lambdas in other
 * languages.
 */
export class STBlock extends STObject {
	private scope: STScope;

	// TODO: Support parameters and returns

	public constructor(scope: STScope) {
		super();
		this.scope = scope;

		// TODO: Accept messages with selector "value"
		// and evaluate expression then.
	}

	// Override
	public getClassName(): string {
		return "Block";
	}
}