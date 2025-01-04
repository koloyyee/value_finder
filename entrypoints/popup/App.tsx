import React from 'react';
import BookmarksSection from './BookmarksSection';
import ScreenerSaver from './ScreenSaver';

const App: React.FC = () => {
	return (
		<div className="border-2 border-emerald-500 rounded h-max flex p-1 gap-1 ">
			<ScreenerSaver />
			<hr />
			<BookmarksSection />
		</div>
	);
}





export default App;