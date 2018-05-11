import { STMessage, STMessageParameter } from "./STMessage";
import { STObject } from "./STObject";

export type STBlockEvaluator = (parameters: STMessageParameter[]) => STObject;

/**
 * A block of Smalltalk code that can be
 * dynamically called.
 *
 * Similar to closures or lambdas in other
 * languages.
 */
export class STBlock extends STObject {
	private evaluator: STBlockEvaluator;

	public constructor(evaluator: STBlockEvaluator) {
		super();
		this.evaluator = evaluator;
	}

	// Override
	public handleMessage(message: STMessage): STObject {
		if (message.getName() === "value") {
			return this.evaluate();
		} else {
			return this.evaluateWith(message.parameters);
		}
	}

	public evaluateWith(parameters: STMessageParameter[]): STObject {
		return this.evaluator(parameters);
	}

	public evaluate(): STObject {
		return this.evaluator([]);
	}

	// Override
	public getClassName(): string {
		return "Block";
	}
}