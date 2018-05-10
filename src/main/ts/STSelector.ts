import { STMessageParameter } from "./STMessage";

/**
 * A method identifier in Smalltalk.
 * It encapsulates all information required
 * to locate method inside an object.
 *
 * In other languages sometimes referred to
 * as the "method signature".
 */
export class STSelector {
	// Stored in the format label1:label2:label3
	public readonly value: string;

	public constructor(value: string) {
		this.value = value;
	}
}