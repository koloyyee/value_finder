import React from 'react';
import ScreenerSaver from './ScreenSaver';
import SecBookmarks from './SecBookmarks';

const App: React.FC = () => {
	return (
		<div className="border-2 border-emerald-500 rounded h-max">
			<ScreenerSaver />
			<hr />
			<SecBookmarks />
		</div>
	);
}





export default App;