import { Collection } from "./types";

export default defineBackground(() => {

	chrome.runtime.onInstalled.addListener(() => {
		retransmit();
		(async () => openSidePanel())();
		contextMenuOpenPanel();
		// trackSidePanelState();
	})

	let sidePanelOpen = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "is_side_panel_open") {
    sendResponse({ sidePanelOpen: sidePanelOpen });
  }
});

let isSidePanelOpen = false;
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "textHighlight") {
    isSidePanelOpen = true;
    port.onDisconnect.addListener(() => {
      isSidePanelOpen = false;
    });
  }
});
});


function trackSidePanelState() {
	let isSidePanelOpen = false;

	chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
		if (msg.action === "open_side_panel") {
			if (sender.tab?.windowId !== undefined) {
				// chrome.sidePanel.open({ windowId: sender.tab.windowId });
				isSidePanelOpen = true;
				sendResponse({ status: "side_panel_opened" });
			}
		} else if (msg.action === "close_side_panel") {
			isSidePanelOpen = false;
			sendResponse({ status: "side_panel_closed" });
		} else if (msg.action === "check_side_panel_status") {
			sendResponse({ isOpen: isSidePanelOpen });
		}
	});
}

async function openSidePanel() {
	const [tab] = await chrome.tabs.query({ active: true });

	if (tab) {
		chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
			console.log(msg, sender)
			// if (tab.windowId !== undefined) {
			// 	chrome.sidePanel.open({ windowId: tab.windowId });
			// }
			// if (msg.action === "open_side_panel") {
				chrome.sidePanel.open({ windowId: tab.windowId })

			// }
		})
	}
}


function retransmit() {
	chrome.runtime.onConnect.addListener((port) => {
		port.onDisconnect.addListener(() => {
			if (chrome.runtime.lastError) {
				console.error("Port disconnection error:", chrome.runtime.lastError);
			}
		});
		port.onMessage.addListener(msg => {
			// console.log(`TICKER: Received from content on port: ${port.name}`)
			// console.log({ msg })
			if (msg.ticker) {
				chrome.runtime.onConnect.addListener(port => {
					// acting as a hub for passing messages to different port with the chrome.runtime
					if (port.name === "comp") {
						// console.log(`handled by background from port: ${port.name}`)
						port.postMessage({ ticker: String(msg.ticker), secReport: `https://www.sec.gov/edgar/search/#/category=custom&entityName=${msg.ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`, from: "ticker port - background", companyUrl: msg.companyUrl, insider: `https://www.sec.gov/edgar/search/#/category=custom&entityName=${msg.ticker}&forms=144` })
					}
					if ( port.name === "textHighlight") {
						console.log(`handled by background from port: ${port.name}`)
						port.postMessage({  from: "comp port - background", text: ""})
					}

				})
			}
		});
	});
	(async () => {
		screenersCollectionChecker();
	})();
}
function sendTicker(ticker: string) {
	chrome.runtime.onConnect.addListener(port => {
		port.postMessage({ ticker: ticker, url: `https://www.sec.gov/edgar/search/#/category=custom&entityName=${ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`, from: " sendTicker background" })
	})
}

async function screenersCollectionChecker() {
	const coll = await chrome.storage.local.get(Collection.screeners);
	if (Object.keys(coll).length === 0) {
		await chrome.storage.local.set({ [Collection.screeners]: {} });
	} else {
		console.log({ coll })
	}
}



async function contextMenuOpenPanel() {
	// TODO: add the highlighted text to side panel quote section.
	chrome.contextMenus.create({
		id: 'openSidePanel',
		title: 'Open side panel',
		contexts: ['all']
	});

	chrome.contextMenus.onClicked.addListener((info, tab) => {
		if (!tab || !tab.id) return;
		if (info.menuItemId === 'openSidePanel') {
			// This will open the panel in all the pages on the current window.
			chrome.sidePanel.open({ tabId: tab.id, windowId: tab.windowId });
		}
	})

}
