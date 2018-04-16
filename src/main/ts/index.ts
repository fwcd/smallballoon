import * as process from "process"
import { STLoader } from "./STLoader"

let interpreter = new STLoader();
interpreter.runFile(process.argv[2]);