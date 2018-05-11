import { AbstractSyntaxTree } from "./ast/AbstractSyntaxTree";
import { ASTNode, NilNode, LiteralNode, BlockNode, AssignmentNode, VariableNode, MessageNode } from "./ast/ASTNode";
import { STNumber } from "../STNumber";
import { strSurroundedByBrackets, strSurroundedBy, strFixedTrim, strSplitWithTail, strSplitAt } from "../utils/StringUtils";
import { STBlock } from "../STBlock";
import { STString } from "../STString";
import { STParseException } from "../utils/STParseException";

export class STParser {
	private ast: AbstractSyntaxTree;

	public constructor(rawCode: string) {
		let formattedCode: string = rawCode.replace(/(\r\n|\n|\r)/gm, ""); // Remove line breaks
		this.ast = new AbstractSyntaxTree(this.parse(formattedCode));
	}

	private parse(raw: string): ASTNode {
		let trimmed = raw.trim();

		if (trimmed.length === 0) {
			return new NilNode("STParser.parse(" + trimmed + ")");

		} else if (this.isInParentheses(trimmed)) {
			return this.getUnwrappedNode(trimmed);

		} else if (this.isBlock(trimmed)) {
			return this.getBlockNode(trimmed);

		} else if (this.isStringLiteral(trimmed)) {
			return this.getStringNode(trimmed);

		} else if (this.isNumberLiteral(trimmed)) {
			return new LiteralNode(new STNumber(+raw));

		} else if (this.isAssignment(trimmed)) {
			return this.getAssignmentNode(trimmed);

		} else if (this.isVariable(trimmed)) {
			return new VariableNode(trimmed);

		} else { // Assume a message
			return this.getMessageNode(trimmed);
		}
	}

	public getAST(): AbstractSyntaxTree {
		return this.ast;
	}

	private isVariable(expression: string): boolean {
		// Matches:
		// <Sequence of word characters>
		return /\w+/.test(expression);
	}

	private isInParentheses(expression: string): boolean {
		// Matches:
		// (<Any Sequence>)
		return strSurroundedByBrackets(expression, "(", ")");
	}

	private isNumberLiteral(expression: string): boolean {
		return !isNaN(+expression); // + converts expression to either number or NaN
	}

	private isStringLiteral(expression: string): boolean {
		// Matches:
		// "<Any Sequence>"
		return strSurroundedBy(expression, "\"", "\"");
	}

	private isAssignment(expression: string): boolean {
		// Matches:
		// <Word> := <Any Sequence>
		return /^\w+ ?:= ?/.test(expression);
	}

	private isBlock(expression: string): boolean {
		// Matches:
		// [<Any Sequence>]
		return strSurroundedByBrackets(expression, "[", "]");
	}

	private getUnwrappedNode(expression: string): ASTNode {
		return this.parse(strFixedTrim(expression, 1));
	}

	private getStringNode(expression: string): ASTNode {
		return new LiteralNode(new STString(strFixedTrim(expression, 1)));
	}

	private getBlockNode(expression: string): BlockNode {
		// Remove the leading and trailing square brackets
		let contents = strFixedTrim(expression, 1);
		let parameters: string[] = [];
		let i = 0;

		if (expression.charAt(0) === ":") {
			// Parse parameters
			i = 1;
			let c: string;
			let currentParameter = "";

			do {
				c = expression.charAt(i);

				if (c === " " || c === "|") {
					if (currentParameter.length > 0) {
						parameters.push(currentParameter);
					}
				} else {
					currentParameter += c;
				}

				i++;
			} while (c !== "|");
		}

		let node = new BlockNode(this.parse(expression.substring(i)), parameters);
		return node;
	}

	private getAssignmentNode(expression: string): AssignmentNode {
		let splittedExpression: string[] = strSplitWithTail(expression, ":=", 2).map(str => str.trim());
		return new AssignmentNode(splittedExpression[0], this.parse(splittedExpression[1]));
	}

	// ==== TODO: ====

	private getMessageNode(expression: string): ASTNode {
		// Parse receiver using a bracket stack
		let stackHeight = 0;
		let i = 0;
		let c: string;
		do {
			c = expression.charAt(i);
			if (c === "(") {
				stackHeight++;
			} else if (c === ")") {
				stackHeight--;
			}
			i++;
		} while (stackHeight > 0 || c !== " ");

		let splittedMessage: string[] = strSplitAt(expression, i);
		let receiver = this.parse(splittedMessage[0]);

		return this.parseMessage(receiver, splittedMessage[1]);
	}

	private splitMessageParametersByColon(rawParameters: string): string[] {
		let result: string[] = [];
		let trimmedParameters = rawParameters.replace(/ ?: ?/, ":");

		let currentParameter: string = "";
		let stackHeight: number = 0;

		for (let i=0; i<trimmedParameters.length; i++) {
			let c = trimmedParameters.charAt(i);

			if (stackHeight === 0 && c === ":") {
				result.push(currentParameter);
				currentParameter = "";
			} else {
				currentParameter += c;

				if (c === "[" || c === "(") {
					stackHeight++;
				} else if (c === "]" || c === ")") {
					stackHeight--;
				}

				if (stackHeight < 0) {
					throw new STParseException("Inconsistent brackets in message parameters: " + rawParameters);
				}
			}
		}
		result.push(currentParameter);

		if (stackHeight != 0) {
			throw new STParseException("Inconsistent brackets in message parameters: " + rawParameters);
		}

		return result;
	}

	private parseMessage(receiver: ASTNode, rawParameters: string): ASTNode {
		let node = new MessageNode(receiver);
		let shiftedSplit = this.splitMessageParametersByColon(rawParameters);

		if (shiftedSplit.length === 1) {
			node.labels.push(shiftedSplit[0]);
			node.values.push(new NilNode("STScope.parseMessage(...) - no argument value"));
		} else {
			let currentLabel: string = "";
			let currentValue: ASTNode = new NilNode("STScope.parseMessage(...)");
			let nextLabel: string = shiftedSplit[0].trim();

			for (let i=1; i<shiftedSplit.length; i++) {
				let current = shiftedSplit[i].trim();
				let currentSplit = current.split(" ");

				currentLabel = nextLabel;
				nextLabel = currentSplit[currentSplit.length - 1];

				let currentValueStr: string;

				if (i == (shiftedSplit.length - 1)) { // If in last iteration
					currentValueStr = current;
				} else {
					currentValueStr = current.slice(0, current.length - nextLabel.length);
				}

				currentValue = this.parse(currentValueStr);

				node.labels.push(currentLabel);
				node.values.push(currentValue);
			}
		}

		return node;
	}
}