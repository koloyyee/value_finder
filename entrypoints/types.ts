import { StorageItemKey } from "@wxt-dev/storage";

export default defineUnlistedScript(() => { });

/** Types  */
export const Collection = {
	screeners: "screeners" as const,
	bookmarks: "bookmarks" as const,
	notes: "notes" as const,
	mockScreeners: "mockScreeners" as const,
	mockBookmarks: "mockBookmarks" as const,
	mockNotes: "mockNotes" as const,
} as const;

export const StorageLocation = (location: "local:" | "session:" | "sync:" | "managed:" = "local:", collectionName: keyof typeof Collection): StorageItemKey => {
	switch (collectionName) {
		case Collection.screeners:
		case Collection.bookmarks:
		case Collection.notes:
		case "mockScreeners":
		case "mockBookmarks":
		case "mockNotes":
			return location + collectionName as StorageItemKey;
	}
};

export const Intent = {
	create: "create" as const,
	update: "update" as const,
	del: "delete" as const,
} as const

export const SortValue = {
	nameAsc: "nameAsc" as const,
	nameDesc: "nameDesc" as const,
	dateAsc: "dateAsc" as const,
	dateDesc: "dateDesc" as const
}


/**
 * {
 *	cik_str: 320193, 
 *  ticker: 'AAPL', 
 *  title: 'Apple Inc.'
 * 	quarterAnnual: "https://www.sec.gov/edgar/search/#/category=custom&entityName=AAPL&forms=10-K%252C10-Q%252C20-F%252C40-F",
 * 	insider: "https://www.sec.gov/edgar/search/#/category=custom&entityName=AAPL&forms=144"
 * }
 */
export type Comp = {
	cik_str: number,
	ticker: string,
	title: string,
}
export interface CompObj extends Comp {
	quarterAnnual?: string,
	insider?: string,
}


/**
 * bookmarks : {
 * 	aapl : [
 * 		{ "bookmarkName" : "link1" },
 * 		{ "bookmarkName2" : "link2" },
 * 	],
 * 	pltr : [
 * 		{ "bookmarkName" : "link1" },
 * 		{ "bookmarkName2" : "link2" },
 * 	]
 * }
 */
export type Bookmarks = {
	[ticker: string]: BookmarkKV;
}

export type BookmarkKV = {
	[bookmarkName: string]: string;
}

/**
 * screeners : [
 * 	uniqueScreenerName: uniqueScreenerUrl,
 * 	uniqueScreenerName2: uniqueScreenerUrl2,
 * ]
 */
export type Screeners = {
	[screener: string]: string;
}


/**
 * notes : [
 * 	{ 
 * 			title: title,
 * 			source: sourceUrl,
 * 			ticker: ticker (optional),
 * 			quote: highlightedText,
 * 			note: notesUserTyped		
 * 			lastUpdated: date
 * 		}
 * 	}
 * ]
 */
// export interface Notes {
// 	[key:string ] : string | Date,
// 	lastUpdated : Date 
// }

export interface Notes {
	id: string
	title: string
	source: string
	ticker?: string
	quote: string
	note: string
	lastUpdated: string
}