const actions = {
	toggle({ commit }, payload) {
		commit('TOGGLE', payload);
	},
	toggleAll({ state, dispatch }, active) {
		if (typeof active === 'boolean') {
			Object.keys(state.overlays).forEach((key) => {
				dispatch('toggle', {
					name: key,
					active,
				});
			});
		} else {
			Object.keys(state.overlays).forEach((key) => {
				dispatch('toggle', {
					name: key,
				});
			});
		}
	},
};

export default actions;
