import * as fs from "fs";

export class STImportManager {
	private importedFiles: string[] = [];

	public importFile(fileName: string): string {
		if (this.importedFiles.indexOf(fileName) >= 0) {
			// Already imported
			return "";
		} else {
			this.importedFiles.push(fileName);
			return fs.readFileSync(fileName, "utf8");
		}
	}
}