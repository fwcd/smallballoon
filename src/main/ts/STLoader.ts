import * as fs from "fs";
import { LOG } from "./utils/Logger";
import { AbstractSyntaxTree } from "./parse/ast/AbstractSyntaxTree";
import { STParser } from "./parse/STParser";
import { STContext } from "./STContext";
import { STObject } from "./STObject";

/**
 * Smalltalk source code/file loader.
 */
export class STLoader {
	private jsContext: any;

	/**
	 * Sets the "this"-context used when
	 * calling eval(...) in the Smalltalk-JavaScript
	 * bridge.
	 */
	public setJSContext(jsContext: any) {
		this.jsContext = jsContext;
	}

	public runFile(fileName: string): STObject {
		LOG.debug("Running file {}", fileName);
		return this.runSTCode(this.readFile(fileName));
	}

	public runSTCode(rawCode: string): STObject {
		let ast = this.createAST(rawCode);
		LOG.trace("Running AST: {}", ast);
		return ast.runWith(STContext.createWith(this.jsContext));
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