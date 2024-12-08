
export function extractTicker(url: string) {
	const regex = /t=([a-zA-Z]+)&/;
	const match = regex.exec(url);
	return match ?  match[1] : null
}