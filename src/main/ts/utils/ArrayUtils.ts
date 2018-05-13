export function lastOf<T>(arr: T[]): T {
	return arr[arr.length - 1];
}

export function strArrayTrim(arr: string[]): string[] {
	return arr.filter(element => element.length > 0);
}