export default defineUnlistedScript(() => {
	
})

/** Types  */
export const Collection = {
	screeners: "screeners" as const,
	bookmarks: "bookmarks" as const
} as const

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
export interface Bookmarks {
	[ticker: string]: BookmarkKV
}

export interface BookmarkKV {
	[bookmarkName: string]: string
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