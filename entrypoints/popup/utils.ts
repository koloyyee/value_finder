/** Types  */
export const Collection = {
	screeners: "screeners" as const,
	bookmarks: "bookmarks" as const
} as const

/**
 * bookmarks : [
 * 	aapl : [
 * 		"link1",
 * 		"link2"
 * 	],
 * 	pltr : [
 * 		"link1",
 * 		"link2"
 * 	]
 * ]
 */
export interface Bookmarks {
	[ticker: string]: [string]
}

/**
 * watchlists : [
 * 	uniqueScreenerName: uniqueScreenerUrl,
 * 	uniqueScreenerName2: uniqueScreenerUrl2,
 * ]
 */
export interface Screeners {
	[screener: string]: string
}
/** Logics  **/
export const BASE = "https://finviz.com/screener.ashx";

interface Storage {
	save(key: string, link: string): Promise<{ err: string } | { err: null }>;
	get(params: { key?: string, url?: string }): Promise<any>;
	del(key: string): Promise<void>;
	clear(): Promise<void>;
}
export class StorageImp implements Storage {
	private collectionName: string
	constructor(collectionName: "screeners" | "bookmarks") {
		this.collectionName = collectionName;
	}
	/**
	 * 
	 * @param key screener name or ticker for bookmarks
	 * @param link 
	 * @returns 
	 */
	async save(key: string, link: string) {
		const url = await this.get({ key: key });
		const scr = await this.get({ url: link });

		if (link === BASE) {
			return { err: "Your screener filter is empty." }
		}
		if (url !== undefined) {
			return { err: "Screener Name existed already." }
		}

		if (scr !== undefined) {
			return { err: "Screener Filter existed already." }
		}

		const collection = await chrome.storage.local.get(this.collectionName);
		const targetCollection = collection[this.collectionName] || {};
		await chrome.storage.local.set(
			{ // TODO: this might a bug for Bookmarks
				[this.collectionName]: {
					...targetCollection, [key]: link
				}
			})
		return { err: null }
	}
	/**
	 * When no argument, it will return full list of screeners.
	 * input screener to check if screener exists and return url,
	 * input url to check if url exists and return screener,
	 *  
	 */
	async get({ key = "", url = "" } = {}): Promise<Screeners | Bookmarks | string | undefined> {
		const collection = await chrome.storage.local.get(this.collectionName)
		if (key.trim() === "" && url.trim() === "") {
			return collection[this.collectionName];
		} else if (key.trim() === "") {
			return Object.keys(collection[this.collectionName])
				.filter(key => collection[this.collectionName][key] === url)[0]
		} else if (url.trim() === "") { // return the screener url
			try {
				return collection[this.collectionName][key];
			} catch (e) {
				return undefined;
			}
		}
	}
	async del(key: string) {
		const collection = await chrome.storage.local.get(this.collectionName);
		const targetCollection = collection[this.collectionName] || {};

		delete targetCollection[key];

		await chrome.storage.local.set({
			[this.collectionName]: targetCollection
		});
	}
	async clear() {
		await chrome.storage.local.set({
			[this.collectionName]: {}
		});
	}
}