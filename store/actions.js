import Vue from 'vue';

const actions = {
	toggle(context, payload) {
		const keyup = (event) => {
			if (event.keyCode === 27) {
				// Close all overlays on ESC key
				context.dispatch('toggleAll', false);
			}
		};

		let numberOfActiveOverlays = context.getters.activeOverlays.length;

		context.commit('TOGGLE', payload);

		if (numberOfActiveOverlays !== context.getters.activeOverlays.length) {
			numberOfActiveOverlays = context.getters.activeOverlays.length;

			if (numberOfActiveOverlays === 1) {
				window.addEventListener('keyup', keyup);
				context.commit('UPDATE_LAST_SCROLL_Y');
				context.commit('TOGGLE_PAGE_WRAP', context.getters.hasActive);
				document.body.classList.add('sky-overlay-active');

				Vue.nextTick(() => {
					window.scrollTo(0, 0);
				});
			} else if (numberOfActiveOverlays === 0) {
				window.removeEventListener('keyup', keyup);
				context.commit('TOGGLE_PAGE_WRAP', context.getters.hasActive);
				document.body.classList.remove('sky-overlay-active');

				Vue.nextTick(() => {
					window.scrollTo(0, context.getters.lastScrollY);
				});
			}
		} else {
			Vue.nextTick(() => {
				window.scrollTo(0, 0);
			});
		}
	},
	toggleAll(context, active) {
		if (typeof active === 'boolean') {
			Object.keys(context.state.overlays).forEach((key) => {
				context.dispatch('toggle', {
					name: key,
					active,
				});
			});
		} else {
			Object.keys(context.state.overlays).forEach((key) => {
				context.dispatch('toggle', {
					name: key,
				});
			});
		}
	},
};

export default actions;
