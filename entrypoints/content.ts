import { extractTicker } from "./popup/utils";

export default defineContentScript({
	// matches: ['*://finviz.com/*'],
	matches: ['<all_urls>'],
	main() {


		var intervalId = setInterval(() => {
			if (!chrome.runtime?.id) {
				// The extension was reloaded and this script is orphaned
				clearInterval(intervalId);
				return;
			}

			chrome.runtime.connect({ name: "textHighlight" })
			chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
				// console.log(request, sender, sendResponse);
				sendResponse('我收到你的消息了：' + JSON.stringify("request"));
			});
		}, 45000);

		if (chrome.runtime?.id) {
			const url = window.location.href;
			passingTicker(url);
			document.onmouseup = getSelection

		}
	}

});

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

			if (capturedText?.trim() !== "") {
				if (chrome.runtime?.id) {
					try {
						// chrome.runtime.sendMessage({ action: "open_side_panel", status: "open" }).then(() => {
							let port = chrome.runtime.connect({ name: "textHighlight" })
							console.log(typeof port)
							if (typeof port === 'undefined') return;
							console.log( chrome.runtime)

							port.postMessage({ text: capturedText, from: "content", url: window.location.href, id: id })
							port.onMessage.addListener((msg) => {
								console.log("Content script received message:", msg);
							});
							port.onDisconnect.addListener(() => {
								console.log("disconnect from textHighlight")
							})
						// })
					} catch (error) {
						chrome.runtime.reload();
					}
				} else {

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