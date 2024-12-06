export default defineContentScript({
	matches: ['*://finviz.com/*'],
	main() {
		const url = window.location.href;


		if (url.includes("quote.ashx")) {
			const port = chrome.runtime.connect({ name: "ticker" });
			// const ticker = url.replace("https://finviz.com/quote.ashx?t=", "").replace("&p=d", "")
			const regex = /t=([a-zA-Z]+)&/;
			const match = regex.exec(url);
			if (match) {
				const ticker = match[1]
				console.log(ticker)
				port.postMessage({ ticker })
				port.onMessage.addListener(async msg => {
					chrome.runtime.sendMessage({ url: msg.url, from: "content" })
				})
			} else {
				console.error( "url not matched.")
			}
		}
	},
});
