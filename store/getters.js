const getters = {
	overlays(state) {
		return state.overlays;
	},
	activeOverlays(state) {
		const returnValue = [];

		for (const key in state.overlays) {
			if (state.overlays[key].active) {
				returnValue.push(state.overlays[key]);
			}
		}

		return returnValue;
	},
	hasActive(state) {
		return Object.keys(state.overlays).reduce((previous, key) => {
			if (!previous) {
				return state.overlays[key].active;
			}
			return previous;
		}, false);
	},
	lastScrollY(state) {
		return state.lastScrollY;
	},
	pageWrapStyle(state) {
		return state.pageWrapStyle;
	},
};

export default getters;
