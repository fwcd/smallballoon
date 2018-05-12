import * as fs from "fs";
import { LOG } from "./utils/Logger";
import { AbstractSyntaxTree } from "./parse/ast/AbstractSyntaxTree";
import { STParser } from "./parse/STParser";
import { STContext } from "./STContext";

/**
 * Smalltalk source code/file loader.
 */
export class STLoader {
	private contextType: { new(): STContext } = STContext;

	public setContextType(contextType: { new(): STContext }) {
		this.contextType = contextType;
	}

	public runFile(fileName: string): void {
		LOG.debug("Running file {}", fileName);
		this.runSTCode(this.readFile(fileName));
	}

	public runSTCode(rawCode: string): void {
		let ast = this.createAST(rawCode);
		LOG.trace("Running AST: {}", ast);
		ast.runWith(new this.contextType());
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