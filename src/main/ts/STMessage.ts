import { STObject } from "./STObject";

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
	public readonly receiver: STObject;
	public readonly parameters: STMessageParameter[];

	public constructor(receiver: STObject, parameters: STMessageParameter[]) {
		super();
		this.receiver = receiver;
		this.parameters = parameters;
	}

	public static from(receiver: STObject, args: [string, STObject][]): STMessage {
		let parameters: STMessageParameter[] = [];
		args.forEach(arg => {
			parameters.push({
				label: arg[0],
				value: arg[1]
			});
		});
		return new STMessage(receiver, parameters);
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
		return this.getLabel(0);
	}

	public getLabel(index: number): string {
		return this.parameters[index].label;
	}

	public getValue(index: number): STObject {
		return this.parameters[index].value;
	}

	public getSelector(): string {
		let selectorStr = "";
		let lastIndex = this.parameters.length - 1;

		for (let i=0; i<=lastIndex; i++) {
			let parameter = this.parameters[i];
			selectorStr += parameter.label;

			if (i !== lastIndex || !parameter.value.isNil()) {
				selectorStr += ":";
			}
		}

		return selectorStr;
	}
}