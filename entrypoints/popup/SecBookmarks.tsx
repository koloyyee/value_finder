import { Bookmarks, BookmarksStorageImp } from "./utils";

const SecBookmarks: React.FC = () => {
	const bookmarksStorage = new BookmarksStorageImp(chrome.storage.local);
	const [bookmarks, setBookmarks] = useState<Map<string, [{ [key: string]: string }]>>(new Map());
	const [errorMsg, setErrorMsg] = useState("");


	useEffect(() => {

		renderList();
	}, [])

	async function renderList() {
		const collection = await bookmarksStorage.get() as Bookmarks
		const bookmarkMap = new Map();
		if (collection) {
			Object.entries(collection).forEach(([ticker, bookmark]) => {
				bookmarkMap.set(ticker, bookmark);
			})
		}
		setBookmarks(bookmarkMap)
	}

	async function saveBookmark(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const ticker = formData.get("ticker")
		const bookmarkName = formData.get("bookmarkName")

		const [tab] = await chrome.tabs.query({ active: true });

		if (tab.url) {
			const { err } = await bookmarksStorage.save(String(ticker), { [String(bookmarkName)]: tab.url })
			if (err === null) {
				form.reset();
			} else {
				setErrorMsg(err);
			}
		}
		renderList()
	}
	return (
		<div className="m-2 p-3 border-2 border-emerald-500 rounded ">
			{/* <button type="button" onClick={() => window.prompt()}>open</button> */}
			<p className="text-red-500">{errorMsg}</p>
			<form onSubmit={saveBookmark} className="flex gap-3">
				<input name="ticker" placeholder="Ticker" className="py-2 rounded w-1/5" required />
				<input name="bookmarkName" placeholder="Bookmark name e.g.: 2023-10q" className="py-2 rounded" required />
				<button> bookmark </button>
			</form>
			{bookmarks.size > 0 ?
				<ul className="h-36 overflow-y-auto grid grid-cols-2">
					{Array.from(bookmarks.entries()).map(([ticker, bookmarkList], index) => (
						<li key={ticker + index}>
							<h4 className="font-bold" >{ticker}</h4>
							<ul>
								{bookmarkList.map((bookmark, i) => (
									<li key={i}>
										{Object.keys(bookmark).map((name, i) => (
											<a href={bookmark[name]} key={i} target="_blank"> {name} </a>
										))}
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
				:
				<>
					<p> No Bookmarks yet :( </p>
				</>
			}

		</div>);
}

export default SecBookmarks;