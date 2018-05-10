import { STParseException } from "../utils/STParseException";
import { STContext } from "../STContext";
import { STObject } from "../STObject";
import { STMessage, STMessageParameter } from "../STMessage";
import { STNil } from "../STNil";
import { STBlock } from "../STBlock";
import { strSurroundedBy, strSplitAt, strSplitOnce, strFixedTrim, strSplitWithTail, strSurroundedByBrackets } from "../utils/StringUtils";
import { STString } from "../STString";
import { LOG } from "../utils/Logger";
import { STNumber } from "../STNumber";
import { STBoolean } from "../STBoolean";

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

		} else if (this.isNumberLiteral(trimmedExpression)) {
			return () => new STNumber(+trimmedExpression);

		} else if (this.context.hasVariable(trimmedExpression)) {
			return () => this.context.getVariable(trimmedExpression);

		} else if (this.isAssignment(trimmedExpression)) {
			return this.getAssignmentRunner(trimmedExpression);

		} else { // Assume a message
			return this.getMessageRunner(trimmedExpression);
		}
	}

	private getMessageRunner(expression: string): () => STObject {
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

		return () => {
			let receiver: STObject = this.evaluateExpression(splittedMessage[0]);
			return receiver.receiveMessage(this.parseMessage(receiver, splittedMessage[1]));
		};
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

	private parseMessage(receiver: STObject, rawParameters: string): STMessage {
		let parameters: STMessageParameter[] = [];
		let shiftedSplit = this.splitMessageParametersByColon(rawParameters);

		if (shiftedSplit.length === 1) {
			parameters.push({
				label: shiftedSplit[0],
				value: new STNil("STScope.parseMessage(...) - no argument value")
			})
			return new STMessage(receiver, parameters);
		}

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
		let splittedExpression: string[] = strSplitWithTail(expression, ":=", 2).map(str => str.trim());

		return () => {
			let assignedObject = this.evaluateExpression(splittedExpression[1]);
			this.context.setVariable(splittedExpression[0], assignedObject);
			return new STNil("STScope.getAssignmentRunner(...)");
		};
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
}