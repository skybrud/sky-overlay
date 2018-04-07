import SkyOverlayStore from './store';
import SkyOverlay from './SkyOverlay';
import PageWrap from './PageWrap';
import SkyOverlayToggle from './SkyOverlayToggle';

const defaults = {
	registerComponents: true,
	store: null,
};

export default {
	install(Vue, options) {
		const { registerComponents, store } = Object.assign({}, defaults, options);

		if (store) {
			store.registerModule('SkyOverlay', SkyOverlayStore);

			if (registerComponents) {
				// Main component
				Vue.component('SkyOverlay', SkyOverlay);

				// Sub components
				Vue.component('PageWrap', PageWrap);
				Vue.component('SkyOverlayToggle', SkyOverlayToggle);
			}
		} else if (process.env.NODE_ENV !== 'production') {
			console.warn('[SkyOverlay] Not installed. Provide a vuex store, ie.: Vue.plugin(SkyOverlay, { store: myStore })');
		}
	},
};
