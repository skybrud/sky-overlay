# sky-overlay
> Vue module for creating page overlays with scrollable content

## overlay of content
* [Installation](#installation)
* [Basic concept](#concept)
* [Usage](#usage)


## <a id="installation"></a>Installation
```bash
npm install sky-overlay
```

```bash
yarn add sky-overlay
```

## <a id="concept"></a>Basic concept
The main focus of SkyOverlay is to create overlays that:

- Can fill the entire view
- Have their own internal scroll independent of the rest of the page
- Lock the scroll of the page behind them while they're active (and gracefully restore it upon deactivation)
- Can be transparent (by keeping the page content in the DOM behind them)
- Allow for appear/leave animations using Vue transitions

The plugin registers 3 components globally:

1. `<SkyOverlay />` -  The overlay itself
2. `<SkyOverlayToggle />` - A (button) component for toggling an overlay from anywhere in your app
3. `<PageWrap />` -  An important secondary component, for wrapping regular page content. This enables the scroll position of the page to be locked behind any activated overlay(s) and restored upon deactivation.

**Note:** The page wrapper is an important part of making SkyOverlay function properly. It locks content and removes it from scroll while an overlay is active.

## <a id="usage"></a>Usage
### Import
```js
import Vue from 'vue';
import SkyOverlay from 'sky-overlay';

// If you want to use the baseline scss add the following line
import '${YOUR-PROJECT-ROOT-PATH}/node_modules/sky-crop/src/SkyCrop.scss';

Vue.use(SkyOverlay);
```


### Example template
Add `<PageWrap />` and all instances of `<SkyOverlay />` in your root app component like below.
`<SkyOverlayToggle />` can be used anywhere.
```html
<div id="app">

	<!-- Define any fixed components outside PageWrap such as fixed headers: -->
	<AppHeader />

	<PageWrap>
		<h1>Your regular page content here</h1>
		<p>This is also where you would put your router-view etc.</p>

		<!-- You can add SkyOverlayToggle to toggle your overlay -->
		<SkyOverlayToggle
			:target-id="'myOverlay'"
		>
			Click here to toggle overlay with id "myOverlay"
		</SkyOverlayToggle>
	</PageWrap>


	<!-- Add your overlay(s) outside PageWrap -->
	<SkyOverlay
		:id="'myOverlay'"
	>
		{{Your overlay content}}
	</SkyOverlay>

</div>
```

### Animation
The `<SkyOverlay />` component is animatable using Vue [transitions](https://vuejs.org/v2/guide/transitions.html). The transition is named `sky-overlay-animate` and is executed on the div with the class `.sky-overlay-container`. Basic example below:

```scss

.sky-overlay-container {
	background-color: green;

	&.sky-overlay-animate-enter-active,
	&.sky-overlay-animate-leave-active {
		transition: opacity .5s;
	}
	&.sky-overlay-animate-enter,
	&.sky-overlay-animate-leave-to {
		opacity: 0;
	}
}
```

### Opening overlays programmatically
As an alternative to the `<SkyOverlayTrigger />` component any overlay instances can also be toggled programmatically using `$SkyOvelay` exposed in the global Vue scope.
```js
Vue.$SkyOverlay.toggle({ id: 'myOverlay' }); // 'myOverlay' is toggled to the reverse of its current open state
Vue.$SkyOverlay.toggle({ id: 'myOverlay', active: false }); // 'myOverlay' is closed if open
```
Which of course also means it works inside any component:
```js
export default {
	// ...
	computed: {
		myOverlayState() {
			return this.$SkyOverlay.isActive('myOverlay'); // True if overlay is open
		},
	},
	created() {
		this.$SkyOverlay.toggleAll(false); // Force all overlays to close
		this.$SkyOverlay.toggle({ id: 'myOverlay', active: true }); // Open specific overlay
	},
	// ...
});
```

## Credits
This module is made by the Frontenders at [skybrud.dk](http://www.skybrud.dk/). Feel free to use it in any way you want. Feedback, questions and bugreports should be posted as issues. Pull-requests appreciated!
