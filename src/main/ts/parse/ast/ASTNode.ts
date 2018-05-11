import { STContext } from "../../STContext";
import { STObject } from "../../STObject";
import { STNil } from "../../STNil";
import { STBlock, STBlockEvaluator } from "../../STBlock";
import { STString } from "../../STString";
import { STParseException } from "../../utils/STParseException";
import { STMessageParameter, STMessage } from "../../STMessage";

export interface ASTNode {
	evaluate(context: STContext): STObject;
}

export class ExpressionListNode implements ASTNode {
	public readonly expressions: ASTNode[] = [];

	public evaluate(context: STContext): STObject {
		this.expressions.forEach(exp => exp.evaluate(context));
		return new STNil("ExpressionListNode.evaluate(...)");
	}
}

export class BlockNode implements ASTNode {
	public readonly parameters: string[];
	public readonly value: ASTNode;

	public constructor(value: ASTNode, parameters: string[]) {
		this.value = value;
		this.parameters = parameters;
	}

	public evaluate(context: STContext): STObject {
		return new STBlock((parameters) => {
			let subContext = context.asDelegate();
			let parameterIndex = 0;
			parameters.forEach(parameter => {
				subContext.setVariable(parameter.label, parameter.value);
				if (parameter.label !== this.parameters[parameterIndex]) {
					throw new STParseException("Provided parameter #" + parameterIndex + " " + parameter.label + " not declared in block!");
				}
				parameterIndex++;
			});
			return this.value.evaluate(subContext);
		});
	}
}

export class LiteralNode implements ASTNode {
	public readonly value: STObject;

	public constructor(value: STObject) {
		this.value = value;
	}

	public evaluate(context: STContext): STObject {
		return this.value;
	}
}

export class VariableNode implements ASTNode {
	private readonly variableName: string;

	public constructor(variableName: string) {
		this.variableName = variableName;
	}

	public evaluate(context: STContext): STObject {
		return context.getVariable(this.variableName);
	}
}

export class MessageNode implements ASTNode {
	public readonly receiver: ASTNode;
	public readonly labels: string[] = [];
	public readonly values: ASTNode[] = [];

	public constructor(receiver: ASTNode) {
		this.receiver = receiver;
	}

	public evaluate(context: STContext): STObject {
		let receiver = this.receiver.evaluate(context);
		let parameters: STMessageParameter[] = [];

		if (this.labels.length !== this.values.length) {
			throw new STParseException("Length of labels (" + this.labels.toString() + ") does not match length of values (" + this.values.toString() + ")");
		}

		for (let i=0; i<this.labels.length; i++) {
			parameters.push({
				label: this.labels[i],
				value: this.values[i].evaluate(context)
			});
		}

		return receiver.receiveMessage(new STMessage(receiver, parameters));
	}
}

export class AssignmentNode implements ASTNode {
	private readonly variable: string;
	private readonly value: ASTNode;

	public constructor(variable: string, value: ASTNode) {
		this.variable = variable;
		this.value = value;
	}

	public evaluate(context: STContext): STObject {
		let evaluatedValue = this.value.evaluate(context);
		context.setVariable(this.variable, evaluatedValue);
		return evaluatedValue;
	}
}

export class NilNode implements ASTNode {
	private readonly value: STNil;

	public constructor(origin: string | STObject) {
		this.value = new STNil(origin);
	}

	public evaluate(context: STContext): STObject {
		return this.value;
	}
}