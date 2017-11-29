<script>
export default {
	props: ['name'],
	data() {
		return {
			overlayStyle: {
				// visibility: 'hidden',
				position: 'absolute',
				top: 0,
			},
		};
	},
	computed: {
		active() {
			// TODO: Try getting overlay name directly from vuex store
			const overlays = this.$store.getters['SkyOverlay/overlays'];

			if (overlays && this.name in overlays) {
				return overlays[this.name].active;
			}
			return false;
		},
	},
	watch: {
		$route() {
			this.toggle(false);
		},
	},
	methods: {
		toggle(state) {
			this.$store.dispatch('SkyOverlay/toggle', {
				name: this.name,
				active: state,
			});

			if (state) {
				this.$set(this, 'overlayStyle', {
					// visibility: 'visible',
					position: 'absolute',
					top: 0,
				});
			} else {
				this.$set(this, 'overlayStyle', {
					// visibility: 'visible',
					position: 'fixed',
					top: `${-window.pageYOffset}px`,
				});
			}
		},
		afterLeave(el, done) {
			this.overlayStyle = {
				// visibility: 'hidden',
				// position: 'absolute',
				top: '',
			};
			done();
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
