import { STObject } from "./STObject";

/**
 * A Smalltalk object representing "nothing".
 * Similar to null/void in other languages.
 * 
 * Implemented as a singleton.
 */
export class STNil extends STObject {
	private static instance = new STNil();

	private constructor() {
		super();
	}

	// Override
	public isNil(): boolean {
		return true;
	}

	public static get(): STNil {
		return STNil.instance;
	}
}