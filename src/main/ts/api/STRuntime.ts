import { STObjectBase } from "../STObjectBase";
import { STNil } from "../STNil";
import { STString } from "../STString";
import { STImportManager } from "./STImportManager";
import { STContext } from "../STContext";
import { STParser } from "../parse/STParser";
import { lastOf } from "../utils/ArrayUtils";

export class STRuntime extends STObjectBase {
	private importManager = new STImportManager();

	public constructor(context: STContext) {
		super();

		this.addMethod("import:", (msg) => {
			let importedFile = msg.getValue(0).expect(STString).value;
			let rawImportedCode = this.importManager.importFile(importedFile);
			let importContext = STContext.create();
			new STParser(rawImportedCode).getAST().runWith(importContext);
			context.delegates.push(importContext);
			return new STNil("STRuntime while importing");
		});
	}

	// Override
	public getClassName(): string {
		return "Runtime";
	}
}