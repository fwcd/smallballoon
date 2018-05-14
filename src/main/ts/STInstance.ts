import { STObject } from "./STObject";
import { STClass } from "./STClass";
import { STMessage } from "./STMessage";
import { STMethodHolder } from "./STMethodHolder";
import { STString } from "./STString";
import { STNil } from "./STNil";
import { STEmpty } from "./STEmpty";

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
			return STEmpty.getInstance();
		});
		this.addMethod("get:", (msg: STMessage) => this.properties[msg.getValue(0).expect(STString).value]);
		this.addMethod("asString", (msg) => new STString(this.toString()));
		this.setPreMethodHandler((msg: STMessage) => this.stClass.receiveInstanceMessage(this, msg));
	}

	// Override
	public getClassName(): string {
		return "Instance<" + this.stClass.getName() + ">";
	}

	// Override
	public toString(): string {
		let str = "Instance<" + this.stClass.getName() + "> {";

		for (let propertyName in this.properties) {
			str += propertyName + " = " + this.properties[propertyName].toString() + ", ";
		}

		return str.substring(0, str.length - 2) + "}";
	}
}