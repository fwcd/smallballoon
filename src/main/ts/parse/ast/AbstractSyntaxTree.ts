import { STContext } from "../../STContext";
import { STObject } from "../../STObject";
import { ASTNode } from "./ASTNode";
import { STNil } from "./../../STNil";
import { STBoolean } from "./../../STBoolean";
import { STObjectUniversalMethodHandler } from "../../STObjectUniversalMethodHandler";

export class AbstractSyntaxTree {
	public readonly root: ASTNode;

	public constructor(root: ASTNode) {
		this.root = root;
	}

	public runWith(context: STContext): STObject {
		// TODO: Find a cleaner way to inject universal
		// STObject methods without causing cyclic references.
		STObject.universalMethodHandler = new STObjectUniversalMethodHandler().handle;
		return this.root.evaluate(context);
	}

	public run(): STObject {
		return this.runWith(STContext.create());
	}

	public toString(): string {
		return this.root.toString();
	}
}