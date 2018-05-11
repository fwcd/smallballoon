import { STContext } from "../../STContext";
import { STObject } from "../../STObject";
import { ASTNode } from "./ASTNode";

export class AbstractSyntaxTree {
	public readonly root: ASTNode;

	public constructor(root: ASTNode) {
		this.root = root;
	}
}