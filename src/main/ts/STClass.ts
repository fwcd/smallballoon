import { STObject } from "./STObject";
import { STMessage, STMessageParameter } from "./STMessage";
import { STNil } from "./STNil";
import { STInstance } from "./STInstance";
import { STSelector } from "./STSelector";
import { STObjectBase } from "./STObjectBase";
import { STString } from "./STString";
import { STBlock } from "./STBlock";
import { STTypeException } from "./utils/STTypeException";
import { LOG } from "./utils/Logger";

/**
 * A Smalltalk class.
 */
export class STClass extends STObjectBase {
	private superclass: STClass = null;
	private fieldNames: string[];
	private classMethods: { [selector: string] : (parameters: STMessageParameter[]) => STObject; } = {};
	private instanceMethods: { [selector: string] : (instance: STInstance, parameters: STMessageParameter[]) => STObject; } = {};
	private name: string = "?";

	public constructor() {
		super();

		this.addMethod("new", (message) => new STInstance(this));
		this.addMethod("subclass", (message) => {
			let subclass = new STClass();
			subclass.inherit(this);
			return subclass;
		});
		this.addMethod("setMethod:to:", (message) => {
			let selector = message.getValue(0).expect(STString).value;
			let body = message.getValue(1).expect(STBlock);

			this.instanceMethods[selector] = (instance, parameters) => body.evaluateWith([{
				label: "self",
				value: instance
			}], this.mapParametersToBlockArgs(parameters, body.explicitParameters, selector));
			return new STNil("STClass while setting new instance method");
		});
		this.addMethod("setClassMethod:to:", (message) => {
			let selector = message.getValue(0).expect(STString).value;
			let body = message.getValue(1).expect(STBlock);

			this.classMethods[selector] = (parameters) => body.evaluateWith([],
				this.mapParametersToBlockArgs(parameters, body.explicitParameters, selector)
			);
			return new STNil("STClass while setting new class method");
		});
		this.instanceMethods["asString"] = (instance, parameters) => new STString(instance.toString());
	}

	public inherit(superclass: STClass): void {
		this.superclass = superclass;
	}

	// Override
	protected handleMessage(message: STMessage): STObject {
		let selector: string = message.getSelector().value;

		if (selector in this.classMethods) {
			return this.classMethods[selector](message.parameters);
		}

		return super.handleMessage(message);
	}

	public getName(): string { return this.name; }

	// Override
	public onAssignTo(name: string): void {
		this.name = name;
	}

	// Override
	public getClassName(): string {
		return "Class<" + this.name + ">";
	}

	public receiveInstanceMessage(instance: STInstance, message: STMessage): STObject {
		let selector: string = message.getSelector().value;

		// TODO: Implement Smalltalk superclasses and delegates

		if (selector in this.instanceMethods) {
			// Call instance method using instance
			return this.instanceMethods[selector](instance, message.parameters);
		} else {
			return new STNil(this);
		}
	}

	private mapParametersToBlockArgs(parameters: STMessageParameter[], blockArgs: string[], methodName: string) {
		let result: STMessageParameter[] = [];

		if (parameters.length !== blockArgs.length && !(parameters.length > 0 && parameters[0].value.isNil())) {
			LOG.error("Parameters: {:?}, arguments: {}", parameters, blockArgs);
			throw new STTypeException("Parameter count does not match block argument count in " + methodName);
		}

		for (let i=0; i<parameters.length; i++) {
			result.push({
				label: blockArgs[i],
				value: parameters[i].value
			});
		}

		return result;
	}
}