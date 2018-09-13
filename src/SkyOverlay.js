import SkyOverlayStore from './SkyOverlayStore';

export default {
	name: 'SkyOverlay',
	props: {
		id: [String, Number],
		closeButton: Boolean,
	},
	data() {
		return {
			lastOverlayScrollY: 0,
			animating: '',
		};
	},
	computed: {
		overlays() {
			return SkyOverlayStore.overlays;
		},
		active() {
			return SkyOverlayStore.isActive(this.id);
		},
		lastPageScrollY() {
			return SkyOverlayStore.lastPageScrollY;
		},
		overlayStyle() {
			if (this.active) {
				return {
					position: 'absolute',
				};
			}
			return {
				position: 'fixed',
			};
		},
		overlayContentStyle() {
			if (this.animating === 'leave') {
				return {
					position: 'relative',
					top: `${-this.lastOverlayScrollY}px`,
				};
			}
			return {
				position: 'relative',
			};
		},
	},
	watch: {
		$route() {
			this.toggle(false);
		},
		active(val) {
			if (!val) {
				this.$set(this, 'lastOverlayScrollY', window.pageYOffset);
			}
		},
	},
	methods: {
		toggle(state) {
			SkyOverlayStore.$emit('toggle', {
				id: this.id,
				active: state,
			});
		},
		beforeEnter() {
			document.body.classList.add('sky-overlay-active');
			document.body.classList.add(this.id);
			this.$set(this, 'animating', 'enter');
		},
		afterEnter() {
			this.$set(this, 'animating', '');
			// Supress focus styles while $el is in focus (remove on blur)
			this.$el.style.outline = 'none';
			this.$el.addEventListener('blur', this.onBlur);
			this.$el.focus();
		},
		beforeLeave() {
			this.$set(this, 'animating', 'leave');
			document.body.classList.remove('sky-overlay-active');
			document.body.classList.remove(this.id);
		},
		afterLeave() {
			this.$set(this, 'animating', '');
		},
		onBlur(event) {
			// Blur event is triggered on window blur too - only stop
			// supressing focus styles if window in focus
			if (document.hasFocus()) {
				event.target.style.outline = '';
				event.target.removeEventListener('blur', this.onBlur);
			}
		},
	},
	beforeMount() {
		SkyOverlayStore.register(this.id);
	},
	beforeDestroy() {
		SkyOverlayStore.unregister(this.id);
	},
};
