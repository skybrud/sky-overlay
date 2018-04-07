<script>
export default {
	computed: {
		lastPageScrollY() {
			return this.$store.getters['SkyOverlay/lastPageScrollY'];
		},
		overlaysActive() {
			return this.$store.getters['SkyOverlay/hasActive'];
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
				this.$store.commit('SkyOverlay/UPDATE_LAST_PAGE_SCROLL');
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
				this.$store.dispatch('SkyOverlay/toggleAll', false);
			}
		},
	},
};
</script>

<style src="./PageWrap.scss"></style>
<template src="./PageWrap.html"></template>