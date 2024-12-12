import { Collection } from "./types";

export default defineBackground(() => {

	retransmit();
	(async () => openSidePanel())();
	chrome.runtime.onInstalled.addListener(() => {
		contextMenuOpenPanel();
	})

});

async function openSidePanel() {
	const [tab] = await chrome.tabs.query({ active: true });

	if (tab) {
		chrome.runtime.onMessage.addListener(msg => {
			console.log(msg)
			if (msg.action === "open_side_panel") {
				chrome.sidePanel.open({ windowId: tab.windowId })
			}
		})
	}
}

function retransmit() {
	chrome.runtime.onConnect.addListener((port) => {
		port.onMessage.addListener(msg => {
			// console.log(`TICKER: Received from content on port: ${port.name}`)
			// console.log({ msg })
			if (msg.ticker) {
				chrome.runtime.onConnect.addListener(port => {
					// acting as a hub for passing messages to different port with the chrome.runtime
					if (port.name === "comp") {
						// console.log(`handled by background from port: ${port.name}`)
						port.postMessage({ ticker: String(msg.ticker), url: `https://www.sec.gov/edgar/search/#/category=custom&entityName=${msg.ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`, from: "ticker port - background", companyUrl: msg.companyUrl })
					}
					// if ( port.name === "comp") {
					// 	console.log(`handled by background from port: ${port.name}`)
					// 	port.postMessage({  from: "comp port - background", companyUrl: msg.companyUrl })
					// }

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

function sidePanel() {
	const GOOGLE_ORIGIN = 'https://www.google.com';
	chrome.sidePanel
		.setPanelBehavior({ openPanelOnActionClick: true })
		.catch((error) => console.error(error));
	chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
		if (!tab.url) return;
		const url = new URL(tab.url)

		if (url.origin === GOOGLE_ORIGIN) {
			await chrome.sidePanel.setOptions({
				tabId,
				path: 'sidepanel.html',
				enabled: true
			});
		} else {
			// Disables the side panel on all other sites
			await chrome.sidePanel.setOptions({
				tabId,
				enabled: false
			});
		}
	});

	chrome.runtime.onInstalled.addListener(() => {
		chrome.contextMenus.create({
			id: 'openSidePanel',
			title: 'Open side panel',
			contexts: ['all']
		});

	});

	chrome.contextMenus.onClicked.addListener((info, tab) => {
		if (!tab) return;

		if (info.menuItemId === 'openSidePanel') {
			// This will open the panel in all the pages on the current window.
			chrome.sidePanel.open({ windowId: tab.windowId });
		}
	});
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

	const port = chrome.runtime.connect({ name: "textHighlight" });
	port.onMessage.addListener( msg => {
		console.log("received from background in content.ts")
		console.log(msg)
	})
}
