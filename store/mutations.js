import Vue from 'vue';

const mutations = {
	REGISTER(state, name) {
		if (name in state.overlays) {
			console.warn(`Replaced overlay with id '${name}' because similar overlay id already exists`);
		}
		Vue.set(state.overlays, name, {
			active: false,
		});
	},
	UNREGISTER(state, name) {
		if (name in state.overlays) {
			Vue.delete(state.overlays, name);
		} else {
			console.warn(`tried to unregister overlay with id '${name}' while it is not registered`);
		}
	},
	TOGGLE(state, payload) {
		if (payload.name in state.overlays) {
			let newActiveState = !state.overlays[payload.name].active;

			if ('active' in payload && typeof payload.active === 'boolean') {
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
	UPDATE_LAST_SCROLL_Y(state) {
		state.lastScrollY = window.pageYOffset;
	},
	TOGGLE_PAGE_WRAP(state, active) {
		if (active) {
			state.pageWrapStyle = {
				position: 'absolute',
				// top: `${-state.lastScrollY}px`,
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				overflow: 'hidden',
			};
		} else {
			state.pageWrapStyle = {
				position: '',
				top: '',
				bottom: '',
				left: '',
				right: '',
				overflow: '',
			};
		}
	},
};

export default mutations;
