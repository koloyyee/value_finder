function SidePanel () {

	const [currUrl, setCurrUrl] = useState("")
	const [ticker, setTicker] = useState("")
	
	useEffect(() => {
		(async() => {
			const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
			if(!tab || !tab.url) {
				console.error("tab has something wrong")
				return
			}
			setCurrUrl(tab.url);

			const port = chrome.runtime.connect({ name : "ticker "})
			port.onMessage.addListener( msg => {
				console.log(msg)
				setTicker(msg.ticker)
			})

		})()

	}, [])

	return(
		
		<main>
			<h1>{ticker.toUpperCase()}</h1>
		</main>
	)
}
export default SidePanel;