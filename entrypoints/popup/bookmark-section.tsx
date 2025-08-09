import { BookmarksStorageImp } from "../storage";
import { Bookmarks } from "../types";

/**
 * TODO: Missing delete bookmark!
 * 
 */

const BookmarksSection: React.FC = () => {
	const bookmarksStorage = new BookmarksStorageImp(chrome.storage.local);
	const [bookmarks, setBookmarks] = useState<Map<string, [{ [key: string]: string }]>>(new Map());
	const [errorMsg, setErrorMsg] = useState("");


	useEffect(() => {

		renderList();
	}, [])

	const showErrorMsg = (err: string) => {
		setErrorMsg(err);
		setTimeout(() => {
			setErrorMsg("")
		}, 1000)
	}

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
				showErrorMsg(err);
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

	return (
		<div className="w-max p-1 border-2 border-emerald-600 rounded">
			
				<h3 className="text-lg font-bold" >Bookmarks</h3>
			{/* <button type="button" onClick={() => window.prompt()}>open</button> */}
			<p id="errorMsg" className=" text-pink-500" aria-label='error-message'>{errorMsg}</p>
			<form onSubmit={saveBookmark} className="flex-col gap-1 p-1">
				<section className="flex gap-2" >
					<input name="ticker" placeholder="Ticker" className="rounded w-1/3" required />
					<input name="bookmarkName" placeholder="name e.g.: 2023-10q" className="rounded w-max" required />
				</section>
				<section className="flex gap-1">
					<button type="submit"> bookmark </button>
				</section>
			</form>
			<hr className="my-3 bg-emerald-600" />
			{bookmarks.size > 0 ?
				<ul className="grid grid-cols-2 max-h-96 overflow-y-auto px-2">
					{Array.from(bookmarks.entries()).map(([ticker, bookmarkList], index) => (
						<li key={ticker + index}>
							<h4 className="font-bold" >{ticker}</h4>
							<ul>
								{bookmarkList.map((bookmark, i) => (
									<li key={i}>
										{Object.keys(bookmark).map((name, i) => (
											<form className="flex justify-between px-[0.1rem]" onSubmit={(e) => removeBookmark(e)} key={name + i}>
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

export default BookmarksSection;