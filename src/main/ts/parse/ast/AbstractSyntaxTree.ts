import { STContext } from "../../STContext";
import { STObject } from "../../STObject";
import { ASTNode } from "./ASTNode";

export class AbstractSyntaxTree {
	public readonly root: ASTNode;

	public constructor(root: ASTNode) {
		this.root = root;
	}

	public runWith(context: STContext): STObject {
		return this.root.evaluate(context);
	}

	public run(): STObject {
		return this.runWith(new STContext());
	}
}