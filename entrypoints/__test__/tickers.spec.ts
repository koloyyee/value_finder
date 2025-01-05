import { describe, expect, test } from "vitest";
import { extractTicker } from "../utils";

describe("test extracting ticker from url" ,() => {
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
})