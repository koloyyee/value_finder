export default defineBackground(async () => {

	// if (port.name === "ticker") {
	// console.log(port.name)
	// 	port.onMessage.addListener(msg => {
	// 		ticker = msg.ticker;
	// 	})
	// }
	// console.log(ticker)
	// if (port.name === "sec" && ticker !== "" ) {
	// console.log(port.name)
	// 		port.postMessage({ url: `https://www.sec.gov/edgar/search/#/q=${msg.ticker}`, from: "background" })
	// }
	// getTicker().then(ticker => {

	// 	console.log(ticker)
	// 	sendTicker(String(ticker));
	// })
	getTicker();
});

function getTicker() {
		chrome.runtime.onConnect.addListener((port) => {
			port.onMessage.addListener(msg => {
				console.log(msg)
				if (msg.ticker) {
					sendTicker(String(msg.ticker))
				}
			});
		});
		// chrome.runtime.onMessage.addListener( (req, sender, resp) => {
		// 	console.log({req, sender, resp})
		// 	sendTicker(String(req.ticker))
		// })
}
function sendTicker(ticker: string) {
	console.log({ticker})
	chrome.runtime.onConnect.addListener(port => {
		port.postMessage({ticker: ticker, url: `https://www.sec.gov/edgar/search/#/category=custom&entityName=${ticker}&forms=10-K%252C10-Q`, from: "background" })
	})
}

