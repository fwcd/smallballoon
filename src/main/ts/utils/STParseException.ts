/**
 * Indicates that an error occured
 * while parsing a Smalltalk file.
 */
export class STParseException implements Error {
	readonly name = "STParseException";
	readonly message: string;

	constructor(message: string) {
		this.message = message;
	}
}