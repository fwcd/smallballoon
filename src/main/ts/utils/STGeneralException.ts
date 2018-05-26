/**
 * An exception related to Smalltalk.
 */
export class STGeneralException implements Error {
	readonly name = "STGeneralException";
	readonly message: string;

	constructor(message: string) {
		this.message = message;
	}
}