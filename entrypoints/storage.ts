import { BookmarkKV, Bookmarks, Collection, Screeners } from "./types";

export default defineUnlistedScript(() => { });

/** Logics  **/
export const BASE = "https://finviz.com/screener.ashx";

interface Storage {
	save(
		key: string,
		link: { [key: string]: string } | string,
	): Promise<{ err: string } | { err: null }>;
	get(params: {
		key?: string;
		value?: { [ticker: string]: string } | string;
	}): Promise<Screeners | Bookmarks | undefined>;
	del(key: string): Promise<{ err: null | string }>;
	clear(): Promise<void>;
}

export class BookmarksStorageImp implements Storage {
	private collectionName: string;
	private storage: chrome.storage.StorageArea;

	constructor(
		storage: chrome.storage.StorageArea,
		collectionName = "" 
	) {
		this.storage = storage;
		this.collectionName = collectionName.trim() === "" ?	this.collectionName = Collection.bookmarks: collectionName
	}

	async save(
		key: string,
		bookmarkKV: { [name: string]: string },
	): Promise<{ err: string } | { err: null }> {
		const byTicker = await this.get({ key: key });
		const byLink = await this.get({ bookmarkKV: bookmarkKV });
		console.log(byTicker, byLink);
		console.log(byLink === undefined);

		// if (byTicker !== undefined ) {
		// 	return { err: "Something is wrong with the Ticker." }
		// }

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

	clear(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}

export class ScreenerStorage implements Storage {
	private collectionName: string;
	private storage: chrome.storage.StorageArea;

	constructor(
		storage: chrome.storage.StorageArea,
		collectionName = "",
	) {
		this.storage = storage;
		this.collectionName = collectionName.trim() === "" ?	this.collectionName = Collection.screeners : collectionName
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
