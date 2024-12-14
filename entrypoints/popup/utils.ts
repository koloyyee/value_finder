
export function extractTicker(url: string) {
	const regex = /t=([a-zA-Z-]+)&/;
	const match = regex.exec(url);
	if (match) {
		const ticker = match[1].split("-")[0];
		return ticker;
	} else {
		return match ? match[1] : null
	}
}

export const quarterAnnual = (ticker: string) => `https://www.sec.gov/edgar/search/#/category=custom&entityName=${ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`;
/**
 * 
 * @param ticker https://www.sec.gov/edgar/search/#/category=custom&ciks=0001691493&entityName=Nu&forms=10-K%252C10-Q%252C20-F%252C40-F
 * @param cik 
 * @returns 
 */
export const quarterAnnualWCik = (ticker: string, cik: number) => {
	const processedCik = cik.toString().padStart(10, "0");
return `https://www.sec.gov/edgar/search/#/category=custom&ciks=${processedCik}&entityName=${ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`;
}



export const insider = (ticker: string) => `https://www.sec.gov/edgar/search/#/category=custom&entityName=${ticker}&forms=144`;
