import React, { useEffect, useState } from 'react';
// import "./App.css";
import ScreenerSaver from './ScreenSaver';
import SecBookmarks from './SecBookmarks';
import { Collection } from "./utils";



const App: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>(Collection.screeners);
	const [currTicker, setCurrTicker] = useState<string>("");
	const [tabId, setTabId] = useState(-1);

	useEffect(() => {
		(async () => {
			// const [tab] = await chrome.tabs.query({ currentWindow: true });
			// console.log(tab.url!)
			// if (tab.url && tab.url.includes("quote.ashx")) {

				// setCurrTicker(extractTicker(tab.url)?? "");
				/*** Comment out for no message passing  */
				// const port = chrome.runtime.connect({ name: "ticker" })
				// port.onMessage.addListener(msg => {
				// 	setCurrTicker(msg.ticker)
				// })
				// if (tab.id) {
				// 	console.log(tab.id)
				// 	setTabId(tab.id)
				// }
				// return () => {
				// 	port.disconnect();
				// };
				
			// } else {
			// 	setCurrTicker("")
			// }
		})();
	}, [])

	return (
		// <div className="tabs">
		// 	<div className="tab-buttons">
		// 		<TabButton onClick={() => setActiveTab(Collection.screeners)}
		// 			isActive={activeTab === Collection.screeners}
		// 			buttonTitle='Screeners' />
		// 		<TabButton onClick={() => setActiveTab(Collection.bookmarks)}
		// 			isActive={activeTab === Collection.bookmarks}
		// 			buttonTitle='Bookmarks' />
		// 	</div>
		// 	<TabContent>
		// 		{activeTab === Collection.screeners && <ScreenerSaver />}
		// 		{activeTab === Collection.bookmarks && <SecBookmarks />}
		// 	</TabContent>
		// </div>
		<div  className="border-2 border-emerald-500 rounded h-full">
			<ScreenerSaver  />
			<hr />
			<SecBookmarks />
		</div>
	);
}





export default App;