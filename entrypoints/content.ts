import { extractTicker } from "./popup/utils";

export default defineContentScript({
	// matches: ['*://finviz.com/*'],
	matches: ['<all_urls>'],
	main() {
		const url = window.location.href;
		if (url.includes("quote.ashx")) {
			passingTicker(url);
		}
		// getSelection();
		document.addEventListener("onmouseup", (e) => {
			console.log(e)
		})
		console.log("hello")
		document.onmouseup = getSelection
	}
});

function passingTicker(url: string) {
	const port = chrome.runtime.connect({ name: "ticker" });
	const ticker = extractTicker(url);
	if (ticker) {
		port.postMessage({ ticker, from: "content" })
		port.onMessage.addListener(async msg => {
			chrome.runtime.sendMessage({ url: msg.url, from: "content" })
		})
	} else {
		console.error("url not matched.")
	}
}

function getSelection() {
	let capturedText = document.getSelection()?.toString();
	// document.onmouseup = grapSelect
	msgPassing({ portName: "textHighlight", msg: capturedText })
}

function msgPassing({ portName = "", msg = "" }) {
	// let m = getSelection();
	// console.log(m)
	const port = chrome.runtime.connect({ name: portName })
	port.postMessage({ text: msg, from: "content" })
}