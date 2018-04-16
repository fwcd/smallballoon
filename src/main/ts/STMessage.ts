import { STObject } from "./STObject";
import { STSelector } from "./STSelector";

export interface STMessageParameter {
	readonly label: string;
	readonly value: STObject;
}

/**
 * A Smalltalk message. Usually it looks like:
 * 
 * 
 * Receiver         Message parameters
 *  __|__    _____________|___________________
 * /     \  /                                 \
 * <Object> <Label>
 * <Object> <Label1>:<Value>
 * <Object> <Label1>:<Value1> <Label2>:<Value2>
 * 
 * 
 * The combination of labels is also referred
 * to as the "selector" of the message.
 */
export class STMessage extends STObject {
	readonly receiver: STObject;
	readonly parameters: STMessageParameter[];

	public constructor(receiver: STObject, parameters: STMessageParameter[]) {
		super();
		this.receiver = receiver;
		this.parameters = parameters;
	}

	// Override
	public getClassName(): string {
		return "Message";
	}

	// Override
	public toString(): string {
		return this.parameters
				.map(param => param.label + ":" + param.value.toString())
				.reduceRight((previous, current) => current + " " + previous);
	}

	/**
	 * Returns the first argument label.
	 */
	public getName(): string {
		return this.parameters[0].label;
	}

	public getSelector(): STSelector {
		return new STSelector(this.parameters.map(p => p.label).reduceRight((prev, current) => current + ":" + prev));
	}
}