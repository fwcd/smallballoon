export enum STParseTreeNodeType {
	Sequence,
	Raw
}

/**
 * A parse tree of Smalltalk expressions.
 */
export class STParseTree {
	public readonly childs: STParseTree[] = [];
	public readonly nodeType: STParseTreeNodeType;
	public readonly value: string;

	public constructor(nodeType: STParseTreeNodeType, value: string) {
		this.nodeType = nodeType;
		this.value = value;
	}

	private static sequence(): STParseTree {
		return new STParseTree(STParseTreeNodeType.Sequence, "");
	}

	private static raw(raw: string): STParseTree {
		return new STParseTree(STParseTreeNodeType.Raw, raw);
	}

	public static create(raw: string): STParseTree {
		let stack: STParseTree[] = [STParseTree.sequence()];
		let currentRaw = "";

		function pushCurrentRaw() {
			if (currentRaw.length > 0) {
				stack[stack.length - 1].childs.push(STParseTree.raw(currentRaw));
				currentRaw = "";
			}
		}

		for (let i=0; i<raw.length; i++) {
			let c = raw.charAt(i);
			if (c === ".") {
				pushCurrentRaw();
			} else if (c === "(" || c === "[") {
				pushCurrentRaw();
				stack.push(STParseTree.sequence());
			} else if (c === ")" || c === "]") {
				pushCurrentRaw();
				let newChild = stack.pop();
				stack[stack.length - 1].childs.push(newChild);
			} else {
				currentRaw += c;
			}
		}

		return stack[0];
	}

	public toString(): string {
		if (this.nodeType === STParseTreeNodeType.Raw) {
			return this.value;
		} else {
			return "[" + this.childs.toString() + "]";
		}
	}
}