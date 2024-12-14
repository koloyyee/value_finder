import { BookmarksStorageImp } from "../storage";
import { Bookmarks } from "../types";

/**
 * TODO: Missing delete bookmark!
 * 
 */

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

	async function removeBookmark(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const url = String(formData.get("url"))
		const ticker = String(formData.get("ticker"))
		const bookmarkName = String(formData.get("bookmarkName"))

		if (!url && !ticker && !bookmarkName) return;
		const { err } = await bookmarksStorage.del(ticker, bookmarkName, url)
		if (err !== null) {
			setErrorMsg(err);
			return;
		}
		renderList();
	}

	function openSidePanel() {
		console.log("sending action")
		chrome.runtime.sendMessage({ action: "open_side_panel", })
		window.close()
	}

	return (
		<div className="m-2 p-3 border-2 border-emerald-600 rounded ">
			{/* <button type="button" onClick={() => window.prompt()}>open</button> */}
			<p className="text-red-500">{errorMsg}</p>
			<form onSubmit={saveBookmark} className="flex gap-3">
				<input name="ticker" placeholder="Ticker" className="py-2 rounded w-1/5" required />
				<input name="bookmarkName" placeholder="Bookmark name e.g.: 2023-10q" className="py-2 rounded" required />
				<button type="submit"> bookmark </button>
				<button type="button" onClick={() => openSidePanel()}> Open Note </button>

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
											<form className="flex" onSubmit={(e) => removeBookmark(e)} key={name + i}>
												<a href={bookmark[name]} key={i} target="_blank"> {name} </a>
												<input name="url" type="hidden" value={bookmark[name]} />
												<input name="ticker" type="hidden" value={ticker} />
												<input name="bookmarkName" type="hidden" value={name} />
												<button> ❌</button>
											</form>
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