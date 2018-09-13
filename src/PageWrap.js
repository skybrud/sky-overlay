import SkyOverlayStore from './SkyOverlayStore';

export default {
	name: 'PageWrap',
	computed: {
		lastPageScrollY() {
			return SkyOverlayStore.lastPageScrollY;
		},
		overlaysActive() {
			return SkyOverlayStore.hasActive;
		},
		overlaysActiveStyle() {
			if (this.overlaysActive) {
				return {
					top: `${-this.lastPageScrollY}px`,
				};
			}
			return {};
		},
	},
	watch: {
		overlaysActive(value) {
			if (value) {
				SkyOverlayStore.updateLastPageScroll();
				window.addEventListener('keyup', this.keyup);
				this.$nextTick(() => {
					window.scrollTo(0, 0);
					this.$emit('fix');
				});
			} else {
				window.removeEventListener('keyup', this.keyup);
				this.$nextTick(() => {
					window.scrollTo(0, this.lastPageScrollY);
					this.$emit('release', this.lastPageScrollY);
				});
			}
		},
	},
	methods: {
		keyup(event) {
			const exclude = [
				'input',
				'textarea',
				'select',
			];
			// Close all overlays on ESC key
			if (event.keyCode === 27 && !exclude.includes(event.target.tagName.toLowerCase())) {
				SkyOverlayStore.$emit('toggleAll');
			}
		},
	},
};
