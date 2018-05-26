import { STMessageParameter } from "./STMessage";
import { STObject } from "./STObject";
import { STObjectBase } from "./STObjectBase";
import { STBoolean } from "./STBoolean";
import { STNil } from "./STNil";
import { STEmpty } from "./STEmpty";
import { STGeneralException } from "./utils/STGeneralException";
import { LOG, LogLevel } from "./utils/Logger";

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
			return this.evaluateWith([], msg.parameters);
		});
	}

	public evaluateWith(implicitParameters: STMessageParameter[], explicitParameters: STMessageParameter[]): STObject {
		if (LOG.uses(LogLevel.Trace)) {
			LOG.trace(
				"Evaluating Block with [{}], [{}]",
				implicitParameters.map(p => p.label + " = " + p.value),
				explicitParameters.map(p => p.label + " = " + p.value)
			);
		}
		return this.evaluator(implicitParameters, explicitParameters);
	}

	public evaluateWithArgs(...explicitParameterValues: STObject[]) {
		let parameters: STMessageParameter[] = [];

		if (explicitParameterValues.length < this.explicitParameters.length) {
			throw new STGeneralException("Too few provided arguments [" + explicitParameterValues + "], expecting [" + this.explicitParameters + "]");
		}

		for (let i=0; i<explicitParameterValues.length; i++) {
			parameters.push({
				label: this.explicitParameters[i],
				value: explicitParameterValues[i]
			});
		}

		return this.evaluateWith([], parameters);
	}

	public evaluate(): STObject {
		return this.evaluateWith([], []);
	}

	// Override
	public getClassName(): string {
		return "Block";
	}
}