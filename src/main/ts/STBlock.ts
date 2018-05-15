import { STMessageParameter } from "./STMessage";
import { STObject } from "./STObject";
import { STObjectBase } from "./STObjectBase";
import { STBoolean } from "./STBoolean";
import { STNil } from "./STNil";
import { STEmpty } from "./STEmpty";

export type STBlockEvaluator = (implicitParameters: STMessageParameter[], explicitParameters: STMessageParameter[]) => STObject;

/**
 * A block of Smalltalk code that can be
 * dynamically called.
 *
 * Similar to closures or lambdas in other
 * languages.
 */
export class STBlock extends STObjectBase {
	public readonly implicitParameters: string[];
	public readonly explicitParameters: string[];
	private evaluator: STBlockEvaluator;

	public constructor(implicitParameters: string[], explicitParameters: string[], evaluator: STBlockEvaluator) {
		super();
		this.implicitParameters = implicitParameters;
		this.explicitParameters = explicitParameters;
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
		this.setPostMethodHandler((msg) => {
			this.evaluateWith([], msg.parameters);
			return STEmpty.getInstance();
		});
	}

	public evaluateWith(implicitParameters: STMessageParameter[], explicitParameters: STMessageParameter[]): STObject {
		return this.evaluator(implicitParameters, explicitParameters);
	}

	public evaluate(): STObject {
		return this.evaluator([], []);
	}

	// Override
	public getClassName(): string {
		return "Block";
	}
}