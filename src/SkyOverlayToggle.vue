<script>
import SkyOverlayStore from './SkyOverlayStore';

export default {
	props: {
		targetId: {
			type: String,
			required: true,
		},
		setActive: {
			type: [String, Boolean],
			default: undefined,
			required: false,
		},
	},
	computed: {
		active() {
			return SkyOverlayStore.isActive(this.targetId);
		},
	},
	methods: {
		click() {
			this.toggleOverlay();
		},
		toggleOverlay() {
			const payload = {
				id: this.targetId,
				active: undefined,
			};

			if (this.setActive !== undefined) {
				if (typeof this.setActive === 'boolean') {
					payload.active = this.setActive;
				} else {
					payload.active = (this.setActive === 'true');
				}
			}

			SkyOverlayStore.$emit('toggle', payload);
		},
	},
};
</script>

<template src="./SkyOverlayToggle.html"></template>
