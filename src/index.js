import SkyOverlayStore from './SkyOverlayStore';
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

		Vue.prototype.$SkyOverlay = {
			isActive: SkyOverlayStore.isActive,
			toggle: SkyOverlayStore.toggle,
			toggleAll: SkyOverlayStore.toggleAll,
		};
	},
};
