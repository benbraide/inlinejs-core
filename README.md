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

## Security
If you find a security vulnerability, please send an email to [benplaeska@gmail.com]()

`InlineJS` relies on a custom implementation using the `Function` object to evaluate its directives. Despite being more secure then `eval()`, its use is prohibited in some environments, such as Google Chrome App, using restrictive Content Security Policy (CSP).

If you use `InlineJS` in a website dealing with sensitive data and requiring [CSP](https://csp.withgoogle.com/docs/strict-csp.html), you need to include `unsafe-eval` in your policy. A robust policy correctly configured will help protecting your users when using personal or financial data.

Since a policy applies to all scripts in your page, it's important that other external libraries included in the website are carefully reviewed to ensure that they are trustworthy and they won't introduce any Cross Site Scripting vulnerability either using the `eval()` function or manipulating the DOM to inject malicious code in your page.

## License

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
