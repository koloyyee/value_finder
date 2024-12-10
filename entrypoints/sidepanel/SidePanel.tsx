import { ChangeEvent } from "react";
import { NotesStorageImp } from "../storage";
import { Notes } from "../types";

function SidePanel() {
	const noteStorage = new NotesStorageImp(chrome.storage.local);
	const [currUrl, setCurrUrl] = useState("")
	const [ticker, setTicker] = useState("")
	const [highlightedText, setHighlightedText] = useState("");
	const [note, setNote] = useState("")

	useEffect(() => {
		function getHighlighted() {
			chrome.runtime.onConnect.addListener(port => {
				if (port.name === "textHighlight") {
					port.onMessage.addListener(msg => {
						// console.log("Side Panel getting port msg")
						console.log(msg)

						setHighlightedText(msg.text);
						setCurrUrl(msg.url);
					})
				}
			})
		}
		getHighlighted();
	}, [])

	// useEffect(() => {
	// 	(async () => {
	// 		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	// 		if (!tab || !tab.url) {
	// 			console.error("tab has something wrong")
	// 			return
	// 		}
	// 		setCurrUrl(tab.url);

	// 		const port = chrome.runtime.connect({ name: "comp" })
	// 		port.onMessage.addListener(msg => {
	// 			setTicker(msg.ticker)
	// 		})

	// 	})()

	// }, [])

	function handleTextarea(e: ChangeEvent<HTMLTextAreaElement>): void {
		const text = e.currentTarget.value;
		setNote(text)
	}

	function clearForm(): void {
		setHighlightedText("")
		setNote("")
	}
	async function saveNote(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const id = String(Date.now());
		const highlightedText = String(formData.get("highlightedText"))
		const title = String(formData.get("title"))
		const note = String(formData.get("note"))
		const ticker = formData.get("ticker") !== null ? String(formData.get("ticker")) : ""

		const newNote: Notes = {
			id: id,
			title: title,
			source: currUrl,
			ticker: ticker,
			quote: highlightedText,
			note: note
		}
		const { err } = await noteStorage.save(title, newNote);
		if (err) {
			console.error(err)
		}

		form.reset();
		setCurrUrl("")
		setNote("")
		setHighlightedText("")
		// render the notes list at the back.
	}

	return (

		<main className="border-2 border-emerald-600 min-h-[90vh] m-1 rounded">
			<form onSubmit={(e) => saveNote(e)} className="m-3 flex flex-col gap-3">
				<label htmlFor="title">Note Title:</label>
				<input name="title" type="text" className="rounded" required />
				<label htmlFor="ticker">Ticker: <small>(optional)</small></label>
				<input name="ticker" type="text" className="rounded" />
				<label htmlFor="highlightedText">Quote: <small>(highlighted text on the page)</small></label>
				<input type="hidden" aria-label="highlighted quotes" value={highlightedText} name="highlightedText" id="highlightedText" />
				<blockquote className="min-h-32 border-2 border-emerald-600 rounded max-h-60 overflow-y-auto">
					{highlightedText}
				</blockquote>
				{currUrl !== "" ? (
					<small className="truncate">source: {currUrl}</small>
				) : <></>}
				<label htmlFor="note">Notes:</label>
				<textarea className="min-h-32 rounded"
					required
					id="note"
					aria-label="user's note" name="note" value={note} onChange={(e) => handleTextarea(e)}>
				</textarea>
				<div className="self-center">
					<button>save</button>
					<button type="reset" onClick={() => clearForm()}>clear</button>
				</div>
			</form>
			{/* hidden list of notes on the bottom or on the side */}
		</main>
	)
}
export default SidePanel;