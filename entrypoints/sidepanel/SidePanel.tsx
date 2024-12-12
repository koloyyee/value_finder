import { ChangeEvent } from "react";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { NotesStorageImp } from "../storage";
import { Intent, Notes } from "../types";

function SidePanel() {
	const noteStorage = new NotesStorageImp(chrome.storage.local);
	const [intent, setIntent] = useState<string>(Intent.create)


	// Note data send from message passing port.
	const [currUrl, setCurrUrl] = useState("")
	const [highlightedText, setHighlightedText] = useState("");

	// Note data either from old note or start with empty string. 
	const [noteTicker, setNoteTicker] = useState("")
	const [note, setNote] = useState("")
	const [noteId, setNoteId] = useState("");
	const [noteTitle, setNoteTitle] = useState("");

	const [savedNotes, setSavedNotes] = useState<Notes[] | undefined>([]);

	useEffect(() => {
		function getHighlighted() {
			chrome.runtime.onConnect.addListener(port => {
				if (port.name === "textHighlight") {
					port.onMessage.addListener(msg => {
						// console.log("Side Panel getting port msg")
						console.log(msg)

						setHighlightedText(msg.text);
						setCurrUrl(msg.url);
						setNoteId(msg.id);
					})
				}
			})
			renderList();
			console.log(savedNotes)
		}
		getHighlighted();
	}, [])

	async function renderList() {
		const list = await noteStorage.get();
		setSavedNotes(list)

	}

	function handleTextarea(e: ChangeEvent<HTMLTextAreaElement>): void {
		const text = e.currentTarget.value;
		setNote(text)
	}

	function clearForm(): void {
		setCurrUrl("")
		setNote("")
		setHighlightedText("")
		setNoteId("")
		setNoteTicker("")
		setNoteTitle("")
		setIntent(Intent.create);
	}

	async function saveNote(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const highlightedText = String(formData.get("highlightedText"))
		const title = String(formData.get("title"))
		const note = String(formData.get("note"))
		const ticker = formData.get("ticker") !== null ? String(formData.get("ticker")) : ""
		const id = String(formData.get("id")) === "" ? String(Date.now()) : String(formData.get("id"))

		const newNote: Notes = {
			id: id,
			title: title,
			source: currUrl,
			ticker: ticker,
			quote: highlightedText,
			note: note
		}
		const intent = String(formData.get("intent"));
		switch (intent) {
			case Intent.create: {
				const { err } = await noteStorage.save(title, newNote);
				if (err) {
					console.error(err)
				}
			}
			case Intent.update: {
				const {err} = await noteStorage.update(id, newNote);
			}
		}

		form.reset();
		clearForm();
		renderList();
		// render the notes list at the back.
	}
	const [isOpen, setIsOpen] = useState(false)
	const toggleDrawer = () => {
		setIsOpen((prevState) => !prevState)
	}

	function viewSavedNote(note: Notes) {
		// populate back all the items.
		setCurrUrl(note.source)
		setHighlightedText(note.quote)
		setNote(note.note)
		setNoteId(note.id)
		setNoteTicker(note.ticker)
		setNoteTitle(note.title)
		toggleDrawer();
		renderList();

		setIntent(Intent.update)
	}

	function deleteSavedNote(note: Notes) {
		noteStorage.del(note);
		renderList();
	}
	function downloadNote(note: Notes) {
		// download from
		window.prompt()
	}
	return (

		<main className="border-2 border-emerald-600 min-h-[90vh] m-1 rounded">
			<form onSubmit={(e) => saveNote(e)} className="m-3 flex flex-col gap-3">
				<input type="hidden" name="intent" value={intent} />
				<input type="hidden" name="id" value={noteId} />
				<label htmlFor="title">Note Title:</label>
				<input name="title" type="text" className="rounded" defaultValue={noteTitle} required />
				<label htmlFor="ticker">Ticker: <small>(optional)</small></label>
				<input name="ticker" type="text" className="rounded" defaultValue={noteTicker} />
				<label htmlFor="highlightedText">Quote: <small>(highlighted text on the page)</small></label>
				<input type="hidden" aria-label="highlighted quotes" value={highlightedText} name="highlightedText" id="highlightedText" />
				<blockquote className="min-h-32 border-2 border-emerald-600 rounded max-h-60 overflow-y-auto">
					{highlightedText}
				</blockquote>
				{/* <small> Remove Highlight: de-select text, right-click the highlighted text</small> */}
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

			<button type="button" onClick={toggleDrawer}>Show</button>
			<Drawer
				open={isOpen}
				onClose={toggleDrawer}
				direction='bottom'
				className='bla bla bla'
				size={"95vh"}
			>
				<button type="button" onClick={toggleDrawer}>x</button>
				{savedNotes !== undefined && savedNotes!.length > 0 ?
					savedNotes.map((note: Notes) => (
						<form className="rounded border-2 border-emerald-600 m-2 p-2">
							<p>title: {note.title} </p>
							{note.ticker !== null ?
								< p > ticker: {note.ticker} </p>
								:
								<></>
							}
							<p className="truncate">note: {note.note} </p>
							<button type="button" onClick={() => viewSavedNote(note)}>🔎</button>
							<button type="button" onClick={() => deleteSavedNote(note)}>🗑️</button>
							<button type="button" onClick={() => downloadNote(note)}>📑</button>
						</form>
					))

					: <> No notes yet! :( </>}
			</Drawer>
			{/* hidden list of notes on the bottom or on the side */}

		</main >
	)
}
export default SidePanel;