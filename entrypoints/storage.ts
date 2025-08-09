import { BookmarkKV, Bookmarks, Collection, Notes, Screeners } from "./types";
// import { storage as wxtStorage } from '@wxt-dev/storage';

/**
 * To be replaced by WXT storage.
 */
export default defineUnlistedScript(() => { });

export const BASE = "https://finviz.com/screener.ashx";

interface Storage {
	save(
		key: string,
		link: { [key: string]: string } | string | Notes | Screeners | Bookmarks,
	): Promise<{ err: string } | { err: null }>;
	get(params: {
		key?: string;
		value?: { [ticker: string]: string } | string;
	}): Promise<Screeners | Bookmarks | undefined | Notes[]>;
	del(key: string | Notes): Promise<{ err: null | string }>;
	clear(): Promise<void>;
}

export class NotesStorageImp implements Storage {

	private storage: chrome.storage.StorageArea
	private collectionName: string;

	constructor(storage: chrome.storage.StorageArea, collectionName = "") {
		this.storage = storage;
		this.collectionName = collectionName.trim() === "" ? Collection.notes : collectionName;
	}

	/**
	 * 
	 * @param key ticker or name of the note
	 * @param link 
	 */
	async save(title: string, newNote: Notes): Promise<{ err: string; } | { err: null; }> {
		// allow duplicate
		const collection = await this.storage.get(this.collectionName);
		const notes = collection[this.collectionName] || []
		notes.push(newNote)
		const notesColl = {
			[this.collectionName]: notes
		}
		await this.storage.set(notesColl)

		return { err: null }
	}

	/**
	 * A general way to query  
	 * @param param0 
	 * @returns 
	 */
	async get({ key = "", value = "" }: {
		key?: string; value?: { [ticker: string]: string; } | string;
	} = {}): Promise<Notes[] | undefined> {

		const collection = await this.storage.get(this.collectionName);
		let notes: [Notes] = collection[this.collectionName] || [];

		// a note 
		if (value instanceof Object) {
			// console.log(value)
			// const targetKey = Object.keys(value).
			const index = notes.findIndex(n =>
				Object.keys(n).some(k => n[k] === value[k])
			)
			if( index === -1) {
				return [];
			}
			return [notes[index]]

		} else {

			if (key.trim() !== "" && value.trim() !== "") {
				return notes.filter(note => Object.keys(note).find(() => note[key] === value))
			}
			if (key.trim() === "" && value.trim() !== "") {
				return notes.filter(note => Object.keys(note).find((noteKey) => note[noteKey] === value))
			}
			if (key.trim() !== "" && value.trim() === "") {
				return notes;
			}
		}

		return notes;
	}

	async update(id: string, newNote: Notes): Promise<{ err: null | string; }> {
		const collection = await this.storage.get(this.collectionName);
		const notes : [Notes] = collection[this.collectionName]

		const index = notes.findIndex((n) => n.id === id)
		if( index === -1) {
			return {err: `id: ${id} doesn't exist.`}
		}
		notes[index] = newNote;

		await this.storage.set({
			[this.collectionName] : notes
		})
		
		return { err: null }
	}
	async del(note: Notes): Promise<{ err: null | string; }> {
		const collection = await this.storage.get(this.collectionName)
		const notes = collection[this.collectionName] || []
		const targetIndex = notes.findIndex((n: Notes) => {
			return Object.keys(n).every(key => note[key] === n[key])
		})
		if (targetIndex === - 1) {
			return { err: "no such note." }
		}
		notes.splice(targetIndex, 1);
		await this.storage.set({
			[this.collectionName]: notes
		})
		return { err: null }
	}
	async clear(): Promise<void> {
		await this.storage.set({
			[this.collectionName] : []
		})
	}

	
}

export class BookmarksStorageImp implements Storage {
	private collectionName: string;
	private storage: chrome.storage.StorageArea;

	constructor(
		storage: chrome.storage.StorageArea,
		collectionName = ""
	) {
		this.storage = storage;
		this.collectionName = collectionName.trim() === "" ? this.collectionName = Collection.bookmarks : collectionName
	}

	/**
	 * 
	 * @param key ticker name
	 * @param bookmarkKV {bookmarkName: bookmarkUrl}
	 * @returns 
	 */
	async save(
		key: string,
		bookmarkKV: { [name: string]: string },
	): Promise<{ err: string } | { err: null }> {
		const byTicker = await this.get({ key: key });
		const byLink = await this.get({ bookmarkKV: bookmarkKV });

		if (byLink !== undefined && Object.keys(byLink).length !== 0) {
			return { err: "Bookmark Link existed already." };
		}

		const collection = await this.storage.get(this.collectionName);
		const bookmarksColl = collection[this.collectionName] || {};

		let collNewVal = {};
		if (Object.keys(byTicker ?? {}).length === 0) {
			console.log("new ticker ");
			collNewVal = {
				[this.collectionName]: {
					...bookmarksColl,
					[key]: [bookmarkKV],
				},
			};
		} else {
			collNewVal = {
				[this.collectionName]: {
					...bookmarksColl,
					[key]: [...bookmarksColl[key], bookmarkKV],
				},
			};
			console.log(collNewVal);
		}

		await this.storage.set(collNewVal);
		return { err: null };
	}
	/**
	 *
	 * @param param0 key is ticker
	 * @returns
	 */
	async get({ key = "", bookmarkKV = {} as BookmarkKV } = {}): Promise<
		Bookmarks | {} | undefined
	> {
		// get all.
		const collection = await this.storage.get(this.collectionName);
		const bookmarksColl = collection[this.collectionName] || {};

		if (key.trim() === "" && Object.keys(bookmarkKV).length === 0) {
			return bookmarksColl;
		} else if (key.trim() === "" && Object.keys(bookmarkKV).length > 0) {
			// check if ticker exists
			// check bookmarkKV name first then check the value
			const bookmarkKey = Object.keys(bookmarkKV)[0];
			const bookmarkValue = bookmarkKV[bookmarkKey];

			const exists = Object.values(bookmarksColl)
				.flat()
				.some((bookmark) => {
					const keys = Object.keys(bookmark as BookmarkKV);
					return (
						keys.includes(bookmarkKey) &&
						(bookmark as BookmarkKV)[bookmarkKey] === bookmarkValue
					);
				});
			return exists
				? {
					...bookmarksColl,
					[key]: { [bookmarkKey]: bookmarkValue },
				}
				: undefined;
		} else if (Object.keys(bookmarkKV).length === 0) {
			return Object.keys(bookmarksColl)
				.filter((ticker) => ticker === key)
				.reduce(
					(acc, curr) => Object.assign(acc, { [key]: bookmarksColl[key] }),
					{},
				);
		}
	}

	/**
	 * remove the by ticker, bookmarkName, url
	 * the urls will also be removed.
	 * @param key
	 */
	async del(ticker: string, bookmarkName = "", url = "") {
		try {
			const collection = await this.storage.get();
			const bookmarkColl = collection[this.collectionName];
			const targetTicker = bookmarkColl[ticker];

			if (targetTicker) {
				const index = targetTicker.findIndex((bookmarkKV: BookmarkKV) => {
					return (
						Object.keys(bookmarkKV)[0] === bookmarkName &&
						bookmarkKV[bookmarkName] === url
					);
				});
				if (index !== -1) {
					bookmarkColl[ticker].splice(index, 1);
					if (bookmarkColl[ticker].length === 0) {
						delete bookmarkColl[ticker];
					}
					await this.storage.set({
						[this.collectionName]: bookmarkColl,
					});
				}
			}
			return { err: null };
		} catch (e) {
			console.error(e);
			return { err: "Unable to delete" };
		}
	}

	async clear(): Promise<void> {
		await this.storage.set({
			[this.collectionName] : {}
		})
	}
}

export class ScreenerStorageImpl implements Storage {
	private collectionName: string;
	private storage: chrome.storage.StorageArea;

	constructor(
		storage: chrome.storage.StorageArea,
		collectionName = "",
	) {
		this.storage = storage;
		this.collectionName = collectionName.trim() === "" ? this.collectionName = Collection.screeners : collectionName
	}

	/**
	 *
	 * @param key screener name or ticker for bookmarks
	 * @param link
	 * @returns
	 */
	async save(
		key: string,
		link: string,
	): Promise<{ err: string } | { err: null }> {
		const byScreenerName = await this.get({ key: key });
		const byLink = await this.get({ url: link });

		if (link === BASE) {
			return { err: "Your screener filter is empty." };
		}
		if (
			byScreenerName !== undefined &&
			Object.keys(byScreenerName).length !== 0
		) {
			return { err: "Screener Name existed already." };
		}

		if (byLink !== undefined && Object.keys(byLink).length !== 0) {
			return { err: "Screener Filter existed already." };
		}

		const collection = await this.storage.get(this.collectionName);
		const targetCollection = collection[this.collectionName] || {};
		await this.storage.set({
			[this.collectionName]: {
				...targetCollection,
				[key]: link,
			},
		});
		return { err: null };
	}
	/**
	 * When no argument, it will return full list of screeners.
	 * input screener to check if screener exists and return url,
	 * input url to check if url exists and return screener,
	 *
	 */
	async get({ key = "", url = "" } = {}): Promise<Screeners | undefined> {
		const collection = await this.storage.get(this.collectionName);
		const screenerColl = collection[this.collectionName] || {};

		if (key.trim() === "" && url.trim() === "") {
			return screenerColl;
		} else if (key.trim() === "") {
			return Object.keys(screenerColl)
				.filter((k) => screenerColl[k] === url)
				.reduce((acc, curr) => Object.assign(acc, { [curr]: url }), {});
		} else if (url.trim() === "") {
			// return the screener url
			return Object.keys(screenerColl)
				.filter((k) => k.toLowerCase() === key.toLowerCase())
				.reduce(
					(acc, curr) => Object.assign(acc, { [curr]: screenerColl[key] }),
					{},
				);
		}
	}
	async del(key: string) {
		const collection = await this.storage.get(this.collectionName);
		const targetCollection = collection[this.collectionName] || {};
		try {
			delete targetCollection[key];
			await this.storage.set({
				[this.collectionName]: targetCollection,
			});
			return { err: null };
		} catch (e) {
			console.error(e);
			return { err: "Unable to delete" };
		}
	}
	async clear() {
		await this.storage.set({
			[this.collectionName]: {},
		});
	}
}
