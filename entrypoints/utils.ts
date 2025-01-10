import compTickers from "@/assets/company_tickers.json";
import { CompObj } from "./types";

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
/**
 * The function will support both ticker and title,
 * that supports incomplete input.
 * 
 * Ideally the data structure will be like this:
 * if input 
 * [
 * 	{
 * 		cik_str: 320193,
 * 		ticker: "AAPL",
 * 		title: "Apple Inc.",
 * 		quarterAnnual: "https://www.sec.gov/edgar/search/#/category=custom&entityName=AAPL&forms=10-K%252C10-Q%252C20-F%252C40-F",
 * 		insider: "https://www.sec.gov/edgar/search/#/category=custom&entityName=AAPL&forms=144"
 * 	}
 * ]
 */
export function searchCompanies(input: string) {

	const field = input.includes(" ") ? "title" : "ticker";

	// const compObj = Object.values(compTickers).find((obj: CompObj) => obj[field].includes(input.toUpperCase()));
	const compObj = Object.values(compTickers).filter((obj: CompObj) => obj[field].startsWith(input.toUpperCase()));
	console.log(compObj)
	// if (compObj) {
	// 	const processedCik = compObj.cik_str.toString().padStart(10, "0");
	// 	const ticker = compObj.ticker;

	// 	const quarterAnnualUrl =  `https://www.sec.gov/edgar/search/#/category=custom&ciks=${processedCik}&entityName=${ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`;
	// 	const insider = `https://www.sec.gov/edgar/search/#/category=custom&entityName=${ticker}&forms=144`;

	// 	const result: CompObj = { ...compObj, quarterAnnual: quarterAnnualUrl, insider }
	// 	console.log(result)

	// }
	return undefined;
}
export function extractCompany(input: string): CompObj | undefined {
	// determine it is ticker or title.
	const field = input.includes(" ") ? "title" : "ticker";
	return Object.values(compTickers).find((obj: CompObj) => obj[field].includes(input.toUpperCase()));
	
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

export function parseDate(dateString: string): Date {
	const [date, time] = dateString.split(", ");
	const [day, month, year] = date.split("/").map(Number)
	const [hrs, mins, secs] = time.split(":").map(Number)
	return new Date(year, month - 1, day, hrs, mins, secs)
}

