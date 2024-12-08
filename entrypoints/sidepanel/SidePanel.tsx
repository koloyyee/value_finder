function SidePanel() {

	const [currUrl, setCurrUrl] = useState("")
	const [ticker, setTicker] = useState("")
	const [highlightedText, setHighlightedText] = useState("");

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

	return (

		<main>
			<h1>{ticker.toUpperCase()}</h1>
			<textarea value={`"${highlightedText}`}>
		
			</textarea>
		</main>
	)
}
export default SidePanel;