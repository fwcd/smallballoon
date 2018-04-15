import * as fs from "fs";
import { STScope } from "./STScope";

/**
 * Executes Smalltalk source code/files.
 */
export class STInterpreter {
	public runFile(fileName: string) {
		this.runSTCode(fs.readFileSync(fileName, "utf8"));
	}

	public runSTCode(rawCode: string) {
		new STScope(rawCode).run();
	}
}