export class STLoaderException implements Error {
	readonly name = "STLoaderException";
	readonly message: string;

	constructor(message: string) {
		this.message = message;
	}
}