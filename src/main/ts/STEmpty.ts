import { STObject } from "./STObject";

/**
 * A non-nil value to represent an intended
 * emtpy result that is not supposed to
 * possibly throw an exception.
 */
export class STEmpty extends STObject {
	public static readonly INSTANCE = new STEmpty();

	private constructor() {
		super();
	}

	// Override
	public getClassName(): string {
		return "Empty";
	}

	// Override
	public toString(): string {
		return "Empty";
	}

	// Override
	public isNil(): boolean {
		return false;
	}

	public static getInstance(): STEmpty {
		return STEmpty.INSTANCE;
	}
}