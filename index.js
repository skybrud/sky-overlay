import Vue from 'vue';
import Store from 'store';

import SkyOverlayStore from './store';
import SkyOverlay from './SkyOverlay';
import SkyOverlayToggle from './SkyOverlayToggle';
import PageWrap from './PageWrap';

Store.addModule('SkyOverlay', SkyOverlayStore);

// Main component
Vue.component('SkyOverlay', SkyOverlay);

// Sub components
Vue.component('PageWrap', PageWrap);
Vue.component('SkyOverlayToggle', SkyOverlayToggle);

export default SkyOverlay;
