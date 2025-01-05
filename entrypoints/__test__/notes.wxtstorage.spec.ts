import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { Collection, Notes, StorageLocation } from "../types";
import { NotesStorageImp as WxtNotesStorage } from "../wxtstorage";

const mock = new WxtNotesStorage(StorageLocation("local:", Collection.mockNotes))

describe("Chrome Notes storage testing", () => {

	beforeAll(async () => {
		const testNote1: Notes = {
			id: "test_test",
			title: "test title",
			ticker: "pltr",
			source: "test.com",
			quote: "amazing quote",
			note: "can you tell this is a test?",
			lastUpdated: new Date().toLocaleTimeString()
		}
		const testNote2: Notes = {
			id: "test_test2",
			title: "test title 2",
			ticker: "aapl",
			source: "example.com",
			quote: "another amazing quote",
			note: "this is another test",
			lastUpdated: new Date().toLocaleTimeString()
		}

		const testNote3: Notes = {
			id: "test_test3",
			title: "test title 3",
			ticker: "msft",
			source: "sample.com",
			quote: "yet another amazing quote",
			note: "this is yet another test",
			lastUpdated: new Date().toLocaleTimeString()
		}

		await mock.save("test2", testNote2);
		await mock.save("test3", testNote3);
		await mock.save("test", testNote1);
	})

	afterAll(() => {
		mock.clear()
	})

	test("should get ", async () => {
		const result = await mock.get();

	})


	test("should return obj by key", async () => {
		let results = await mock.get({ key: "ticker", value: "pltr" });
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