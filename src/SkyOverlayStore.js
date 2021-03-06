// import Vue from 'vue';

export default function SkyOverlayStore(Vue) {
	const instance = new Vue({
		data() {
			return {
				overlays: {},
				lastPageScrollY: null,
			};
		},
		computed: {
			activeOverlays() {
				return Object.keys(this.overlays)
					.map(key => this.overlays[key])
					.filter(overlay => overlay.active);
			},
			hasActive() {
				return this.activeOverlays.length > 0;
			},
		},
		created() {
			this.$on('toggle', this.toggle);
			this.$on('toggleAll', this.toggleAll);
			this.$on('closeAll', this.closeAll);
		},
		methods: {
			register(id) {
				if (this.overlays[id]) {
					console.warn(`[SkyOverlay] Replaced overlay with id '${id}' because similar overlay id already exists`);
				}
				this.$set(this.overlays, id, {
					active: false,
				});
			},
			unregister(id) {
				if (this.overlays[id]) {
					this.$delete(this.overlays, id);
				} else {
					console.warn(`[SkyOverlay] tried to unregister overlay with id '${id}' while it is not registered`);
				}
			},
			getState(key) {
				return this.states[key];
			},
			isActive(key) {
				if (key in this.overlays) {
					return this.overlays[key].active;
				}
				return false;
			},
			toggle({ id, active }) {
				// only toggle if overlay with id exists + is not currently transitioning its state
				if (this.overlays[id]) {
					let newActiveState = !this.overlays[id].active;

					if (typeof active === 'boolean') {
						newActiveState = active;
					}

					if (newActiveState !== this.overlays[id].active) {
						this.overlays[id].active = newActiveState;

						// Close all other overlays
						for (const key in this.overlays) {
							if (key !== id) {
								this.overlays[key].active = false;
							}
						}
					}
				} else {
					console.warn(`[SkyOverlay] Cannot toggle overlay with id '${id}' because it does not exist`);
				}
			},
			toggleAll(active) {
				const keys = Object.keys(this.overlays);

				if (typeof active === 'boolean') {
					keys.forEach((key) => {
						this.toggle({
							id: key,
							active,
						});
					});
				} else {
					keys.forEach((key) => {
						this.toggle({
							id: key,
						});
					});
				}
			},
			closeAll() {
				Object.keys(this.overlays)
					.filter(id => this.overlays[id].active)
					.forEach(id => this.overlays[id].active = false);
			},
			updateLastPageScroll() {
				this.lastPageScrollY = window.pageYOffset;
			},
		},
	});

	Vue.util.defineReactive(Vue.prototype, '$SkyOverlay', instance);
}
