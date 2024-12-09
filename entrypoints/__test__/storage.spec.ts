import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { ScreenerStorage } from "../storage";
import { Collection } from "../types";



const mockScreener = new ScreenerStorage(chrome.storage.local, Collection.mockScreeners)

describe("chrome storage testing", () => {


	beforeAll(async () => {
		await mockScreener.save("test", "www.google.com");
	})

	afterAll(() => {
		mockScreener.clear()
	})
	test("should return obj by key", async () => {
		const result = await mockScreener.get({ key: "test" });
		if (result) {
			expect(result!["test"]).toContain("www.google.com");
		} else {
			console.error("Something bad happened")
		}
	})
	test("should return object by url", async () => {
		const result = await mockScreener.get({ url: "www.google.com" })

		if (result) {
			const key = Object.keys(result)[0];
			expect(result![key]).toBe("www.google.com");
			expect(key).toBe("test");
		} else {
			console.error("Something bad happened")
		}
	})
})