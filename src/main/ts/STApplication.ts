import { STParseException } from "./STParseException";
import { STContext } from "./STContext";

/**
 * Represents an entire Smalltalk program.
 * Inteprets and runs Smalltalk code internally. 
 */
export class STApplication {
	private expressions: string[];
	private context = new STContext();

	public constructor(expressions: string[]) {
		this.expressions = expressions;
	}

	public run() {
		this.expressions.forEach(expression => {
			this.runSTExpression(expression);
		});
	}

	private runSTExpression(expression: string) {
		let trimmedExpression = expression.trim();
		if (this.isBlock(trimmedExpression)) {
			this.runBlock(trimmedExpression);
		} else if (this.isAssignment(trimmedExpression)) {
			this.runAssignment(trimmedExpression);
		} else if (this.isMessage(trimmedExpression)) {
			this.runMessage(trimmedExpression);
		} else {
			throw new STParseException("Could not identify expression: " + expression);
		}
	}

	private runMessage(expression: string) {
		// TODO
	}

	private runBlock(expression: string) {
		// TODO
	}

	private runAssignment(expression: string) {
		// TODO
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