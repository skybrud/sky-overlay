import Vue from 'vue';

const mutations = {
	REGISTER(state, name) {
		if (state.overlays[name]) {
			console.warn(`Replaced overlay with id '${name}' because similar overlay id already exists`);
		}
		Vue.set(state.overlays, name, {
			active: false,
		});
	},
	UNREGISTER(state, name) {
		if (state.overlays[name]) {
			Vue.delete(state.overlays, name);
		} else {
			console.warn(`tried to unregister overlay with id '${name}' while it is not registered`);
		}
	},
	TOGGLE(state, payload) {
		// only toggle if overlay with name exists + is not currently transitioning its state
		if (state.overlays[payload.name]) {
			let newActiveState = !state.overlays[payload.name].active;

			if (typeof payload.active === 'boolean') {
				newActiveState = payload.active;
			}

			if (newActiveState !== state.overlays[payload.name].active) {
				state.overlays[payload.name].active = newActiveState;

				// Close all other overlays
				for (const key in state.overlays) {
					if (key !== payload.name) {
						state.overlays[key].active = false;
					}
				}
			}
		} else {
			console.warn(`Cannot toggle overlay with id '${payload.name}' because it does not exist`);
		}
	},
	UPDATE_LAST_PAGE_SCROLL(state) {
		state.lastPageScrollY = window.pageYOffset;
	},
};

export default mutations;
