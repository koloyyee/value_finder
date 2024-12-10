import React, { useState } from 'react';
// import "./App.css";
import { Collection } from '../types';
import ScreenerSaver from './ScreenSaver';
import SecBookmarks from './SecBookmarks';



const App: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>(Collection.screeners);
	const [currTicker, setCurrTicker] = useState<string>("");
	const [tabId, setTabId] = useState(-1);


	function openSidePanel() {
		
		console.log("sending action")
		chrome.runtime.sendMessage({ action: "open_side_panel"})
		window.close()
	}
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
			<button type="button" onClick={() => openSidePanel()}> Open Note </button>
		</div>
	);
}





export default App;