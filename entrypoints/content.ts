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
		document.onmouseup = getSelection
	}
});

// testing for separation.
function passingCompanyUrl() {
	const href = document.querySelector(".quote-header_ticker-wrapper_company")?.querySelector("a")?.getAttribute("href");
	const port = chrome.runtime.connect({ name: "comp" });

	if (href) {
		port.postMessage({ from: "start from content passingCompanyUrl", companyUrl: href })
	} else {
		console.error("url not matched.")
	}
}

function passingTicker(url: string) {
	const href = document.querySelector(".quote-header_ticker-wrapper_company")?.querySelector("a")?.getAttribute("href");
	const port = chrome.runtime.connect({ name: "comp" });
	const ticker = extractTicker(url);
	if (ticker && href) {
		port.postMessage({ ticker, from: "start from content passingTicker", companyUrl: href })
	} else {
		console.error("url not matched.")
	}
}

function getSelection() {
	let capturedText = document.getSelection()?.toString();
	if (capturedText?.trim() !== "") {
		const port = chrome.runtime.connect({ name: "textHighlight" })
		port.postMessage({ text: capturedText, from: "content" })
	}
}

function msgPassing({ portName = "", msg = "" }) {
	const port = chrome.runtime.connect({ name: portName })
	port.postMessage({ text: msg, from: "content" })
}