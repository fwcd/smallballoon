export enum LogLevel {
	Trace = -2,
	Debug = -1,
	Info = 0,
	Warn = 1,
	Error = 2
}

/**
 * Basic logging abstraction supporting
 * different log levels.
 */
class Logger {
	level: LogLevel;

	public constructor(level: LogLevel) {
		this.level = level;
	}

	/**
	 * Logs a string.
	 * 
	 * @param prefix - An appended prefix
	 * @param msg - The message including {} placeholders
	 * @param insertions - The items that replace their respective placeholders
	 * @param msgLevel - The log level of the message
	 */
	public log(prefix: string, msg: string, insertions: any[], msgLevel: LogLevel): void {
		if (this.level <= msgLevel) {
			let output = prefix + "\t";
			let charIndex = 0;
			let placeholderIndex = 0;

			while (charIndex < msg.length) {
				let c = msg.charAt(charIndex);

				if (c === "{" && msg.charAt(charIndex + 1) === "}") {
					output += insertions[placeholderIndex];
					placeholderIndex++;
					charIndex += 2;
				} else {
					output += c;
					charIndex++;
				}
			}

			console.log(output);
		}
	}

	public trace(msg: string, ...insertions: any[]): void {
		this.log("[TRACE]", msg, insertions, LogLevel.Trace);
	}

	public debug(msg: string, ...insertions: any[]): void {
		this.log("[DEBUG]", msg, insertions, LogLevel.Debug);
	}

	public info(msg: string, ...insertions: any[]): void {
		this.log("[INFO]", msg, insertions, LogLevel.Info);
	}

	public warn(msg: string, ...insertions: any[]): void {
		this.log("[WARN]", msg, insertions, LogLevel.Warn);
	}

	public error(msg: string, ...insertions: any[]): void {
		this.log("[ERROR]", msg, insertions, LogLevel.Error);
	}
}

export const LOG = new Logger(LogLevel.Info);