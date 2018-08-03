<script>
import SkyOverlayStore from './SkyOverlayStore';

export default {
	props: {
		id: [String, Number],
		closeButton: Boolean,
	},
	data() {
		return {
			lastOverlayScrollY: 0,
			animating: '',
		};
	},
	computed: {
		overlays() {
			return SkyOverlayStore.overlays;
		},
		active() {
			return SkyOverlayStore.isActive(this.id);
		},
		lastPageScrollY() {
			return SkyOverlayStore.lastPageScrollY;
		},
		overlayStyle() {
			if (this.active) {
				return {
					position: 'absolute',
				};
			}
			return {
				position: 'fixed',
			};
		},
		overlayContentStyle() {
			if (this.animating === 'leave') {
				return {
					position: 'relative',
					top: `${-this.lastOverlayScrollY}px`,
				};
			}
			return {
				position: 'relative',
			};
		},
	},
	watch: {
		$route() {
			this.toggle(false);
		},
		active(val) {
			if (!val) {
				this.$set(this, 'lastOverlayScrollY', window.pageYOffset);
			}
		},
	},
	methods: {
		toggle(state) {
			SkyOverlayStore.$emit('toggle', {
				id: this.id,
				active: state,
			});
		},
		beforeEnter() {
			document.body.classList.add('sky-overlay-active');
			document.body.classList.add(this.id);
			this.$set(this, 'animating', 'enter');
		},
		afterEnter() {
			this.$set(this, 'animating', '');
		},
		beforeLeave() {
			this.$set(this, 'animating', 'leave');
			document.body.classList.remove('sky-overlay-active');
			document.body.classList.remove(this.id);
		},
		afterLeave() {
			this.$set(this, 'animating', '');
		},
	},
	beforeMount() {
		SkyOverlayStore.register(this.id);
	},
	beforeDestroy() {
		SkyOverlayStore.unregister(this.id);
	},
};
</script>

<style src="./SkyOverlay.scss"></style>
<template src="./SkyOverlay.html"></template>
