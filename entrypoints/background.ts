import { Collection } from "./popup/utils";

export default defineBackground(() => {

	getTicker();
	sidePanel();
});

function getTicker() {
	chrome.runtime.onConnect.addListener((port) => {
		port.onMessage.addListener(msg => {
			if (msg.ticker) {
				chrome.runtime.onConnect.addListener(port => {
					port.postMessage({ ticker: String(msg.ticker), url: `https://www.sec.gov/edgar/search/#/category=custom&entityName=${msg.ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`, from: "background" })
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
		port.postMessage({ ticker: ticker, url: `https://www.sec.gov/edgar/search/#/category=custom&entityName=${ticker}&forms=10-K%252C10-Q%252C20-F%252C40-F`, from: "background" })
	})
}

async function screenersCollectionChecker() {
		const coll = await chrome.storage.local.get(Collection.screeners);
		if(Object.keys(coll).length === 0 ) {
			await chrome.storage.local.set({ [Collection.screeners] : {} });
		} else {
			console.log({coll})
		}
}

function sidePanel() {
	chrome.runtime.onInstalled.addListener(() => {
		chrome.contextMenus.create({
			id: 'openSidePanel',
			title: 'Open SIDE panel',
			contexts: ['all']
		});
	});

	chrome.contextMenus.onClicked.addListener((info, tab) => {
		if (info.menuItemId === 'openSidePanel') {
			// This will open the panel in all the pages on the current window.
			chrome.sidePanel.open({ windowId: tab.windowId });
		}
	});

	const GOOGLE_ORIGIN = 'https://www.google.com';

	chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
		if (!tab.url) return;
		const url = new URL(tab.url);
		// Enables the side panel on google.com
		// if (url.origin === GOOGLE_ORIGIN) {
			await chrome.sidePanel.setOptions({
				tabId,
				path: 'sidepanel/index.html',
				enabled: true
			});
		// } else {
		// 	// Disables the side panel on all other sites
		// 	await chrome.sidePanel.setOptions({
		// 		tabId,
		// 		enabled: false
		// 	});
		// }
	});

}