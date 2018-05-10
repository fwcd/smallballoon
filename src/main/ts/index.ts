import * as process from "process"
import { STLoader } from "./STLoader"
import { STLoaderException } from "./utils/STLoaderException";

let interpreter = new STLoader();

if (process.argv.length < 2) {
	throw new STLoaderException("Missing an argument containing the Smalltalk file to be interpreted.");
}

let filePath = process.argv[2];
interpreter.runFile(filePath);