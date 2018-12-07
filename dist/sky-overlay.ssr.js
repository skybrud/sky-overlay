'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// import Vue from 'vue';

function SkyOverlayStore(Vue) {
	var instance = new Vue({
		data: function data() {
			return {
				overlays: {},
				lastPageScrollY: null,
			};
		},
		computed: {
			activeOverlays: function activeOverlays() {
				var this$1 = this;

				return Object.keys(this.overlays)
					.map(function (key) { return this$1.overlays[key]; })
					.filter(function (overlay) { return overlay.active; });
			},
			hasActive: function hasActive() {
				return this.activeOverlays.length > 0;
			},
		},
		created: function created() {
			this.$on('toggle', this.toggle);
			this.$on('toggleAll', this.toggleAll);
			this.$on('closeAll', this.closeAll);
		},
		methods: {
			register: function register(id) {
				if (this.overlays[id]) {
					console.warn(("[SkyOverlay] Replaced overlay with id '" + id + "' because similar overlay id already exists"));
				}
				this.$set(this.overlays, id, {
					active: false,
				});
			},
			unregister: function unregister(id) {
				if (this.overlays[id]) {
					this.$delete(this.overlays, id);
				} else {
					console.warn(("[SkyOverlay] tried to unregister overlay with id '" + id + "' while it is not registered"));
				}
			},
			getState: function getState(key) {
				return this.states[key];
			},
			isActive: function isActive(key) {
				if (key in this.overlays) {
					return this.overlays[key].active;
				}
				return false;
			},
			toggle: function toggle(ref) {
				var id = ref.id;
				var active = ref.active;

				// only toggle if overlay with id exists + is not currently transitioning its state
				if (this.overlays[id]) {
					var newActiveState = !this.overlays[id].active;

					if (typeof active === 'boolean') {
						newActiveState = active;
					}

					if (newActiveState !== this.overlays[id].active) {
						this.overlays[id].active = newActiveState;

						// Close all other overlays
						for (var key in this.overlays) {
							if (key !== id) {
								this.overlays[key].active = false;
							}
						}
					}
				} else {
					console.warn(("[SkyOverlay] Cannot toggle overlay with id '" + id + "' because it does not exist"));
				}
			},
			toggleAll: function toggleAll(active) {
				var this$1 = this;

				var keys = Object.keys(this.overlays);

				if (typeof active === 'boolean') {
					keys.forEach(function (key) {
						this$1.toggle({
							id: key,
							active: active,
						});
					});
				} else {
					keys.forEach(function (key) {
						this$1.toggle({
							id: key,
						});
					});
				}
			},
			closeAll: function closeAll() {
				var this$1 = this;

				Object.keys(this.overlays)
					.filter(function (id) { return this$1.overlays[id].active; })
					.forEach(function (id) { return this$1.overlays[id].active = false; });
			},
			updateLastPageScroll: function updateLastPageScroll() {
				this.lastPageScrollY = window.pageYOffset;
			},
		},
	});

<<<<<<< HEAD
	Object.defineProperty(Vue.prototype, '$SkyOverlay', {
		get: function get() {
			return instance
		}
	});
=======
	Vue.util.defineReactive(Vue.prototype, '$SkyOverlay', instance);
>>>>>>> a066fff3151a41e380fea794a91417d9fce3d038
}

// import SkyOverlayStore from './SkyOverlayStore';

var script = {
	name: 'SkyOverlay',
	props: {
		id: [String, Number],
		closeButton: Boolean,
	},
	data: function data() {
		return {
			lastOverlayScrollY: 0,
			animating: '',
		};
	},
	computed: {
		overlays: function overlays() {
			return this.$SkyOverlay.overlays;
		},
		active: function active() {
			return this.$SkyOverlay.isActive(this.id);
		},
		lastPageScrollY: function lastPageScrollY() {
			return this.$SkyOverlay.lastPageScrollY;
		},
		overlayStyle: function overlayStyle() {
			if (this.active) {
				return {
					position: 'absolute',
				};
			}
			return {
				position: 'fixed',
			};
		},
		overlayContentStyle: function overlayContentStyle() {
			if (this.animating === 'leave') {
				return {
					position: 'relative',
					top: ((-this.lastOverlayScrollY) + "px"),
				};
			}
			return {
				position: 'relative',
			};
		},
	},
	watch: {
		$route: function $route() {
			this.toggle(false);
		},
		active: function active(val) {
			if (!val) {
				this.$set(this, 'lastOverlayScrollY', window.pageYOffset);
			}
		},
	},
	methods: {
		toggle: function toggle(state) {
			this.$SkyOverlay.$emit('toggle', {
				id: this.id,
				active: state,
			});
		},
		beforeEnter: function beforeEnter() {
			document.body.classList.add('sky-overlay-active');
			document.body.classList.add(this.id);
			this.$set(this, 'animating', 'enter');
		},
		afterEnter: function afterEnter() {
			this.$set(this, 'animating', '');
			// Supress focus styles while $el is in focus (remove on blur)
			this.$el.style.outline = 'none';
			this.$el.addEventListener('blur', this.onBlur);
			this.$el.focus();
		},
		beforeLeave: function beforeLeave() {
			this.$set(this, 'animating', 'leave');
			document.body.classList.remove('sky-overlay-active');
			document.body.classList.remove(this.id);
		},
		afterLeave: function afterLeave() {
			this.$set(this, 'animating', '');
		},
		onBlur: function onBlur(event) {
			// Blur event is triggered on window blur too - only stop
			// supressing focus styles if window in focus
			if (document.hasFocus()) {
				event.target.style.outline = '';
				event.target.removeEventListener('blur', this.onBlur);
			}
		},
	},
	beforeMount: function beforeMount() {
		this.$SkyOverlay.register(this.id);
	},
	beforeDestroy: function beforeDestroy() {
		this.$SkyOverlay.unregister(this.id);
	},
};

/* script */
            var __vue_script__ = script;
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:['sky-overlay', _vm.id, {
		active: _vm.active,
		'sky-overlay-enter': _vm.animating === 'enter',
		'sky-overlay-leave': _vm.animating === 'leave',
	}],style:(_vm.overlayStyle),attrs:{"tabindex":"-1"}},[_c('transition',{attrs:{"name":"sky-overlay-animate"},on:{"before-enter":_vm.beforeEnter,"after-enter":_vm.afterEnter,"before-leave":_vm.beforeLeave,"after-leave":_vm.afterLeave}},[(_vm.active)?_c('div',{staticClass:"sky-overlay-container",style:(_vm.overlayContentStyle)},[_c('div',{staticClass:"sky-overlay-content-wrap"},[_c('div',{staticClass:"sky-overlay-content"},[(_vm.closeButton)?_c('div',{staticClass:"sky-overlay-close"},[_c('button',{staticClass:"sky-overlay-close-button",on:{"click":_vm.toggle}},[_vm._t("close",[_vm._v("\n\t\t\t\t\t\t\t\tx\n\t\t\t\t\t\t\t")])],2)]):_vm._e(),_vm._v(" "),_vm._t("default")],2)])]):_vm._e()])],1)};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = "data-v-aa1d4754";
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyOverlay.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SkyOverlay = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

// import SkyOverlayStore from './SkyOverlayStore';

var script$1 = {
	name: 'PageWrap',
	computed: {
		lastPageScrollY: function lastPageScrollY() {
			return this.$SkyOverlay.lastPageScrollY;
		},
		overlaysActive: function overlaysActive() {
			return this.$SkyOverlay.hasActive;
		},
		overlaysActiveStyle: function overlaysActiveStyle() {
			if (this.overlaysActive) {
				return {
					top: ((-this.lastPageScrollY) + "px"),
				};
			}
			return {};
		},
	},
	watch: {
		overlaysActive: function overlaysActive(value) {
			var this$1 = this;

			if (value) {
				this.$SkyOverlay.updateLastPageScroll();
				window.addEventListener('keyup', this.keyup);
				this.$nextTick(function () {
					window.scrollTo(0, 0);
					this$1.$emit('fix');
				});
			} else {
				window.removeEventListener('keyup', this.keyup);
				this.$nextTick(function () {
					window.scrollTo(0, this$1.lastPageScrollY);
					this$1.$emit('release', this$1.lastPageScrollY);
				});
			}
		},
	},
	methods: {
		keyup: function keyup(event) {
			var exclude = [
				'input',
				'textarea',
				'select' ];
			// Close all overlays on ESC key
			if (event.keyCode === 27 && !exclude.includes(event.target.tagName.toLowerCase())) {
				this.$SkyOverlay.$emit('closeAll');
			}
		},
	},
};

/* script */
            var __vue_script__$1 = script$1;
/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:['page-wrap', {
		'sky-overlay-active': _vm.overlaysActive
	}]},[_vm._ssrNode("<div class=\"page-wrap-content\""+(_vm._ssrStyle(null,_vm.overlaysActiveStyle, null))+">","</div>",[_vm._t("default")],2)])};
var __vue_staticRenderFns__$1 = [];

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = "data-v-e221c42c";
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "PageWrap.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var PageWrap = __vue_normalize__$1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

// import SkyOverlayStore from './SkyOverlayStore';

var script$2 = {
	name: 'SkyOverlayToggle',
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
		active: function active() {
			return this.$SkyOverlay.isActive(this.targetId);
		},
	},
	methods: {
		click: function click() {
			this.toggleOverlay();
		},
		toggleOverlay: function toggleOverlay() {
			var payload = {
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

			this.$SkyOverlay.$emit('toggle', payload);
		},
	},
};

/* script */
            var __vue_script__$2 = script$2;
            
/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{staticClass:"sky-overlay-toggle",class:[{active: _vm.active}, _vm.targetId],on:{"click":function($event){$event.preventDefault();return _vm.click($event)}}},[_vm._t("default")],2)};
var __vue_staticRenderFns__$2 = [];

  /* style */
  var __vue_inject_styles__$2 = undefined;
  /* scoped */
  var __vue_scope_id__$2 = undefined;
  /* module identifier */
  var __vue_module_identifier__$2 = "data-v-c165bbc4";
  /* functional template */
  var __vue_is_functional_template__$2 = false;
  /* component normalizer */
  function __vue_normalize__$2(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyOverlayToggle.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SkyOverlayToggle = __vue_normalize__$2(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

var defaults = {
	registerComponents: true,
};

function install(Vue, options) {
	if (install.installed === true) {
		return;
	}

	var ref = Object.assign({}, defaults, options);
	var registerComponents = ref.registerComponents;

	if (registerComponents) {
		Vue.use(SkyOverlayStore);
		// Main component
		Vue.component(SkyOverlay.name, SkyOverlay);

		// Sub components
		Vue.component(PageWrap.name, PageWrap);
		Vue.component(SkyOverlayToggle.name, SkyOverlayToggle);
	}
}

exports.SkyOverlayStore = SkyOverlayStore;
exports.SkyOverlay = SkyOverlay;
exports.PageWrap = PageWrap;
exports.SkyOverlayToggle = SkyOverlayToggle;
exports.default = install;
