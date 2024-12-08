import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
	manifest : {
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
