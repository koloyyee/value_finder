export default defineContentScript({
	matches: ['*://finviz.com/*'],
	main() {
		const url = window.location.href;
		const ticker = url.replace("https://finviz.com/quote.ashx?t=", "").replace("&p=d", "")


		getFillings({ k: true, q: true });

		if (url.includes("quote.ashx")) {
			const port = chrome.runtime.connect({ name: "ticker" });
			port.postMessage({ ticker })
			console.log("post msg", ticker)
			console.log(Date.now(), url)

			port.onMessage.addListener(async msg => {
				console.log("post msg", msg.url)
				console.log(Date.now(), url)
				chrome.runtime.sendMessage({ url: msg.url, from:"content" })
			})

			// (async () => {
				// const response = await chrome.runtime.sendMessage({  ticker });
				// do something with response here, not outside the function
				// console.log(response);
			// })();
			// chrome.runtime.onMessage.addListener(
			// 	function (request, sender, sendResponse) {
			// 		console.log(sender.tab ?
			// 			"from a content script:" + sender.tab.url :
			// 			"from the extension");
			// 			console.log(request.message)
			// 	}
			// );
		}


	},
});

async function getFillings({ k, q }: { k: boolean, q: boolean }) {

	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			console.log(sender.tab ?
				"from a content script:" + sender.tab.url :
				"from the extension");
			if (request.greeting === "hello")
				sendResponse({ farewell: "goodbye" });
		}
	);
}
