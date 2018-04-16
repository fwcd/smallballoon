import { STObject } from "./STObject";

/**
 * A Smalltalk object representing "nothing".
 * Similar to null/void in other languages.
 * 
 * Tracks it's creator to ease debugging.
 */
export class STNil extends STObject {
	private static INSTANCE: STNil = new STNil("anonymous");
	private creator: string;

	public constructor(creator: string | STObject) {
		super();
		this.creator = creator.toString();
	}

	// Override
	public getClassName(): string {
		return "Nil";
	}

	// Override
	public toString(): string {
		return "nil (created by " + this.creator.toString() + ")";
	}

	// Override
	public isNil(): boolean {
		return true;
	}

	/**
	 * Fetches an anonymous instance of STNil.
	 * 
	 * You should prefer to use the constructor
	 * over this function.
	 */
	public static getAnonymously(): STNil {
		return STNil.INSTANCE;
	}
}