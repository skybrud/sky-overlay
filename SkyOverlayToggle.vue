<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
		setActive: {
			type: [String, Boolean],
			default: undefined,
			required: false,
		},
	},
	data() {
		return {
			checkGlobalStore: false,
		};
	},
	computed: {
		active() {
			if (this.checkGlobalStore) {
				const overlays = this.$store.getters['SkyOverlay/overlays'];
				if (overlays && this.name in overlays) {
					return overlays[this.name].active;
				}
			}

			return false;
		},
	},
	methods: {
		click() {
			this.toggleOverlay();
		},
		toggleOverlay() {
			const payload = {
				name: this.name,
				active: undefined,
			};

			if (this.setActive !== undefined) {
				if (typeof this.setActive === 'boolean') {
					payload.active = this.setActive;
				} else {
					payload.active = (this.setActive === 'true');
				}
			}

			this.$store.dispatch('SkyOverlay/toggle', payload);
		},
	},
	mounted() {
		this.checkGlobalStore = true;
	},
};
</script>

<template src="./SkyOverlayToggle.html"></template>
