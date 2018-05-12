import { STMessage, STMessageParameter } from "./STMessage";
import { STObject } from "./STObject";
import { STMethodHolder } from "./STMethodHolder";
import { STBoolean } from "./STBoolean";
import { STNil } from "./STNil";

export type STBlockEvaluator = (parameters: STMessageParameter[]) => STObject;

/**
 * A block of Smalltalk code that can be
 * dynamically called.
 *
 * Similar to closures or lambdas in other
 * languages.
 */
export class STBlock extends STMethodHolder {
	private evaluator: STBlockEvaluator;

	public constructor(evaluator: STBlockEvaluator) {
		super();
		this.evaluator = evaluator;

		this.addMethod("value", (msg) => this.evaluate());
		this.addMethod("whileTrue:", (msg) => {
			let body = msg.getValue(0).expect(STBlock);
			while (this.evaluate().expect(STBoolean).value) {
				body.evaluate();
			}
			return new STNil(this);
		});
		this.addMethod("whileFalse:", (msg) => {
			let body = msg.getValue(0).expect(STBlock);
			while (!this.evaluate().expect(STBoolean).value) {
				body.evaluate();
			}
			return new STNil(this);
		});
		this.addMethod("doWhileTrue:", (msg) => {
			let body = msg.getValue(0).expect(STBlock);
			do {
				body.evaluate();
			} while (this.evaluate().expect(STBoolean).value);
			return new STNil(this);
		});
		this.addMethod("doWhileFalse:", (msg) => {
			let body = msg.getValue(0).expect(STBlock);
			do {
				body.evaluate();
			} while (!this.evaluate().expect(STBoolean).value);
			return new STNil(this);
		});
		this.setPostMethodHandler((msg) => this.evaluateWith(msg.parameters));
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