import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { BookmarksStorageImp } from "../storage";
import { Collection } from "../types";



	const mock = new BookmarksStorageImp(chrome.storage.local, Collection.mockBookmarks)

describe("Screener storage testing", () => {

	beforeAll(async () => {
		await mock.save("aapl", { testBookKey : "www.bookmarkUrl.com"});
	})

	afterAll(() => {
		mock.clear()
	})
	test("should return obj by key", async () => {
		const result = await mock.get({ key: "aapl" });
		if (result) {
			const resultKey = Object.keys(result)[0]
			expect(resultKey).toBe("aapl")

			const resultValues = Object.values(result)[0]
			expect(resultValues instanceof Array).toBe(true)

			const target = resultValues[0]
			const targetKey = Object.keys(target)[0];
			const targetValue = Object.values(target)[0];

			expect(targetKey).toBe("testBookKey")
			expect(targetValue).toBe("www.bookmarkUrl.com")

		} else {
			console.error("Something bad happened")
		}
	})
})