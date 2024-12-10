export default defineUnlistedScript(() => {});

/** Types  */
export const Collection = {
  screeners: "screeners" as const,
  bookmarks: "bookmarks" as const,
  notes: "notes" as const,
  mockScreeners: "mock_screeners" as const,
  mockBookmarks: "mock_bookmarks" as const,
  mockNotes: "mock_notes" as const,
} as const;

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
 * 		}
 * 	}
 * ]
 */
export interface Notes {
	[key:string ] : string 
}