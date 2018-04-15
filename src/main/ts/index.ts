import * as process from "process"
import { STInterpreter } from "./STInterpreter"

let interpreter = new STInterpreter();
interpreter.runFile(process.argv[2]);