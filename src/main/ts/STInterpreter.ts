import * as fs from "fs";
import { STScope } from "./STScope";
import { LOG } from "./utils/Logger";

/**
 * Executes Smalltalk source code/files.
 */
export class STInterpreter {
	public runFile(fileName: string) {
		LOG.debug("Running file {}", fileName);
		this.runSTCode(fs.readFileSync(fileName, "utf8"));
	}

	public runSTCode(rawCode: string): void {
		new STScope(rawCode).run();
	}
}