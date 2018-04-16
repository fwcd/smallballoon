import { STParseException } from "./utils/STParseException";
import { STContext } from "./STContext";
import { STObject } from "./STObject";
import { STMessage, STMessageParameter } from "./STMessage";
import { STNil } from "./STNil";
import { STBlock } from "./STBlock";
import { strSurroundedBy, strSplitOnce, strFixedTrim } from "./utils/StringUtils";
import { STString } from "./STString";
import { LOG } from "./utils/Logger";

/**
 * Represents a Smalltalk scope containing
 * expressions and variables.
 * 
 * Inteprets, parses and runs Smalltalk code
 * under the hood. 
 */
export class STScope {
	private expressions: string[];
	context = new STContext();

	public constructor(rawCode: string) {
		let formattedCode: string = rawCode
				.replace(/(\r\n|\n|\r)/gm, ""); // Remove line breaks
		this.expressions = formattedCode.split(".");
	}

	public run(): void {
		this.expressions.forEach(expression => {
			this.evaluateExpression(expression);
		});
	}

	private evaluateExpression(expression: string): STObject {
		let result = this.getExpressionEvaluator(expression)();
		LOG.deepTrace("Evaluated '{}' to {}", expression, result);
		return result;
	}

	private getExpressionEvaluator(expression: string): () => STObject {
		let trimmedExpression = expression.trim();

		if (trimmedExpression.length === 0) {
			return () => new STNil("STScope.getExpressionEvaluator(...)");

		} else if (this.isInParentheses(trimmedExpression)) {
			return this.getUnwrappedExpressionEvaluator(trimmedExpression);

		} else if (this.isBlock(trimmedExpression)) {
			return this.getBlockFetcher(trimmedExpression);

		} else if (this.isStringLiteral(trimmedExpression)) {
			return this.getStringFetcher(trimmedExpression);

		} else if (this.isAssignment(trimmedExpression)) {
			return this.getAssignmentRunner(trimmedExpression);

		} else if (this.isMessage(trimmedExpression)) {
			return this.getMessageRunner(trimmedExpression);

		} else {
			throw new STParseException("Could not identify expression: " + expression);
		}
	}

	private getMessageRunner(expression: string): () => STObject {
		let splittedExpression = strSplitOnce(expression, " ");

		return () => {
			let receiver: STObject = this.context.getVariable(splittedExpression[0]);
			return receiver.receiveMessage(this.parseMessage(receiver, splittedExpression[1]));
		};
	}

	private splitMessageParametersByColon(rawParameters: string): string[] {
		let result: string[] = [];
		let trimmedParameters = rawParameters.replace(/ ?: ?/, ":");

		let currentParameter: string = "";
		let stackHeight: number = 0;

		for (let i=0; i<trimmedParameters.length; i++) {
			let c = trimmedParameters.charAt(i);

			if (stackHeight == 0 && c == ":") {
				result.push(currentParameter);
				currentParameter = "";
			} else {
				currentParameter += c;

				if (c == "[" || c == "(") {
					stackHeight++;
				} else if (c == "]" || c == ")") {
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

	private parseMessage(receiver: STObject, rawParameters: string): STMessage {
		let parameters: STMessageParameter[] = [];
		let shiftedSplit = this.splitMessageParametersByColon(rawParameters);

		let currentLabel: string = "";
		let currentValue: STObject = new STNil("STScope.parseMessage(...)");
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

			currentValue = this.evaluateExpression(currentValueStr);
			
			parameters.push({
				label: currentLabel,
				value: currentValue
			});
		}

		return new STMessage(receiver, parameters);
	}

	private getUnwrappedExpressionEvaluator(expression: string): () => STObject {
		return this.getExpressionEvaluator(strFixedTrim(expression, 1));
	}

	private getStringFetcher(expression: string): () => STString {
		let str = new STString(strFixedTrim(expression, 1));
		return () => str;
	}

	private getBlockFetcher(expression: string): () => STBlock {
		// Remove the leading and trailing square brackets
		let block = new STBlock(new STScope(strFixedTrim(expression, 1)));
		return () => block;
	}

	private getAssignmentRunner(expression: string): () => STNil {
		let splittedExpression: string[] = strSplitOnce(expression, / ?:= ?/);

		return () => {
			let assignedObject = this.evaluateExpression(expression[1]);
			this.context.setVariable(expression[0], assignedObject);
			return new STNil("STScope.getAssignmentRunner(...)");
		};
	}
	
	private isInParentheses(expression: string): boolean {
		// Matches:
		// (<Any Sequence>)
		return strSurroundedBy(expression, "(", ")");
	}

	private isStringLiteral(expression: string): boolean {
		// Matches:
		// "<Any Sequence>"
		return strSurroundedBy(expression, "\"", "\"");
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
		return strSurroundedBy(expression, "[", "]");
	}
}