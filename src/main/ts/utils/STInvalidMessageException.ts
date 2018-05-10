/**
 * Indicates that a method call was not
 * allowed.
 */
export class STInvalidMessageException implements Error {
	readonly name = "STInvalidMessageException";
	readonly message: string;

	constructor(message: string) {
		this.message = message;
	}
}