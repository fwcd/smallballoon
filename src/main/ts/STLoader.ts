import * as fs from "fs";
import { STScope } from "./parse/STScope";
import { LOG } from "./utils/Logger";

/**
 * Smalltalk source code/file loader.
 */
export class STLoader {
	public runFile(fileName: string) {
		LOG.debug("Running file {}", fileName);
		this.runSTCode(fs.readFileSync(fileName, "utf8"));
	}

	public runSTCode(rawCode: string): void {
		new STScope(rawCode).run();
	}
}