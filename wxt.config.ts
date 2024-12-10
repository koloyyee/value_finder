import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
	manifest : {
		version: "0.1",
		name:"Value Finder",
		description: "saving screeners, jotting notes, and bookmarking links for value investors",
		permissions : [
			"storage",
			"activeTab",
			"tabs",
			"sidePanel",
			"contextMenus",
			// "aiLanguageModelOriginTrial"
		],
		side_panel : {
			default_path : "/sidepanel.html"
		},
		action :{
			"default_title": "Click to open panel"
		},
		// minimum_chrome_version: "131",
	}
});
