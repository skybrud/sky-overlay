<script>
export default {
	props: ['name'],
	data() {
		return {
			lastOverlayScrollY: 0,
			animating: '',
		};
	},
	computed: {
		active() {
			return this.$store.getters['SkyOverlay/isActive']
				? this.$store.getters['SkyOverlay/isActive'](this.name)
				: false;
		},
		lastPageScrollY() {
			return this.$store.getters['SkyOverlay/lastPageScrollY'];
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
			this.$store.dispatch('SkyOverlay/toggle', {
				name: this.name,
				active: state,
			});
		},
		beforeEnter() {
			document.body.classList.add('sky-overlay-active');
			document.body.classList.add(this.name);
			this.$set(this, 'animating', 'enter');
		},
		afterEnter() {
			this.$set(this, 'animating', '');
		},
		beforeLeave() {
			this.$set(this, 'animating', 'leave');
			document.body.classList.remove('sky-overlay-active');
			document.body.classList.remove(this.name);
		},
		afterLeave() {
			this.$set(this, 'animating', '');
		},
	},
	beforeMount() {
		this.$store.commit('SkyOverlay/REGISTER', this.name);
	},
	beforeDestroy() {
		this.$store.commit('SkyOverlay/UNREGISTER', this.name);
	},
};
</script>

<style src="./SkyOverlay.scss"></style>
<template src="./SkyOverlay.html"></template>
