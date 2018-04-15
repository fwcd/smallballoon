import * as fs from "fs";
import { STApplication } from "./STApplication";

/**
 * Executes Smalltalk source code/files.
 */
export class STInterpreter {
	public runFile(fileName: string) {
		this.runSTCode(fs.readFileSync(fileName, "utf8"));
	}

	public runSTCode(rawCode: string) {
		let formattedCode: string = rawCode
				.replace(/(\r\n|\n|\r)/gm, ""); // Remove line breaks
		let expressions: string[] = formattedCode.split(".");
		new STApplication(expressions).run();
	}
}