
export function extractTicker(url: string) {
	const regex = /t=([a-zA-Z-]+)&/;
	const match = regex.exec(url);
	if( match) {
		const ticker = match[1].split("-")[0];
		return ticker;
	} else {
	return match ?  match[1] : null
	}
}