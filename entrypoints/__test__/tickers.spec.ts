import { describe, expect, test } from "vitest";
import { extractCompany, extractTicker, searchCompanies } from "../utils";

describe("test extracting ticker from url" ,() => {

		const json = {
			"5056": {
				"cik_str": 832370,
				"ticker": "EAXR",
				"title": "Ealixir, Inc."
			},
			"5057": {
				"cik_str": 1495648,
				"ticker": "BDCC",
				"title": "Blackwell 3D Construction Corp."
			},
			"5058": {
				"cik_str": 1784254,
				"ticker": "MDIA",
				"title": "Mediaco Holding Inc."
			},
			"5059": {
				"cik_str": 1961592,
				"ticker": "GSHRF",
				"title": "GOLDSHORE RESOURCES INC."
			},
			"5060": {
				"cik_str": 2028336,
				"ticker": "NEHC",
				"title": "NEW ERA HELIUM INC."
			},
		}
	 test("should get AAPL", async () => {
		const url = "https://finviz.com/quote.ashx?t=AAPL&ty=c&ta=1&p=d"
		const result = extractTicker(url);
		expect(result).toBe("AAPL")
	 })
	 test("should get msft", async () => {
		const url = "https://finviz.com/quote.ashx?t=msft&ty=c&ta=1&p=d"
		const result = extractTicker(url);
		expect(result).toBe("msft")
	 })
	 test("should get BRK", async() => {
		const url = "https://finviz.com/quote.ashx?t=BRK-A&ty=c&ta=1&p=d"
		const result = extractTicker(url);
		if(result!.includes("-")) {
			console.log(result?.split("-")[0])
		}
		expect(result).toBe("BRK")
	 })
	 test("should get comObj by ticker with lowercase", () => {
		const comp = extractCompany("NEHC".toLowerCase());
		expect(comp).toEqual(json["5060"])

	 })
	 test("should get comObj by ticker with uppercase", () => {
		const comp = extractCompany("EAXR");
		expect(comp).toEqual(json["5056"])

	 })
	 test("should get comObj by ticker with uppercase", () => {
		const comp = extractCompany("EAXR");
		expect(comp).toEqual(json["5056"])
	 })

	 test("should get list of companies by title", () => {

			const comp = searchCompanies("Ealixir");
			
	 });
})