/**
 * Returns a centered subsequence of
 * the string by cutting of a specified amount
 * of leading and trailing characters.
 * 
 * @param str - The string to be used
 * @param charCount - The amount of character to be cut off on each end
 */
export function strFixedTrim(str: string, charCount: number) {
	return str.slice(charCount, str.length - charCount);
}

/**
 * Splits the string a fixed number of times
 * and puts the rest into the array.
 * 
 * @param str - The string to be used
 * @param splitCount - The amount of splits
 */
export function strSplitWithTail(str: string, delimiter: string, splitCount: number): string[] {
	let parts: string[] = str.split(delimiter);
	let tail: string = parts.slice(splitCount).join(delimiter);
	let result: string[] = parts.slice(0, splitCount);
	if (tail.length > 0) {
		result.push(tail);
	}
	return result;
}

/**
 * Splits the string at the first occurence of
 * the delimiter and returns a two-element
 * array containing the first part and the rest
 * of the string.
 * 
 * @param str - The string to be used
 * @param delimiter - The delimiter around which the string will be split
 */
export function strSplitOnce(str: string, delimiter: string): string[] {
	return strSplitWithTail(str, delimiter, 1);
}

/**
 * Checks whether a string starts with a string
 * and ends with another string.
 * 
 * @param str - The string to be tested
 * @param prefix - The start of a matching string
 * @param postfix - The end of a matching string
 */
export function strSurroundedBy(str: string, prefix: string, postfix: string): boolean {
	let start = str.slice(0, prefix.length);
	let end = str.slice(str.length - postfix.length, str.length);
	return (start === prefix) && (end === postfix);
}

/**
 * Checks whether a string contains another string.
 * Mainly used to improve readability.
 * 
 * @param str - The string to be tested
 * @param substring - A subsequence of a matching string
 */
export function strContains(str: string, substring: string): boolean {
	return str.indexOf(substring) !== -1;
}