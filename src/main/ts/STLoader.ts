import * as fs from "fs";
import { STScope } from "./parse/STScope";
import { LOG } from "./utils/Logger";
import { AbstractSyntaxTree } from "./parse/ast/AbstractSyntaxTree";
import { STParser } from "./parse/STParser";

/**
 * Smalltalk source code/file loader.
 */
export class STLoader {
	public runFile(fileName: string): void {
		LOG.debug("Running file {}", fileName);
		this.runSTCode(this.readFile(fileName));
	}

	public runSTCode(rawCode: string): void {
		this.createAST(rawCode).run();
	}

	public createASTFromFile(fileName: string): AbstractSyntaxTree {
		return this.createAST(this.readFile(fileName));
	}

	public createAST(rawCode: string): AbstractSyntaxTree {
		return new STParser(rawCode).getAST();
	}

	private readFile(fileName: string): string {
		return fs.readFileSync(fileName, "utf8");
	}
}