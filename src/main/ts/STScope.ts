import { STParseException } from "./STParseException";
import { STContext } from "./STContext";
import { STObject } from "./STObject";
import { STMessage, STMessageParameter } from "./STMessage";
import { STNil } from "./STNil";
import { STBlock } from "./STBlock";

/**
 * Represents a Smalltalk scope containing
 * expressions and variables.
 * 
 * Inteprets and runs Smalltalk code internally. 
 */
export class STScope {
	private expressions: string[];
	context = new STContext();

	public constructor(rawCode: string) {
		let formattedCode: string = rawCode
				.replace(/(\r\n|\n|\r)/gm, ""); // Remove line breaks
		this.expressions = formattedCode.split(".");
	}

	public run() {
		this.expressions.forEach(expression => {
			this.evaluateExpression(expression);
		});
	}

	private evaluateExpression(expression: string): STObject {
		return this.getExpressionEvaluator(expression)();
	}

	private getExpressionEvaluator(expression: string): () => STObject {
		let trimmedExpression = expression.trim();

		if (trimmedExpression.length === 0) {
			return () => STNil.get();
		} else if (this.isBlock(trimmedExpression)) {
			return this.getBlockFetcher(trimmedExpression);
		} else if (this.isAssignment(trimmedExpression)) {
			return this.getAssignmentRunner(trimmedExpression);
		} else if (this.isMessage(trimmedExpression)) {
			return this.getMessageRunner(trimmedExpression);
		} else {
			throw new STParseException("Could not identify expression: " + expression);
		}
	}

	private getMessageRunner(expression: string): () => STObject {
		let splittedExpression = expression.split(" ", 2);

		return () => {
			let receiver: STObject = this.context.getVariable(splittedExpression[0]);
			return receiver.receiveMessage(this.parseMessage(receiver, splittedExpression[1]))
		};
	}

	private parseMessage(receiver: STObject, rawParameters: string): STMessage {
		let parameters: STMessageParameter[] = [];
		let shiftedSplit = rawParameters.split(/ ?: ?/);

		let currentLabel: string = "";
		let currentValue: STObject = STNil.get();
		let nextLabel: string = "";

		for (let i=1; i<shiftedSplit.length; i++) {
			let current = shiftedSplit[i].trim();
			let currentSplit = current.split(" ");

			currentLabel = nextLabel;
			nextLabel = currentSplit[currentSplit.length - 1];
			currentValue = this.evaluateExpression(current.slice(0, current.length - nextLabel.length));
			
			parameters.push({
				label: currentLabel,
				value: currentValue
			});
		}

		return new STMessage(receiver, parameters);
	}

	private getBlockFetcher(expression: string): () => STBlock {
		// Remove the leading and trailing square brackets
		let rawBlockCode = expression.slice(1, expression.length - 1);
		let block = new STBlock(new STScope(rawBlockCode));

		return () => block;
	}

	private getAssignmentRunner(expression: string): () => STNil {
		let splittedExpression: string[] = expression.split(/ ?:= ?/, 2);

		return () => {
			let assignedObject = this.evaluateExpression(expression[1]);
			this.context.setVariable(expression[0], assignedObject);
			return STNil.get();
		};
	}
	
	private isMessage(expression: string): boolean {
		// Matches:
		// <Word> <Word>
		// or:
		// <Word> <Word>:<Any Sequence>
		return /^\w+ \w+ ?($|:.*)/.test(expression);
	}

	private isAssignment(expression: string): boolean {
		// Matches:
		// <Word> := <Any Sequence>
		return /^\w+ ?:= ?/.test(expression);
	}

	private isBlock(expression: string): boolean {
		// Matches:
		// [<Any Sequence>]
		return /^\[.*\]$/.test(expression);
	}
}