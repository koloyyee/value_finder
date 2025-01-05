import { json2csv } from "json-2-csv";
import { ChangeEvent } from "react";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { NotesStorageImp } from "../storage";
import { Intent, Notes, SortValue } from "../types";
import { parseDate } from "../utils";

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
						setHighlightedText(msg.text);
						setCurrUrl(msg.url);
						setNoteId(msg.id);
					})

				}
				return () => {
					port.onDisconnect.addListener(() => {
						console.error("Port disconnected");
					});
				}
			})
			renderList();
		}
		getHighlighted();
	}, [])

	function sortList(event: ChangeEvent<HTMLSelectElement>) {
		const picked = event.currentTarget.value;

		switch (picked) {
			case SortValue.nameAsc: {
				const nameAZ = savedNotes?.slice().sort((note1, note2) => note1.title.localeCompare(note2.title));
				setSavedNotes(nameAZ);
				break;
			}
			case SortValue.nameDesc: {
				const nameZA = savedNotes?.slice().sort((note1, note2) => note2.title.localeCompare(note1.title));
				setSavedNotes(nameZA);
				break;
			}
			case SortValue.dateAsc: {
				const dateAZ = savedNotes?.slice().sort((note1, note2) => parseDate(note2.lastUpdated).getTime() - parseDate(note1.lastUpdated).getTime());
				setSavedNotes(dateAZ);
				break;
			}
			case SortValue.dateDesc: {
				const dateZA = savedNotes?.slice().sort((note1, note2) => parseDate(note1.lastUpdated).getTime() - parseDate(note2.lastUpdated).getTime());
				setSavedNotes(dateZA);
				break;
			}
			default:
				break
		}
	}

	async function renderList() {
		const list: Notes[] | undefined = (await noteStorage.get() as Notes[]) || [];
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
			note: note,
			lastUpdated: new Date().toLocaleString()
		}
		const intent = String(formData.get("intent"));
		switch (intent) {
			case Intent.create: {
				console.log(newNote)
				const { err } = await noteStorage.save(title, newNote);
				if (err) {
					console.error(err)
				}
			}
			case Intent.update: {
				const { err } = await noteStorage.update(id, newNote);
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
		setNoteTicker(note.ticker ?? "")
		setNoteTitle(note.title)
		toggleDrawer();
		renderList();

		setIntent(Intent.update)
	}

	function deleteSavedNote(note: Notes) {
		noteStorage.del(note);
		renderList();
	}
	async function downloadNotes() {
		const notes: object[] | undefined = await noteStorage.get();
		if (notes && notes.length > 0) {
			const converted = json2csv(notes)
			const file = new Blob([converted], { type: "text/csv" })
			const csvUrl = URL.createObjectURL(file);
			const link = document.createElement('a');
			link.href = csvUrl;
			link.download = `value-finder-note${(new Date()).toLocaleDateString()}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
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
					<small className="truncate">source: <a href={currUrl} target="_target"> {currUrl}</a> </small>
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

			<button type="button" onClick={toggleDrawer}>📁</button>
			<Drawer
				open={isOpen}
				onClose={toggleDrawer}
				direction='bottom'
				size={"95vh"}

			>
				<div className='dark:bg-zinc-800 dark:text-white p-3'>
					<button type="button" onClick={toggleDrawer}>x</button>
					<select onChange={(e) => sortList(e)}>
						<option value="nameAsc">Name A-Z</option>
						<option value="nameDesc">Name Z-A</option>
						<option value="dateAsc">From Newest</option>
						<option value="dateDesc">From Oldest</option>
					</select>
					<p>double click to confirm delete.</p>
					<section className="h-screen overflow-y-auto pb-32" >

						{savedNotes !== undefined && savedNotes!.length > 0 ?
							savedNotes.map((note: Notes) => (
								<form key={note.id + note.title} className="rounded border-2 border-emerald-600 m-2 p-2 ">
									<p>title: {note.title} </p>
									{note.ticker !== null ?
										< p > ticker: {note.ticker} </p>
										:
										<></>
									}
									<p className="truncate">note: {note.note} </p>
									<p className="text-[0.5rem]">since: {note.lastUpdated}</p>
									<button type="button" onClick={() => viewSavedNote(note)}>🔎</button>
									<button type="button" onClick={() => deleteSavedNote(note)}>🗑️</button>
								</form>
							))

							: <> No notes yet! :( </>}
					</section>
				</div>
			</Drawer>
			{/* hidden list of notes on the bottom or on the side */}
			download as csv
			<button type="button" disabled={savedNotes?.length === 0} className={savedNotes?.length === 0 ? "cursor-not-allowed hover:border-pink-700" : "cursor-pointer"} onClick={async () => await downloadNotes()}>⬇️</button>
		</main >
	)
}
export default SidePanel;