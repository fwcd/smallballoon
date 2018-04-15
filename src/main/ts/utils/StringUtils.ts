export function strSurroundedBy(str:string, prefix: string, postfix: string): boolean {
	let start = str.slice(0, prefix.length);
	let end = str.slice(str.length - postfix.length, str.length);
	return (start === prefix) && (end === postfix);
}

export function strContains(str: string, substring: string): boolean {
	return str.indexOf(substring) !== -1;
}