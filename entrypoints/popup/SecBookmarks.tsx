import { Bookmarks, Collection, StorageImp } from "./utils";

const SecBookmarks: React.FC = () => {
	const bookmarksStorage = new StorageImp(Collection.bookmarks);
	const [bookmarks, setBookmarks] = useState({});

	useEffect(() => {

	}, [])

	async function renderList() {
		setBookmarks(await bookmarksStorage.get() as Bookmarks)
	}
	async function saveBookmark(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const ticker = formData.get("ticker")
		console.log( ticker )

		const [tab] = await chrome.tabs.query({active : true});
	
		if(tab.url) {
			await bookmarksStorage.save(String(ticker), tab.url )
		}
	}
	return (
		<>
			<form onSubmit={saveBookmark}>
				<input name="ticker" placeholder="Ticker" className="py-2 rounded" />
				<button> bookmark </button>
			</form>
			{Object.keys(bookmarks).length > 0 ?
				<></>
				:
				<>
					<p> No Bookmarks yet :( </p>
				</>
			}

		</>);
}

export default SecBookmarks;