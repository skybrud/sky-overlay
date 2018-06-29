import SkyOverlayStore from './SkyOverlayStore.vue';
import SkyOverlay from './SkyOverlay.vue';
import PageWrap from './PageWrap.vue';
import SkyOverlayToggle from './SkyOverlayToggle.vue';

const defaults = {
	registerComponents: true,
};

export {
	SkyOverlayStore,
	SkyOverlay,
	PageWrap,
	SkyOverlayToggle,
};

export default {
	install(Vue, options) {
		const { registerComponents } = Object.assign({}, defaults, options);

		if (registerComponents) {
			// Main component
			Vue.component('SkyOverlay', SkyOverlay);

			// Sub components
			Vue.component('PageWrap', PageWrap);
			Vue.component('SkyOverlayToggle', SkyOverlayToggle);
		}
	},
};
