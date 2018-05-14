import { STObject } from "./STObject";
import { STClass } from "./STClass";
import { STMessage } from "./STMessage";
import { STMethodHolder } from "./STMethodHolder";
import { STString } from "./STString";
import { STNil } from "./STNil";

/**
 * An instance of a Smalltalk class.
 */
export class STInstance extends STMethodHolder {
	public readonly stClass: STClass;
	private properties: { [name: string] : STObject; } = {};

	constructor(stClass: STClass) {
		super();
		this.stClass = stClass;

		this.addMethod("set:to:", (msg: STMessage) => {
			this.properties[msg.getValue(0).expect(STString).value] = msg.getValue(1);
			return new STNil(this);
		});
		this.addMethod("get:", (msg: STMessage) => this.properties[msg.getValue(0).expect(STString).value]);
		this.addMethod("toString", (msg) => new STString(this.toString()));
		this.setPostMethodHandler((msg: STMessage) => this.stClass.receiveInstanceMessage(this, msg));
	}

	// Override
	public getClassName(): string {
		return "Instance<" + this.stClass.getName() + ">";
	}

	// Override
	public toString(): string {
		let str = "Instance<" + this.stClass.getName() + "> {";

		for (let propertyName in this.properties) {
			str += propertyName + " = " + this.properties[propertyName] + ", ";
		}

		return str.substring(0, str.length - 2) + "}";
	}
}