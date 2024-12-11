// import { afterAll, beforeAll, describe, expect, test } from "vitest";
// import { BookmarksStorageImp } from "../storage";
// import { Collection } from "../types";



// 	const mock = new BookmarksStorageImp(chrome.storage.local, Collection.mockBookmarks)

// describe("Screener storage testing", () => {

// 	beforeAll(async () => {
// 		await mock.save("test", "www.google.com");
// 	})

// 	afterAll(() => {
// 		mock.clear()
// 	})
// 	test("should return obj by key", async () => {
// 		const result = await mock.get({ key: "test" });
// 		if (result) {
// 			expect(result!["test"]).toContain("www.google.com");
// 		} else {
// 			console.error("Something bad happened")
// 		}
// 	})
// 	test("should return object by url", async () => {
// 		const result = await mock.get({ url: "www.google.com" })

// 		if (result) {
// 			const key = Object.keys(result)[0];
// 			expect(result![key]).toBe("www.google.com");
// 			expect(key).toBe("test");
// 		} else {
// 			console.error("Something bad happened")
// 		}
// 	})
// })