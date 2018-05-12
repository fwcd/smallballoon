import { STLoader } from "../../main/ts/STLoader";
import { LOG, LogLevel } from "../../main/ts/utils/Logger";
import { strSplitWithTail } from "../../main/ts/utils/StringUtils";

LOG.level = LogLevel.Info;

let interpreter = new STLoader();
interpreter.runFile("src/test/smalltalk/TestApp.st");