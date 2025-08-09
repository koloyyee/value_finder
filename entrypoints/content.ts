import { sendMessage } from "./message";
import { extractTicker } from "./utils";

export default defineContentScript({
	// matches: ['*://finviz.com/*'],
	matches: ['<all_urls>'],
	main() {

		if (chrome.runtime?.id) {
			const url = window.location.href;
			passingTicker(url);
			document.onmouseup = getSelection
			// document.onmouseup = getPdfSelectedText
		}
	}

});

// test
(async () => {
	const length = await sendMessage('getStringLength', 'hello world');
	console.log(length)
})()

/**
 * Message Publisher.
 * 
 * Message passing of a company ticker  
 * @param url 
 */
function passingTicker(url: string) {
	const href = document.querySelector(".quote-header_ticker-wrapper_company")?.querySelector("a")?.getAttribute("href");
	const ticker = extractTicker(url);

	if (ticker && href) {
		if (chrome.runtime?.id) {
			const port = chrome.runtime.connect({ name: "comp" });
			port.postMessage({ ticker, from: "start from content passingTicker", companyUrl: href })
		}
	}
}



/**
 * User can highlight the text and highlighted text will send to the side panel.
 */
async function getSelection() {
	const selection = window.getSelection();

	if (selection) {

		if (selection.rangeCount > 0) {
			// opt-out because it is not persistent yet.
			// highlightText(selection)
			const id = String(Date.now())
			let capturedText = document.getSelection()?.toString();

			if (capturedText?.trim() !== "" && chrome.runtime?.id) {
				try {
					let port = chrome.runtime.connect({ name: "textHighlight" })
					if (typeof port === 'undefined') return;
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

/**
 * 1. How can I know I am access a pdf file in Chrome?
 * 2. How to get the selection text from the pdf file? will window.getSelection() work?
 */

// from claude.ai
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	if (message.text) {
// 		const outputElement = document.getElementById('output');
// 		if (outputElement) {
// 			outputElement.textContent = message.text;
// 		}
// 	}
// });
// [type="application/x-google-chrome-pdf"] is the default PDF viewer in Chrome
// export function extractTextFromPDF() {
// 	// Check if we're in a PDF viewer
// 	if (document.body.querySelector('embed[type="application/pdf"]')) {
// 		// Get the PDF viewer iframe
// 		const pdfViewer = document.body.querySelector('embed[type="application/pdf"]');

// 		// Get selected text
// 		const selection = window.getSelection();
// 		const selectedText = selection?.toString();

// 		if (selectedText) {
// 			console.log('Selected text:', selectedText);
// 			// You can send this back to popup.js using chrome.runtime.sendMessage
// 			chrome.runtime.sendMessage({ text: selectedText });
// 		} else {
// 			console.log('No text selected');
// 		}
// 	}
// }

// function pdf() {
// 	console.log("hello")
// 	document.getElementById('extractText')?.addEventListener('click', async () => {
// 		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

// 		chrome.scripting.executeScript({
// 			target: { tabId: tab.id! },
// 			func: extractTextFromPDF,
// 		});
// 	});
// }
// pdf()