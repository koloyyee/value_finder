import { onMessage } from "./message";
import { Collection, StorageLocation } from "./types";
import { ScreenerStorageImpl } from "./wxtstorage";

export default defineBackground(() => {

	chrome.runtime.onInstalled.addListener(() => {
		retransmit();
		// (async () => openSidePanel())();
		// contextMenuOpenPanel();

	})
		// var intervalId = setInterval(() => {
		// 	// console.log("polling in background.ts")
		// 	if (!chrome.runtime?.id) {
		// 		// The extension was reloaded and this script is orphaned
		// 		clearInterval(intervalId);
		// 		return;
		// 	}
		// 	chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
		// 		chrome.tabs.sendMessage(tabs[0].id as number, {greeting: "hello"}, function(response) {
		// 				console.log(response);
		// 		});
		// 	}); 
		// }, 45000);
});


async function openSidePanel() {
	const [tab] = await chrome.tabs.query({ active: true });

	if (tab) {
		chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
			console.log(msg, sender)
			if (tab.windowId !== undefined) {
				chrome.sidePanel.open({ windowId: tab.windowId });
			}
			if (msg.action === "open_side_panel") {
				chrome.sidePanel.open({ windowId: tab.windowId })

			}
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
					if (port.name === "textHighlight") {
						console.log(`handled by background from port: ${port.name}`)
						port.postMessage({ from: "comp port - background", text: "" })
					}

				})
			}
		});
	});
	(async () => {
		await screenersCollectionChecker();
	})();
}
function sendTicker(ticker: string) {
	chrome.runtime.onConnect.addListener(port => {
		port.postMessage({ ticker: ticker, url: `https://www.sec.gov/edgar/search/#/category=custom&entityName=${ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`, from: " sendTicker background" })
	})
}

async function screenersCollectionChecker(): Promise<void> {
	const storage = new ScreenerStorageImpl(StorageLocation("local:", Collection.screeners));
	await storage.get();
}



async function contextMenuOpenPanel() {
	// TODO: add the highlighted text to side panel quote section.
	chrome.contextMenus.create({
		id: 'openSidePanel',
		title: 'Open side panel',
		contexts: ['all']
	});

	chrome.contextMenus.onClicked.addListener((info, tab) => {
		// if (!tab || !tab.id) return;
		// if (info.menuItemId === 'openSidePanel') {
			// This will open the panel in all the pages on the current window.
			chrome.sidePanel.open({  windowId: tab?.windowId as number });
		// }
		// chrome.windows.getCurrent({ populate: true }, (window) => {
		// 	(chrome as any).sidePanel.open({ windowId: window.id });
		// });
	})
	


}

onMessage("getStringLength", message => {
	console.log("Calling message from background.ts ")
	return message.data.length
})