import { STInterpreter } from "../../main/ts/STInterpreter"
import { LOG, LogLevel } from "../../main/ts/utils/Logger";

LOG.level = LogLevel.Trace;

let interpreter = new STInterpreter();
interpreter.runFile("src/test/smalltalk/HelloWorld.st")