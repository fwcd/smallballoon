import { STLoader } from "../../main/ts/STLoader"
import { LOG, LogLevel } from "../../main/ts/utils/Logger";

LOG.level = LogLevel.Info;

let interpreter = new STLoader();
interpreter.runFile("src/test/smalltalk/HelloWorld.st")