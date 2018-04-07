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
	isActive(state) {
		return (key) => {
			if (key in state.overlays) {
				return state.overlays[key].active;
			}
			return false;
		};
	},
	hasActive(state) {
		return Object.keys(state.overlays).reduce((previous, key) => {
			if (!previous) {
				return state.overlays[key].active;
			}
			return previous;
		}, false);
	},
	lastPageScrollY(state) {
		return state.lastPageScrollY;
	},
};

export default getters;
