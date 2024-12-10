import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
	manifest : {
		name:"Value Finder",
		description: "saving screeners, jotting notes, and bookmarking links for value investors",
		permissions : [
			"storage",
			"activeTab",
			"tabs",
			"sidePanel",
			"contextMenus"
		],
		side_panel : {
			default_path : "/sidepanel.html"
		},
		action :{
			"default_title": "Click to open panel"
		}
	}
});
