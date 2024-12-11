// import { afterAll, beforeAll, describe, expect, test } from "vitest";
// import { NotesStorageImp } from "../storage";
// import { Collection } from "../types";



// 	const mock = new NotesStorageImp(chrome.storage.local, Collection.mockNotes)

// describe("Screener storage testing", () => {

// 	beforeAll(async () => {
// 		await mock.save("test", { url: "www.google.com" });
// 	})

// 	afterAll(() => {
// 		mock.clear()
// 	})
// 	test("should return obj by key", async () => {
// 		const result = await mock.get({ key: "test" });
// 		if (result) {
// 			expect(result["test"]).toContain("www.google.com");
// 		} else {
// 			console.error("Something bad happened")
// 		}
// 	})
// 	test("should return object by url", async () => {
// 		const result = await mock.get({ value: { url: "www.google.com" } })

// 		if (result) {
// 			const key = Object.keys(result)[0] as string;
// 			expect(result[key]).toBe("www.google.com");
// 			expect(key).toBe("test");
// 		} else {
// 			console.error("Something bad happened")
// 		}
// 	})
// })