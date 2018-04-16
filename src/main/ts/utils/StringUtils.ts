/**
 * Splits the string at the first occurence of
 * the delimiter and returns a two-element
 * array containing the first part and the rest
 * of the string.
 * 
 * @param str - The string to be used
 * @param delimiter - The delimiter around which the string will be split
 */
export function strSplitOnce(str: string, delimiter: string | RegExp): string[] {
	let first = str.split(delimiter, 1)[0];
	return [first, str.slice(first.length, str.length)];
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