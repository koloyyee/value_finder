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
		document.oncontextmenu = removeSpecificHighlight
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


function removeSpecificHighlight() {
	const selection = window.getSelection();

	if (selection && selection.rangeCount > 0) {
		const range = selection.getRangeAt(0);
		let container = range.commonAncestorContainer;

		// If the container is a text node, get its parent element
		if (container.nodeType === Node.TEXT_NODE) {
			container = container.parentNode!;
		}

		// Ensure we are working with an element and find the nearest <span.highlight>
		if (container.nodeType === Node.ELEMENT_NODE && container.classList.contains('highlight')) {
			const parent = container.parentNode;

			// Replace the span with its child content
			while (container.firstChild) {
				parent!.insertBefore(container.firstChild, container);
			}

			parent!.removeChild(container); // Remove the empty span
			chrome.runtime.connect({ name: "mouse-action" })
			const port = chrome.runtime.connect({ name: "textHighlight" })
			port.postMessage({ text: "", from: "content", url: "", })
		}
	}
}

function highlightText(selection: Selection) {
	const range = selection.getRangeAt(0);
	const span = document.createElement('span');
	span.style.backgroundColor = 'yellow'; // Change color as needed
	span.classList.add("highlight")

	// Wrap the selected text with the span
	const selectedText = range.extractContents();
	span.appendChild(selectedText);
	range.insertNode(span);
}

/**
 * User can highlight the text and highlighted text will send to the side panel.
 */
function getSelection() {

	const selection = window.getSelection();

	if (selection) {
		const highlightMarking = String(Date.now());

		if (selection.rangeCount > 0) {
			// opt-out because it is not persistent yet.
			// highlightText(selection)
			const id = String(Date.now())
			let capturedText = document.getSelection()?.toString();

			if (capturedText?.trim() !== "") {
				const port = chrome.runtime.connect({ name: "textHighlight" })
				port.postMessage({ text: capturedText, from: "content", url: window.location.href, id: id })
			}

		}
	}
}

function msgPassing({ portName = "", msg = "" }) {
	const port = chrome.runtime.connect({ name: portName })
	port.postMessage({ text: msg, from: "content" })
}