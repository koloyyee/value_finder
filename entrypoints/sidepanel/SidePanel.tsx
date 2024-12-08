import { ChangeEvent } from "react";

function SidePanel() {

	const [currUrl, setCurrUrl] = useState("")
	const [ticker, setTicker] = useState("")
	const [highlightedText, setHighlightedText] = useState("");
	const [note, setNote] = useState("")

	useEffect(() => {
		function getHighlighted() {
			chrome.runtime.onConnect.addListener(port => {
				if (port.name === "textHighlight") {
					port.onMessage.addListener(msg => {
						console.log("Side Panel getting port msg")
						console.log(msg.text)
						setHighlightedText(msg.text);
					})
				}
			})
		}
		getHighlighted();
	}, [])

	useEffect(() => {
		(async () => {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			if (!tab || !tab.url) {
				console.error("tab has something wrong")
				return
			}
			setCurrUrl(tab.url);

			const port = chrome.runtime.connect({ name: "ticker " })
			port.onMessage.addListener(msg => {
				setTicker(msg.ticker)
			})

		})()

	}, [])

	function handleTextarea(e: ChangeEvent<HTMLTextAreaElement>): void {
		const text = e.currentTarget.value;
		setNote(text)
	}

	function clearForm(): void {
		setHighlightedText("")
		setNote("")
	}
	function saveNote(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const highlightedText = String(formData.get("highlightedText"))
		const note = String(formData.get("note"))

		console.log({ highlightedText, note, currUrl, ticker })

	}

	return (

		<main>
			<h1>{ticker.toUpperCase()}</h1>
			<form onSubmit={(e) => saveNote(e)}>
			<input type="hidden" value={highlightedText} name="highlightedText" />
			<blockquote>
				{highlightedText}
			</blockquote>
			<textarea name="note" value={note} onChange={(e) => handleTextarea(e)}>
			</textarea>
			<button>save</button>
			<button type="reset" onClick={() => clearForm()}>clear</button>
			</form>
		</main>
	)
}
export default SidePanel;