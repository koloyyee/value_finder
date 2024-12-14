import { extractTicker } from "./popup/utils";

export default defineContentScript({
	// matches: ['*://finviz.com/*'],
	matches: ['<all_urls>'],
	main() {

		const highlight = chrome.runtime.connect({ name: "textHighlight" })
		const comp = chrome.runtime.connect({ name: "comp" });

		highlight.onMessage.addListener((msg) => {
			console.log("connected from textHighlight")
		})

		comp.onMessage.addListener((msg) => {
			console.log("connected from comp")
		})
		highlight.postMessage({ text: "", from: "content connection established", url: "", })
		comp.postMessage({ ticker: "", from: "content connection established", companyUrl: "" })

		highlight.onDisconnect.addListener(() => {
			console.log("disconnected from textHighlight")
		})
		comp.onDisconnect.addListener(() => {
			console.log("disconnected from comp")
		})

		const url = window.location.href;
		passingTicker(url);
		// getSelection();
		// document.addEventListener('DOMContentLoaded', function () {
			// getSelection();
			document.onmouseup = getSelection
		// });
		// document.oncontextmenu = removeSpecificHighlight
	}
});

function passingTicker(url: string) {
	const href = document.querySelector(".quote-header_ticker-wrapper_company")?.querySelector("a")?.getAttribute("href");
	const ticker = extractTicker(url);
	if (ticker && href) {
		const port = chrome.runtime.connect({ name: "comp" });
		port.postMessage({ ticker, from: "start from content passingTicker", companyUrl: href })
	}
}




/**
 * User can highlight the text and highlighted text will send to the side panel.
 */
function getSelection() {

	const selection = window.getSelection();

	if (selection) {

		if (selection.rangeCount > 0) {
			// opt-out because it is not persistent yet.
			// highlightText(selection)
			const id = String(Date.now())
			let capturedText = document.getSelection()?.toString();

			if (capturedText?.trim() !== "") {
				try {

					// chrome.runtime.sendMessage({ action: "open_side_panel", })
					chrome.runtime.sendMessage({ type: 'log', message: "reolai" });
					const port = chrome.runtime.connect({ name: "textHighlight" })
					port.postMessage({ text: capturedText, from: "content", url: window.location.href, id: id })
					port.onMessage.addListener((msg) => {
						console.log("Content script received message:", msg);
					});
					port.onDisconnect.addListener(() => {
						console.log("disconnect from textHighlight")
					})
				} catch (error) {
					console.error(error)
				}
			}

		}
	}
}


/** future features */
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
		if (container.nodeType === Node.ELEMENT_NODE && (container as Element).classList.contains('highlight')) {
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