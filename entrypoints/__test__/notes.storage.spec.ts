import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { NotesStorageImp } from "../storage";
import { Collection, Notes } from "../types";



	const mock = new NotesStorageImp(chrome.storage.local, Collection.mockNotes)

describe("Notes storage testing", () => {

	beforeAll(async () => {
		const testNote :Notes = {
			ticker: "pltr",
			source: "test.com",
			quote: "amazing quote",
			note: "can you tell this is a test?"
		}
		await mock.save("test", testNote);
	})

	test("should get all", async () => {
		const result = await mock.get();
		// console.log(result)

	})


	afterAll(() => {
		mock.clear()
	})
	test("should return obj by key", async () => {
		let results = await mock.get({key: "pltr"});
		if (results) {
			let result = results[0]
			expect(result['source']).toBe("test.com")
			expect(result['note']).toBe("can you tell this is a test?")

		} else {
			console.error("Something bad happened");
		}
	})
	test("should return object by url", async () => {
		const results = await mock.get({ value: { source: "test.com" } })
		if (results) {
			let result = results[0]
		console.log(result)
			expect(result['ticker']).toBe("pltr")

		} else {
			console.error("Something bad happened")
		}
	})
})