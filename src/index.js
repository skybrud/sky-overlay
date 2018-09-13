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

export default function install(Vue, options) {
	if (install.installed === true) {
		return;
	}

	const { registerComponents } = Object.assign({}, defaults, options);

	if (registerComponents) {
		Vue.use(SkyOverlayStore);
		// Main component
		Vue.component(SkyOverlay.name, SkyOverlay);

		// Sub components
		Vue.component(PageWrap.name, PageWrap);
		Vue.component(SkyOverlayToggle.name, SkyOverlayToggle);
	}
};
