/**
 * Indicates that an invalid type.
 */
export class STTypeException implements Error {
	readonly name = "STTypeException";
	readonly message: string;

	constructor(message: string) {
		this.message = message;
	}
}