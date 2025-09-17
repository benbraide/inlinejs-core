# InlineJS Core Package

[![npm (scoped)](https://img.shields.io/npm/v/@benbraide/inlinejs-core.svg)](https://www.npmjs.com/package/@benbraide/inlinejs-core) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/minzip/@benbraide/inlinejs-core.svg)](https://www.npmjs.com/package/@benbraide/inlinejs-core)

This package contains `core` directives and magic properties for the [InlineJS Framework](https://github.com/benbraide/InlineJS)

## Install

 - Grab source or distribution versions from `GitHub`
 - Include script in your HTML file.

## CDNs

```html
<script src="https://cdn.jsdelivr.net/npm/@benbraide/inlinejs-core@1.x.x/dist/inlinejs-core.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@benbraide/inlinejs-core@1.x.x/dist/inlinejs-core.min.js"></script>
```
 
## NPM Install

```
npm install @benbraide/inlinejs-core
```

## Reference

Available **core** directives:

| Directive | Description |
| --- | --- |
| [`hx-data`](#hx-data) | Declares a new component scope or nested scope with associated data. |
| [`hx-component`](#hx-component) | Assigns a key to a component. |
| [`hx-ref`](#hx-ref) | Stores a reference to the DOM element in the component using the specified key. |
| [`hx-locals`](#hx-locals) | Creates storage local to the element and its offspring. |
| [`hx-post`](#hx-post) | Runs an expression after all directives on element --- and offspring directives --- have been executed. |
| [`hx-init`](#hx-init) | Runs an expression once when an element is added to the DOM. |
| [`hx-uninit`](#hx-uninit) | Runs an expression when an element is removed from the DOM. |
| [`hx-static`](#hx-static) | Runs an expression without keeping track of changes. |
| [`hx-effect`](#hx-effect) | Evaluates an expression and keeps track of changes. |
| [`hx-bind`](#hx-attr) | Sets the value of an attribute to the result of a JS expression. |
| [`hx-style`](#hx-style) | Similar to `hx-bind`, but will update the `style` attribute. |
| [`hx-class`](#hx-class) | Set/Remove one or more classes based on the truth of the specified expression. |
| [`hx-text`](#hx-text) | Works similarly to `hx-bind`, but will update the `innerText` of an element. |
| [`hx-html`](#hx-html) | Works similarly to `hx-bind`, but will update the `innerHTML` of an element. |
| [`hx-on`](#hx-on) | Attaches an event listener to the element. Executes JS expression when emitted. |
| [`hx-model`](#hx-model) | Adds "two-way data binding" to an element. Keeps input element in sync with component data. |
| [`hx-if`](#hx-if) | Remove or inserts an element from/into the DOM depending on expression (true or false). |
| [`hx-else`](#hx-else) | Remove or inserts an element from/into the DOM depending on expression (true or false) and a preceding `hx-if` or `hx-else` directive. |
| [`hx-each`](#hx-each) | Create new DOM nodes for each item in an array, associative map, or integer range. |
| [`hx-show`](#hx-show) | Toggles `display: none;` on the element depending on expression (true or false). |
| [`hx-cloak`](#hx-cloak) | This attribute is removed when InlineJS initializes. Useful for hiding pre-initialized DOM. |
| [`hx-code`](#hx-code) | Evaluates the text inside the element as a JS expression. |
| [`hx-log`](#hx-log) | Logs the element it is placed in to the console. |
| [`hx-next-tick`](#hx-nexttick) | Execute expression after InlineJS has made its reactive DOM updates. |
| [`hx-next-idle`](#hx-nextidle) | Execute expression when the system becomes idle. |
| [`hx-next-non-idle`](#hx-nextnonIdle) | Execute expression when the system is no longer idle. |

Available **core** magic properties:

| Property | Description |
| --- | --- |
| [`$component`](#component) | Retrieve the specified component storage. |
| [`$locals`](#locals) | Retrieve the local storage associated with the element. |
| [`$proxy`](#proxy) | Retrieve the root proxy. |
| [`$native`](#native) | Retrieve the non-proxied data associated with a key. |
| [`$refs`](#refs) | Retrieve DOM elements marked with `hx-ref` inside the component. |
| [`$scope`](#scope) | Retrieve the current scope. |
| [`$scopes`](#scopes) | Retrieve all scopes in the current component. |
| [`$stream`](#stream) | Stream the specified data using a callback.  |
| [`$wait`](#wait) | Wait the specified data using a callback.  |
| [`$static`](#static) | Suppress reactivity for the specified access. |
| [`$unoptimized`](#unoptimized) | Suppress optimizations for the specified access. |
| [`$watch`](#watch) | Watch a given expression for changes. |
| [`$store`](#store) | Store objects in global or component-local storage. |
| [`$resource`](#resource) | Load external resources (styles, scripts, data). |
| [`$waiting`](#waiting) | Check if promises or loops are still pending. |
| [`$wrap`](#wrap) | Wrap functions to maintain proper scope context. |
| [`$range`](#range) | Create numeric ranges with optional timing. |
| [`$attribute`](#attribute) | Manipulate DOM element attributes. |
| [`$style`](#style) | Manipulate CSS styles on the current element. |
| [`$code`](#code) | Execute or retrieve named code blocks. |
| [`$inlinejs`](#inlinejs) | Access the global InlineJS framework object. |
| [`$global`](#global) | Access the global InlineJS configuration. |
| [`$utilities`](#utilities) | Access InlineJS utility functions. |
| [`$values`](#values) | Access InlineJS value helpers. |
| [`$version`](#version) | Get the InlineJS framework version. |
| [`$str`](#str) | String manipulation utilities. |
| [`$framework`](#framework) | Access framework-specific information. |
| [`$pick`](#pick) | Return one of two values based on a predicate. |
| [`$rel`](#rel) | Use one of the `relational` operators. |
| [`$log`](#log) | Use one of the `logical` operators. |
| [`$math`](#math) | Use one of the `arithmetic` operators. |
| [`$dom`](#dom) | Access a DOM property. |
| [`$class`](#class) | Use one of the available `class` helpers. |
| [`$eval`](#eval) | Evaluate an expression and return the result. |
| [`$nextTick`](#nexttick) | Execute a given expression **after** `InlineJS` has made its reactive DOM updates. |

### Directives

---

### `hx-data`

**Example:** `<div hx-data="{ foo: 'bar' }">...</div>`

**Structure:** `<div hx-data="[object literal]|[Function]">...</div>`

`hx-data` declares a new component scope. It tells the framework to initialize a new component with the following data object.

**Extract Component Logic**

You can extract data (and behavior) into reusable functions:

```html
<div hx-data="dropdown">
    <button hx-on:click="open">Open</button>

    <div hx-show="isOpen()" hx-on:click.outside="close">
        Dropdown
    </div>
</div>

<script>
    function dropdown() {
        return {
            show: false,
            open() { this.show = true },
            close() { this.show = false },
            isOpen() { return this.show },
        }
    }
</script>
```

You can also mix-in multiple data objects using object destructuring:

```html
<div hx-data="{...dropdown(), ...tabs()}">
```
**Component config**

You can specify a `$config` property on the object used to initialize a component. This enables you to specify per-component configurations.

```html
<div hx-data="{ $config: { name: 'my-component', reactiveState: 'optimized' } }"></div>
```
> Available configurations are:
> - `reativeState` specifies the reactivity state of a component. One of `default`, `optimized`, or `unoptimized`.
> - `name` specifies the name of the component.
> - `locals` specifies data that should be treated as local to the root element and its offspring.
> - `init` specifies a function to execute after the component has been initialized.
> - `uninit` specifies a function to execute when the root element is removed from the DOM.
> - `post` specifies a function to execute after all directives have been processed, including offspring's directives.

**Nested scope**

You can create nested scopes by using the `hx-data` directive on an offspring of a component:

```html
<div hx-data="{ level: 'top' }">
    <div hx-data="{ level: 'nested' }">
	    <p hx-text="$scope.level"></p>
	    <p hx-text="$parent.level"></p>
    </div>
</div>
```

> `hx-data` exposes the following local properties, available to the component root and its offspring:
> - `$name` If accessed from a nested scope, it retrieves the name of the current scope. Otherwise, it returns the name of the current component.
> - `$componentName` retrieves the name of the current component.
> - `$parent` retrieves the data associated with the parent of the current scope. Returns `undefined` if not accessed from a nested scope.

---

### `hx-component`
**Example:** `<div hx-data hx-component="my-component"></div>`

**Structure:** `<div hx-data="..." hx-component="[identifier]"></div>`

`hx-component` assigns a name to a component.

**`evaluate` argument**

**Example:** `<div hx-data hx-component:evaluate="componentName"></div>`

Use the `evaluate` argument to instruct the directive to evaluate the specified expression.

---

### `hx-ref`
**Example:** `<div hx-data hx-ref="myDiv"></div>`

**Structure:** `<div hx-data="..." hx-ref="[variable]"></div>`

`hx-ref` stores a reference to the DOM element in the component using the specified key. The key is added to the `$refs` global magic property.

---

### `hx-locals`

**Example:** `<div hx-locals="{ foo: 'bar' }">...</div>`

**Structure:** `<div hx-locals="[object literal]|[Function]">...</div>`

`hx-locals` associates a local storage with the element. This storage is not reactive.

---

### `hx-post`
**Example:** `<div hx-post="console.log('Every offspring initialized')"></div>`

**Structure:** `<div hx-post="[expression]"></div>`

`hx-post` runs an expression after all directives on element, and offspring directives, have been executed.

---

### `hx-init`
**Example:** `<div hx-init="console.log('Element initialized')"></div>`

**Structure:** `<div hx-init="[expression]"></div>`

`hx-init` runs an expression once when an element is added to the DOM. This is useful for initialization logic that should run only once when the element becomes available.

---

### `hx-uninit`
**Example:** `<div hx-uninit="console.log('Element removed')"></div>`

**Structure:** `<div hx-uninit="[expression]"></div>`

`hx-uninit` runs an expression when an element is removed from the DOM.

---

### `hx-static`
**Example:** `<div hx-data="{ foo: 'bar' }" hx-static="foo = 'baz'"></div>`

**Structure:** `<div hx-static="[expression]"></div>`

`hx-static` runs an expression without keeping track of changes.

---

### `hx-effect`
**Example:** `<div hx-data="{ value: 9 }" hx-effect="doubled = value * 2"></div>`

**Structure:** `<div hx-effect="[expression]"></div>`

`hx-effect` runs an expression and keeps track of changes. When changes occur elsewhere, the expression is re-run.

---

### `hx-bind`

> Note: You are free to use the shorter ":" syntax: `:type="..."`

**Example:** `<input hx-bind:type="inputType">`

**Structure:** `<input hx-bind:[attribute]="[expression]">`

`hx-bind` sets the value of an attribute to the result of a JavaScript expression. The expression has access to all the keys of the component's data object, and will update every-time its data is updated.

> Note: attribute bindings ONLY update when their dependencies update. The framework is smart enough to observe data changes and detect which bindings care about them.

**`hx-bind` for boolean attributes**

`hx-bind` supports boolean attributes in the same way as value attributes, using a variable as the condition or any JavaScript expression that resolves to `true` or `false`.

For example:
```html
<!-- Given: -->
<button hx-bind:disabled="myVar">Click me</button>

<!-- When myVar == true: -->
<button disabled="disabled">Click me</button>

<!-- When myVar == false: -->
<button>Click me</button>
```

This will add or remove the `disabled` attribute when `myVar` is true or false respectively.

Boolean attributes are supported as per the [HTML specification](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), for example `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, etc.

> Note: If you need a false state to show for your attribute, such as `aria-*`, chain `.toString()` to the value while binding to the attribute. For example: `:aria-expanded="isOpen.toString()"` would persist whether  `isOpen` was `true` or `false`.

---

### `hx-style`
**Example:**
```html
<span hx-style:display="'block'"></span>
<span hx-style="{ display: 'block', width: '1rem' }"></span>
```

**Structure:**
```html
<span hx-style:[property]="[expression]"></span>
<span hx-style="{ [property]: [expression], ... }"></span>
```

`hx-style` sets the value of a style property on an element to the evaluated expression.

---

### `hx-class`

> Note: You are free to use the shorter "." syntax: `.block="..."`

**Example:**
```html
<span hx-class:block="shouldBeBlock"></span>
<span hx-class="{ block: true, inline: false }"></span>
```

**Structure:**
```html
<span hx-class:[name]="[boolean expression]"></span>
<span hx-class="{ [name]: [boolean expression], ... }"></span>
```

`hx-class` sets or removes a class name on an element based on the truthiness of the evaluated expression.

---

### `hx-text`
**Example:** `<span hx-text="foo"></span>`

**Structure:** `<span hx-text="[expression]"`

`hx-text` works similarly to `hx-bind`, except instead of updating the value of an attribute, it will update the `innerText` of an element.

> A promise, or promise-like object, may be returned and `hx-text` will wait for it to be resolved and the resulting value used.

---

### `hx-html`
**Example:** `<span hx-html="foo"></span>`

**Structure:** `<span hx-html="[expression]"`

`hx-html` works similarly to `hx-bind`, except instead of updating the value of an attribute, it will update the `innerHTML` of an element.

> A promise, or promise-like object, may be returned and `hx-html` will wait for it to be resolved and the resulting value used.

> :warning: **Only use on trusted content and never on user-provided content.** :warning:
>
> Dynamically rendering HTML from third parties can easily lead to [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) vulnerabilities.

> :loudspeaker: This directive supports `transitions` and `animations`.

---

### `hx-on`

> Note: You are free to use the shorter "@" syntax: `@click="..."`

**Example:** `<button hx-on:click="foo = 'bar'"></button>`

**Structure:** `<button hx-on:[event]="[expression]"></button>`

`hx-on` attaches an event listener to the element it's declared on. When that event is emitted, the JavaScript expression set as its value is executed.

If any data is modified in the expression, other element attributes "bound" to this data, will be updated.

> Note: You can also specify a JavaScript function name

> - This directive exposes a `$event` context variable, representing the generated native event, accessible during the evaluation of the specified expression.
> - When a function is specified, it is passed the generated event as the first argument.

**Example:** `<button hx-on:click="myFunction"></button>`

This is equivalent to: `<button hx-on:click="myFunction($event)"></button>`

**`keydown` modifiers**

**Example:** `<input type="text" hx-on:keydown.esc="open = false">`

You can specify specific keys to listen for using `keydown` modifiers appended to the `hx-on:keydown` directive. Note that the modifiers are kebab-cased versions of `Event.key` values.

Examples: `enter`, `escape`, `arrow-up`, `arrow-down`

> Note: You can also listen for system-modifier key combinations like: `hx-on:keydown.ctrl.enter="foo"`
> Multiple keys can be combined for alternatives e.g. `hx-on:keydown.enter.space`
> Character ranges can be specified e.g. `hx-on:keydown.a-z` `hx-on:keydown.0-9`
> Character groups can be specified e.g. `hx-on:keydown.alpha` `hx-on:keydown.digit`

**`.outside` modifier**

**Example:** `<div hx-on:click.outside="showModal = false"></div>`

When the `.outside` modifier is present, the event handler will only be executed when the event originates from a source other than itself, or its offspring.

This is useful for hiding dropdowns and modals when a user clicks away from them.

**`.prevent` modifier**
**Example:** `<input type="checkbox" hx-on:click.prevent>`

Adding `.prevent` to an event listener will call `preventDefault` on the triggered event. In the above example, this means the checkbox wouldn't actually get checked when a user clicks on it.

**`.stop` modifier**
**Example:** `<div hx-on:click="foo = 'bar'"><button hx-on:click.stop></button></div>`

Adding `.stop` to an event listener will call `stopPropagation` on the triggered event. In the above example, this means the "click" event won't bubble from the button to the outer `<div>`. Or in other words, when a user clicks the button, `foo` won't be set to `'bar'`.

**`.self` modifier**
**Example:** `<div hx-on:click.self="foo = 'bar'"><button></button></div>`

Adding `.self` to an event listener will only trigger the handler if the `$event.target` is the element itself. In the above example, this means the "click" event that bubbles from the button to the outer `<div>` will **not** run the handler.

**`.window` modifier**
**Example:** `<div hx-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Adding `.window` to an event listener will install the listener on the global window object instead of the DOM node on which it is declared. This is useful for when you want to modify component state when something changes with the window, like the resize event. In this example, when the window grows larger than 768 pixels wide, we will close the modal/dropdown, otherwise maintain the same state.

>Note: You can also use the `.document` modifier to attach listeners to `document` instead of `window`

**`.once` modifier**
**Example:** `<button hx-on:mouseenter.once="fetchSomething()"></button>`

Adding the `.once` modifier to an event listener will ensure that the listener will only be called once. This is useful for things you only want to do once, like fetching HTML partials and such.

**`.passive` modifier**
**Example:** `<button hx-on:mousedown.passive="interactive = true"></button>`

Adding the `.passive` modifier to an event listener will make the listener a passive one, which means `preventDefault()` will not work on any events being processed, this can help, for example with scroll performance on touch devices.

**`.debounce` modifier**
**Example:** `<input hx-on:input.debounce="fetchSomething()">`

The `.debounce` modifier allows you to "debounce" an event handler. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specify a custom wait time like so:

```html
<input hx-on:input.debounce.750="fetchSomething()">
<input hx-on:input.debounce.750ms="fetchSomething()">
```

---

### `hx-model`
**Example:** `<input type="text" hx-model="foo">`

**Structure:** `<input type="text" hx-model="[data item]">`

`hx-model` adds "two-way data binding" to an element. In other words, the value of the input element will be kept in sync with the value of the data item of the component.

> Note: `hx-model` is smart enough to detect changes on text inputs, checkboxes, radio buttons, textareas, selects, and multiple selects.

**`.number` modifier**
**Example:** `<input hx-model.number="age">`

The `number` modifier will convert the input's value to a number. If the value cannot be parsed as a valid number, the original value is returned.

**`.debounce` modifier**
**Example:** `<input hx-model.debounce="search">`

The `debounce` modifier allows you to add a "debounce" to a value update. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specify a custom wait time like so:

```html
<input hx-model.debounce.750="search">
<input hx-model.debounce.750ms="search">
```

---

### `hx-if`
**Example:** `<template hx-if="true"><div>...</div></template>`

**Structure:** `<template hx-if="[expression]">...</template>`

For cases where `hx-show` isn't sufficient (`hx-show` sets an element to `display: none` if it's false), `hx-if` can be used to  actually remove an element completely from the DOM.

>**Note**:
> - A `template` element is required for this directive.
> - The template element must have a single direct child.

> :loudspeaker: This directive supports `transitions` and `animations`.

---

### `hx-else`
**Example:**
```html
<template hx-if="count == 0"><div>...</div></template>
<template hx-else="count == 1"><div>...</div></template>
<template hx-else><div>...</div></template>
```

**Structure:** `<template hx-else="[optional expression]">...</template>`

The `hx-else` directive enables an `if-then-else` paradigm. A `hx-if` or `hx-else` directive is required to precede it.

>**Note**:
> - A `template` element is required for this directive.
> - The template element must have a single direct child.

> :loudspeaker: This directive supports `transitions` and `animations`.

---

### `hx-each`
**Example:**
```html
<template hx-each="items"><div>...<div></template>
<template hx-each="items as item"><div>...<div></template>
<template hx-each="items as key => item"><div>...<div></template>
```
**Structure:**
```html
<template hx-each="[expression]">...</template>
<template hx-each="[expression] as [identifier]">...</template>
<template hx-each="[expression] as [key] => [identifier]">...</template>
```

`hx-each` is available for cases when you want to create new DOM nodes for each item in an array.

>**Note**:
> - A `template` element is required for this directive.
> - The template element must have a single direct child.

It exposes a `$each` local property with the following fields:

 - `count:` Retrieves the total count of the loop
 - `index:` Retrieves the current index
 - `value:` Retrieves the current value
 - `collection:` Retrieves the collection that is being iterated
 - `parent:` Retrieves the parent loop property, if any

It can iterate over arrays, key-value associative objects, and integer ranges.

A name can be specified for `$each.value` using the following syntax:

```html
<template hx-each="items as item">
	<p>{{ item }}</p>
</template>
```
A name can be specified for `$each.index` using the following syntax:

```html
<template hx-each="items as index => item">
	<p>{{ index }}{{ item }}</p>
</template>
```

#### Nesting `hx-each`s
You can nest `hx-each` loops. For example:

```html
<template hx-each="items as item">
    <template hx-each="item.subItems as subItem">
	    <div hx-text="subItem"></div>
    </template>
</template>
```

#### Iterating over an integer range

Iteration over integers are supported. Example:

```html
<template hx-each="10 as i"><div>...</div></template>
```

> By default, the iteration range is from `0` to `value - 1`.

Negative values can be specified. Example:

```html
<template hx-each="-10 as i"><div>...</div></template>
```

> By default, the iteration range is from to `value + 1` to `0`.

> :loudspeaker: This directive supports `transitions` and `animations`.

---

### `hx-show`
**Example:** `<div hx-show="open"></div>`

**Structure:** `<div hx-show="[expression]"></div>`

`hx-show` toggles the `display: none;` style on the element depending if the expression resolves to `true` or `false`.

> :loudspeaker: This directive supports `transitions` and `animations`.

---

### `hx-cloak`
**Example:** `<div hx-data="{}" hx-cloak></div>`

`hx-cloak` attributes are removed from elements when InlineJS initializes. This is useful for hiding pre-initialized DOM. It's typical to add the following global style for this to work:

```html
<style>
    [hx-cloak] { display: none; }
</style>
```

---

### `hx-next-tick`
**Example:** `<div hx-next-tick="console.log('DOM updated')"></div>`

**Structure:** `<div hx-next-tick="[expression]"></div>`

`hx-next-tick` executes an expression after InlineJS has made its reactive DOM updates. This is useful for running code that needs to access updated DOM elements or perform actions after reactive changes have been applied.

---

### `hx-next-idle`
**Example:** `<div hx-next-idle="performBackgroundTask()"></div>`

**Structure:** `<div hx-next-idle="[expression]"></div>`

`hx-next-idle` executes an expression when the system becomes idle. This is useful for performing non-critical background tasks that should only run when the browser is not busy with other operations.

---

### `hx-next-non-idle`
**Example:** `<div hx-next-non-idle="pauseBackgroundTask()"></div>`

**Structure:** `<div hx-next-non-idle="[expression]"></div>`

`hx-next-non-idle` executes an expression when the system is no longer idle. This is useful for pausing background tasks or performing actions when the browser becomes busy again.

---

## Magic Properties

---

### `$store`
**Example:** `<div hx-data="{ id: $store(myObject) }"></div>`

`$store` stores objects in global or component-local storage and returns a unique identifier. This is useful for persisting data across component instances or sharing data globally.

**Parameters:**
- `value`: The object to store
- `useLocal` (optional): If true, stores in component-local storage instead of global storage

**Example with local storage:**
```html
<div hx-data="{ localId: $store(myData, true) }"></div>
```

---

### `$resource`
**Example:** `<div hx-data="{ styles: $resource.getStyle('path/to/style.css') }"></div>`

`$resource` provides methods to load external resources like stylesheets, scripts, and data files.

**Available methods:**
- `get(params)`: Generic resource getter with configuration parameters
- `getStyle(path, concurrent?, attributes?)`: Load CSS stylesheets
- `getScript(path, concurrent?, attributes?)`: Load JavaScript files  
- `getData(path, concurrent?, json?)`: Load data files

**Parameters:**
- `path`: String or array of resource paths
- `concurrent` (optional): Whether to load resources concurrently
- `attributes` (optional): Additional HTML attributes for the resource element
- `json` (optional): Whether to parse response as JSON

**Examples:**
```html
<!-- Load a stylesheet -->
<div hx-init="$resource.getStyle('theme.css')"></div>

<!-- Load multiple scripts -->
<div hx-init="$resource.getScript(['lib1.js', 'lib2.js'], true)"></div>

<!-- Load JSON data -->
<div hx-data="{ data: $resource.getData('api/data.json', false, true) }"></div>
```

---

### `$waiting` 
**Example:** `<div hx-show="$waiting(myPromise)"></div>`

`$waiting` checks if promises or loops are still pending/running. Returns a boolean or promise that resolves to false when the operation completes.

**Supported types:**
- `Promise`: Returns a promise that resolves to false when the input promise completes
- `Loop`: Returns a promise that resolves to false when the loop finishes
- Other values: Returns false immediately

**Example:**
```html
<div hx-data="{ loading: false, result: null }">
    <button hx-on:click="loading = fetch('/api/data').then(r => result = r)">Load</button>
    <div hx-show="$waiting(loading)">Loading...</div>
    <div hx-show="!$waiting(loading) && result">{{ result }}</div>
</div>
```

---

### `$wrap`
**Example:** `<div hx-data="{ wrapped: $wrap(myFunction) }"></div>`

`$wrap` wraps functions to maintain proper scope context when called. This ensures that functions execute within the correct component scope.

**Example:**
```html
<div hx-data="{ 
    count: 0,
    increment() { this.count++ },
    wrappedIncrement: $wrap(function() { this.count++ })
}">
    <button hx-on:click="wrappedIncrement()">Increment</button>
    <span hx-text="count"></span>
</div>
```

---

### `$range`
**Example:** `<div hx-data="{ numbers: $range(1, 10) }"></div>`

`$range` creates numeric ranges, optionally with timing for animations.

**Parameters:**
- `from`: Starting value
- `to`: Ending value  
- `duration` (optional): Animation duration in milliseconds (default: 0)
- `delay` (optional): Animation delay in milliseconds (default: 0)

**Examples:**
```html
<!-- Simple range -->
<template hx-each="$range(1, 5) as num">
    <div hx-text="num"></div>
</template>

<!-- Timed range for animations -->
<div hx-data="{ progress: $range(0, 100, 2000) }">
    <div hx-style:width="progress + '%'"></div>
</div>
```

---

### `$attribute`
**Example:** `<div hx-init="$attribute.set('data-id', '123')"></div>`

`$attribute` provides methods to manipulate DOM element attributes on the current element.

**Available methods:**
- `set(key, value)`: Set an attribute value
- `unset(...keys)`: Remove one or more attributes
- `get(key)`: Get an attribute value (or array for multiple keys)
- `toggle(predicate, key, trueValue, falseValue?)`: Set attribute based on condition
- `contains(...keys)`: Check if all specified attributes exist

**Examples:**
```html
<div hx-data="{ active: false }">
    <!-- Set/unset attributes -->
    <button hx-on:click="$attribute.toggle(active, 'aria-pressed', 'true', 'false'); active = !active">
        Toggle
    </button>
    
    <!-- Get attribute values -->
    <div hx-text="$attribute.get('id')"></div>
    
    <!-- Multiple operations -->
    <div hx-init="$attribute.set('role', 'button').set('tabindex', '0')"></div>
</div>
```

---

### `$component`
**Example:** `<div hx-text="$component('main').message"></div>`

`$component` retrieves the storage/data of a specified component by its name or key.

**Parameters:**
- `name` (optional): The component name/key. If not provided, returns the current component's storage.

**Example:**
```html
<div hx-data="{ message: 'Hello' }" hx-component="main">
    <div hx-text="$component('main').message"></div>
    <div hx-text="$component().message"></div> <!-- Same as above -->
</div>
```

---

### `$locals`
**Example:** `<div hx-text="$locals.tempData"></div>`

`$locals` retrieves the local storage associated with the current element. Local storage is not reactive and is scoped to the element and its descendants.

**Example:**
```html
<div hx-locals="{ tempData: 'temporary' }">
    <span hx-text="$locals.tempData"></span>
</div>
```

---

### `$proxy`
**Example:** `<div hx-text="$proxy.rootData"></div>`

`$proxy` retrieves the root proxy object that contains the component's reactive data.

---

### `$native`
**Example:** `<div hx-text="$native(myArray).length"></div>`

`$native` retrieves the non-proxied (native) data associated with a key, bypassing reactivity.

**Parameters:**
- `key`: The data key to retrieve in native form

**Example:**
```html
<div hx-data="{ items: [1, 2, 3] }">
    <div hx-text="$native(items).push(4)"></div> <!-- Direct array manipulation -->
</div>
```

---

### `$refs`
**Example:** `<div hx-on:click="$refs.myButton.focus()"></div>`

`$refs` retrieves DOM elements marked with `hx-ref` inside the component.

**Example:**
```html
<div hx-data="{}">
    <input hx-ref="myInput" type="text">
    <button hx-on:click="$refs.myInput.focus()">Focus Input</button>
</div>
```

---

### `$scope`
**Example:** `<div hx-text="$scope.level"></div>`

`$scope` retrieves the current scope's data. In nested scopes, this returns the immediate scope's data.

**Example:**
```html
<div hx-data="{ level: 'top' }">
    <div hx-data="{ level: 'nested' }">
        <p hx-text="$scope.level"></p> <!-- Shows 'nested' -->
    </div>
</div>
```

---

### `$scopes`
**Example:** `<div hx-text="$scopes.length"></div>`

`$scopes` retrieves all scopes in the current component as an array, from innermost to outermost.

---

### `$stream`
**Example:** `<div hx-init="$stream(data, value => console.log(value))"></div>`

`$stream` streams the specified data using a callback, useful for handling asynchronous data flows.

**Parameters:**
- `data`: The data to stream
- `callback`: Function to call with each streamed value

---

### `$wait`
**Example:** `<div hx-show="!$wait(myPromise)"></div>`

`$wait` waits for the specified data using a callback, typically used with promises or asynchronous operations.

**Note:** This is different from `$waiting` which checks pending status.

---

### `$static`
**Example:** `<div hx-text="$static(expensiveComputation())"></div>`

`$static` suppresses reactivity for the specified access, preventing the expression from being re-evaluated when dependencies change.

**Example:**
```html
<div hx-data="{ count: 0, timestamp: Date.now() }">
    <div hx-text="$static(timestamp)"></div> <!-- Won't update when count changes -->
    <button hx-on:click="count++">{{ count }}</button>
</div>
```

---

### `$unoptimized`
**Example:** `<div hx-text="$unoptimized(dynamicExpression)"></div>`

`$unoptimized` suppresses optimizations for the specified access, forcing full evaluation each time.

---

### `$watch`
**Example:** `<div hx-init="$watch('count', value => console.log('Count:', value))"></div>`

`$watch` watches a given expression for changes and executes a callback when changes occur.

**Parameters:**
- `expression`: The expression to watch (string or function)
- `callback`: Function to call when the expression changes

**Example:**
```html
<div hx-data="{ count: 0 }" hx-init="$watch('count', value => console.log('New count:', value))">
    <button hx-on:click="count++">{{ count }}</button>
</div>
```

---

### `$pick`
**Example:** `<div hx-text="$pick(condition, 'Yes', 'No')"></div>`

`$pick` returns one of two values based on a predicate (ternary operator alternative).

**Parameters:**
- `predicate`: Boolean condition
- `trueValue`: Value to return if predicate is true
- `falseValue`: Value to return if predicate is false

**Example:**
```html
<div hx-data="{ isLoggedIn: false }">
    <span hx-text="$pick(isLoggedIn, 'Welcome back!', 'Please log in')"></span>
</div>
```

---

### `$rel`
**Example:** `<div hx-show="$rel.ge(age, 18)"></div>`

`$rel` provides access to relational operators for comparisons.

**Available functions:** `comp`, `lt`, `le`, `eq`, `eqs`, `nes`, `ne`, `ge`, `gt`

**Example:**
```html
<div hx-data="{ age: 25 }">
    <div hx-show="$rel.ge(age, 18)">Adult content</div>
    <div hx-show="$rel.lt(age, 13)">Child content</div>
</div>
```

---

### `$log`
**Example:** `<div hx-show="$log(condition1, '&&', condition2)"></div>`

`$log` provides access to logical operators.

**Available operators:** `&&`, `||`, `!`

**Example:**
```html
<div hx-data="{ user: { isActive: true, isPremium: false } }">
    <div hx-show="$log(user.isActive, '&&', user.isPremium)">Premium features</div>
    <div hx-show="$log('!', user.isActive)">Account disabled</div>
</div>
```

---

### `$math`
**Example:** `<div hx-text="$math(price, '*', quantity)"></div>`

`$math` provides access to arithmetic operators.

**Available operators:** `+`, `-`, `*`, `/`, `%`, `**`

**Example:**
```html
<div hx-data="{ price: 10, quantity: 3 }">
    <div hx-text="'Total: $' + $math(price, '*', quantity)"></div>
    <div hx-text="'Tax: $' + $math($math(price, '*', quantity), '*', 0.1)"></div>
</div>
```

---

### `$dom`
**Example:** `<div hx-text="$dom('scrollTop')"></div>`

`$dom` provides access to DOM properties of the current element.

**Example:**
```html
<div hx-data="{}" hx-text="'Width: ' + $dom('offsetWidth') + 'px'"></div>
```

---

### `$class`
**Example:** `<div hx-init="$class.add('active')"></div>`

`$class` provides helpers for manipulating CSS classes on the current element.

**Available methods:**
- `add(...classes)`: Add classes
- `remove(...classes)`: Remove classes
- `toggle(class, force?)`: Toggle a class
- `contains(class)`: Check if class exists

**Example:**
```html
<div hx-data="{ active: false }">
    <button hx-on:click="$class.toggle('active'); active = !active">
        Toggle Active
    </button>
</div>
```

---

### `$eval`
**Example:** `<div hx-text="$eval('2 + 2')"></div>`

`$eval` evaluates an expression string and returns the result.

**Example:**
```html
<div hx-data="{ expression: '5 * 3' }">
    <div hx-text="'Result: ' + $eval(expression)"></div>
</div>
```

---

### `$nextTick`
**Example:** `<div hx-init="$nextTick(() => console.log('DOM updated'))"></div>`

`$nextTick` executes a given expression **after** InlineJS has made its reactive DOM updates.

**Example:**
```html
<div hx-data="{ items: [] }">
    <button hx-on:click="items.push('new'); $nextTick(() => $refs.list.scrollTop = $refs.list.scrollHeight)">
        Add Item
    </button>
    <ul hx-ref="list">
        <template hx-each="items as item">
            <li hx-text="item"></li>
        </template>
    </ul>
</div>
```

---

### `$style`
**Example:** `<div hx-init="$style.set('color', 'red')"></div>`

`$style` provides methods to manipulate CSS styles on the current element.

**Available methods:**
- `set(key, value)`: Set a style property
- `unset(...keys)`: Remove one or more style properties
- `get(key)`: Get a style property value (or array for multiple keys)
- `toggle(predicate, key, trueValue, falseValue?)`: Set style based on condition

**Examples:**
```html
<div hx-data="{ isActive: false }">
    <!-- Set/unset styles -->
    <button hx-on:click="$style.toggle(isActive, 'backgroundColor', 'green', 'red'); isActive = !isActive">
        Toggle Style
    </button>
    
    <!-- Get style values -->
    <div hx-text="'Current color: ' + $style.get('color')"></div>
    
    <!-- Multiple operations -->
    <div hx-init="$style.set('padding', '10px').set('margin', '5px')"></div>
</div>
```

---

### `$code`
**Example:** `<div hx-init="$code('myBlock')"></div>`

`$code` allows execution or retrieval of named code blocks defined elsewhere.

**Parameters:**
- `name`: The name of the code block
- `execute` (optional): Whether to execute the code (default: true)
- `callback` (optional): Callback function to handle the result

**Examples:**
```html
<!-- Define a code block -->
<hx-code name="myBlock">
    console.log('Hello from code block');
    return 'executed';
</hx-code>

<!-- Execute the code block -->
<div hx-init="$code('myBlock')"></div>

<!-- Get code without executing -->
<div hx-text="$code('myBlock', false)"></div>

<!-- Execute with callback -->
<div hx-init="$code('myBlock', true, result => console.log('Result:', result))"></div>
```

---

### `$inlinejs`
**Example:** `<div hx-text="$inlinejs ? 'InlineJS is available' : 'Not available'"></div>`

`$inlinejs` provides access to the global InlineJS framework object, allowing interaction with the framework's core functionality.

---

### `$global`
**Example:** `<div hx-text="$global.componentCount"></div>`

`$global` provides access to the global InlineJS configuration and state information.

---

### `$utilities`
**Example:** `<div hx-text="$utilities.randomString(10)"></div>`

`$utilities` provides access to InlineJS utility functions for common operations.

---

### `$values`
**Example:** `<div hx-text="$values.toString(123)"></div>`

`$values` provides access to InlineJS value manipulation and conversion helpers.

---

### `$version`
**Example:** `<div hx-text="'InlineJS version: ' + $version"></div>`

`$version` returns the current version of the InlineJS framework.

---

### `$str`
**Example:** `<div hx-text="$str.camelCase('hello-world')"></div>`

`$str` provides string manipulation utilities.

**Available methods:**
- `convert(value)`: Convert any value to string
- `camelCase(value, ucfirst?, separator?)`: Convert to camelCase
- `snakeCase(value, separator?)`: Convert to snake_case
- `random(length?)`: Generate random string (default length: 9)
- `slug(value)`: Convert to URL-friendly slug

**Examples:**
```html
<div hx-data="{ text: 'hello world' }">
    <div hx-text="'Camel: ' + $str.camelCase(text)"></div>
    <div hx-text="'Snake: ' + $str.snakeCase(text)"></div>
    <div hx-text="'Slug: ' + $str.slug(text)"></div>
    <div hx-text="'Random: ' + $str.random(5)"></div>
</div>
```

---

### `$framework`
**Example:** `<div hx-text="'Framework version: ' + $framework.version"></div>`

`$framework` provides access to framework-specific information and metadata.

**Available properties:**
- `version`: Get the current framework version

## Security
If you find a security vulnerability, please send an email to [benplaeska@gmail.com]()

`InlineJS` relies on a custom implementation using the `Function` object to evaluate its directives. Despite being more secure then `eval()`, its use is prohibited in some environments, such as Google Chrome App, using restrictive Content Security Policy (CSP).

If you use `InlineJS` in a website dealing with sensitive data and requiring [CSP](https://csp.withgoogle.com/docs/strict-csp.html), you need to include `unsafe-eval` in your policy. A robust policy correctly configured will help protecting your users when using personal or financial data.

Since a policy applies to all scripts in your page, it's important that other external libraries included in the website are carefully reviewed to ensure that they are trustworthy and they won't introduce any Cross Site Scripting vulnerability either using the `eval()` function or manipulating the DOM to inject malicious code in your page.

## License

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
