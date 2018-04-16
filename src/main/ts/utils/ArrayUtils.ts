export function strArrayTrim(arr: string[]): string[] {
	return arr.filter(element => element.length > 0);
}