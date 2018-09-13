import Vue from 'vue';

const SkyOverlayStore = new Vue({
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
			if (typeof active === 'boolean') {
				Object.keys(this.overlays).forEach((key) => {
					this.toggle({
						id: key,
						active,
					});
				});
			} else {
				Object.keys(this.overlays).forEach((key) => {
					this.toggle({
						id: key,
					});
				});
			}
		},
		updateLastPageScroll() {
			this.lastPageScrollY = window.pageYOffset;
		},
	},
});

var script = {
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

/* script */
            const __vue_script__ = script;
            
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:['sky-overlay', _vm.id, {
		active: _vm.active,
		'sky-overlay-enter': _vm.animating === 'enter',
		'sky-overlay-leave': _vm.animating === 'leave',
	}],style:(_vm.overlayStyle),attrs:{"tabindex":"-1"}},[_c('transition',{attrs:{"name":"sky-overlay-animate"},on:{"before-enter":_vm.beforeEnter,"after-enter":_vm.afterEnter,"before-leave":_vm.beforeLeave,"after-leave":_vm.afterLeave}},[(_vm.active)?_c('div',{staticClass:"sky-overlay-container",style:(_vm.overlayContentStyle)},[_c('div',{staticClass:"sky-overlay-content-wrap"},[_c('div',{staticClass:"sky-overlay-content"},[(_vm.closeButton)?_c('div',{staticClass:"sky-overlay-close"},[_c('button',{staticClass:"sky-overlay-close-button",on:{"click":_vm.toggle}},[_vm._t("close",[_vm._v("\n\t\t\t\t\t\t\t\tx\n\t\t\t\t\t\t\t")])],2)]):_vm._e(),_vm._v(" "),_vm._t("default")],2)])]):_vm._e()])],1)};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-4b4417d2_0", { source: "\n.sky-overlay{position:absolute;top:0;left:0;width:100vw;min-height:100.1vh;overflow:hidden;z-index:20;pointer-events:none\n}\n&.sky-overlay-enter,&.sky-overlay-leave{height:100vh\n}\n.sky-overlay-close{z-index:2\n}\n.sky-overlay-content{z-index:2\n}", map: undefined, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyOverlay.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    {
      let hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          const originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          const existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__() {
    const head = document.head || document.getElementsByTagName('head')[0];
    const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
    const isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        let code = css.source;
        let index = style.ids.length;

        style.ids.push(id);

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
          // http://stackoverflow.com/a/26603875
          code +=
            '\n/*# sourceMappingURL=data:application/json;base64,' +
            btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
            ' */';
        }

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          const el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) el.setAttribute('media', css.media);
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          const textNode = document.createTextNode(code);
          const nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
          else style.element.appendChild(textNode);
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var SkyOverlay = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    __vue_create_injector__,
    undefined
  );

var script$1 = {
	name: 'PageWrap',
	computed: {
		lastPageScrollY() {
			return SkyOverlayStore.lastPageScrollY;
		},
		overlaysActive() {
			return SkyOverlayStore.hasActive;
		},
		overlaysActiveStyle() {
			if (this.overlaysActive) {
				return {
					top: `${-this.lastPageScrollY}px`,
				};
			}
			return {};
		},
	},
	watch: {
		overlaysActive(value) {
			if (value) {
				SkyOverlayStore.updateLastPageScroll();
				window.addEventListener('keyup', this.keyup);
				this.$nextTick(() => {
					window.scrollTo(0, 0);
					this.$emit('fix');
				});
			} else {
				window.removeEventListener('keyup', this.keyup);
				this.$nextTick(() => {
					window.scrollTo(0, this.lastPageScrollY);
					this.$emit('release', this.lastPageScrollY);
				});
			}
		},
	},
	methods: {
		keyup(event) {
			const exclude = [
				'input',
				'textarea',
				'select',
			];
			// Close all overlays on ESC key
			if (event.keyCode === 27 && !exclude.includes(event.target.tagName.toLowerCase())) {
				SkyOverlayStore.$emit('toggleAll');
			}
		},
	},
};

/* script */
            const __vue_script__$1 = script$1;
            
/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:['page-wrap', {
		'sky-overlay-active': _vm.overlaysActive
	}]},[_c('div',{staticClass:"page-wrap-content",style:(_vm.overlaysActiveStyle)},[_vm._t("default")],2)])};
var __vue_staticRenderFns__$1 = [];

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-ed389e2a_0", { source: "\n.page-wrap{position:relative;width:100vw;overflow:hidden;top:0;left:0;height:100.1vh\n}", map: undefined, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "PageWrap.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    {
      let hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          const originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          const existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__$1() {
    const head = document.head || document.getElementsByTagName('head')[0];
    const styles = __vue_create_injector__$1.styles || (__vue_create_injector__$1.styles = {});
    const isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        let code = css.source;
        let index = style.ids.length;

        style.ids.push(id);

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
          // http://stackoverflow.com/a/26603875
          code +=
            '\n/*# sourceMappingURL=data:application/json;base64,' +
            btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
            ' */';
        }

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          const el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) el.setAttribute('media', css.media);
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          const textNode = document.createTextNode(code);
          const nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
          else style.element.appendChild(textNode);
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var PageWrap = __vue_normalize__$1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    __vue_create_injector__$1,
    undefined
  );

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

/* script */
            const __vue_script__$2 = script$2;
            
/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{staticClass:"sky-overlay-toggle",class:[{active: _vm.active}, _vm.targetId],on:{"click":function($event){$event.preventDefault();return _vm.click($event)}}},[_vm._t("default")],2)};
var __vue_staticRenderFns__$2 = [];

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* component normalizer */
  function __vue_normalize__$2(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyOverlayToggle.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
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

const defaults = {
	registerComponents: true,
};

function install(Vue$$1, options) {
	if (install.installed === true) {
		return;
	}

	const { registerComponents } = Object.assign({}, defaults, options);

	if (registerComponents) {
		// Main component
		Vue$$1.component(SkyOverlay.name, SkyOverlay);

		// Sub components
		Vue$$1.component(PageWrap.name, PageWrap);
		Vue$$1.component(SkyOverlayToggle.name, SkyOverlayToggle);
	}

	Vue$$1.prototype.$SkyOverlay = {
		isActive: SkyOverlayStore.isActive,
		toggle: SkyOverlayStore.toggle,
		toggleAll: SkyOverlayStore.toggleAll,
	};
}

export default install;
export { SkyOverlayStore, SkyOverlay, PageWrap, SkyOverlayToggle };
