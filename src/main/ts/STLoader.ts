import * as fs from "fs";
import { STScope } from "./parse/STScope";
import { LOG } from "./utils/Logger";
import { STParseTree } from "./parse/STParseTree";

/**
 * Smalltalk source code/file loader.
 */
export class STLoader {
	public runFile(fileName: string): void {
		LOG.debug("Running file {}", fileName);
		this.runSTCode(this.readFile(fileName));
	}

	public runSTCode(rawCode: string): void {
		new STScope(rawCode).run();
	}

	public createParseTreeFromFile(fileName: string): STParseTree {
		return STParseTree.create(this.readFile(fileName));
	}

	public createParseTree(rawCode: string): STParseTree {
		return STParseTree.create(rawCode);
	}

	private readFile(fileName: string): string {
		return fs.readFileSync(fileName, "utf8");
	}
}